
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsToolbar from '@/components/clients/ClientsToolbar';
import ClientsContent from '@/components/clients/ClientsContent';
import { useClients } from '@/hooks/useClients';
import NewClientModal from '@/components/NewClientModal';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useClientPolling } from '@/hooks/useClientPolling';
import EditClientModal from '@/components/EditClientModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { clients, isLoading, error, refetch } = useClients();
  
  // Function to update client status
  const updateClientStatus = useCallback(async (clientId: string, status: 'ready' | 'in_progress') => {
    const { error } = await supabase
      .from('clients')
      .update({ agent_status: status })
      .eq('id', clientId);
    
    if (error) {
      console.error("Error updating client status:", error);
      throw error;
    }
    
    // Refetch clients to get the latest data
    refetch();
  }, [refetch]);

  // Initialize client polling
  useClientPolling({
    clients,
    updateClientStatus
  });

  useEffect(() => {
    // When component mounts, force a data refresh
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (error) {
      toast.error("Error loading clients: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [error]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddClient = () => {
    // Refetch clients after a new client is added
    refetch();
  };

  const handleEditClient = (id: string) => {
    setSelectedClientId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClientId(null);
  };

  const handleDeletePrompt = (id: string) => {
    setSelectedClientId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!selectedClientId) return;
    
    try {
      console.log("Deleting client with ID:", selectedClientId);
      
      // Execute the delete operation with await to ensure it completes
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClientId);
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      // Close the dialog
      setDeleteDialogOpen(false);
      
      // Show success message
      toast.success("Client deleted successfully");
      
      // Reset selected client
      setSelectedClientId(null);
      
      // Force an immediate refetch to update the UI
      await refetch();
      
      console.log("Client deleted and data refreshed");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client: " + (error instanceof Error ? error.message : String(error)));
      setDeleteDialogOpen(false);
      setSelectedClientId(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientsHeader 
          title="Clients" 
          description="View your client accounts."
        />
        
        <ClientsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={handleOpenModal}
        />
        
        <ClientsContent 
          clients={clients} 
          isLoading={isLoading} 
          error={error} 
          searchQuery={searchQuery}
          onDeleteClient={handleDeletePrompt}
          onEditClient={handleEditClient}
          refetch={refetch}
        />
      </div>
      
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleAddClient}
      />

      {selectedClientId && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          clientId={selectedClientId}
          onSubmit={refetch}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Clients;
