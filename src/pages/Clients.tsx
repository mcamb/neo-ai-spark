
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
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Completely revised deletion function with a simple, direct approach
  const handleDeleteClient = async () => {
    if (!selectedClientId || isDeleting) return;
    
    setIsDeleting(true);
    setDeleteDialogOpen(false);
    
    try {
      // Simple, direct deletion
      const deleteToastId = toast.loading("Deleting client...");
      
      // Delete related records first (in a single operation)
      await supabase
        .from('relevance_scores')
        .delete()
        .eq('client_id', selectedClientId);
      
      // Then delete the client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClientId);
        
      if (error) {
        toast.dismiss(deleteToastId);
        toast.error(`Deletion failed: ${error.message}`);
        console.error("Database error:", error);
      } else {
        toast.dismiss(deleteToastId);
        toast.success("Client deleted successfully");
        
        // Update the client list after deletion
        setTimeout(() => {
          refetch();
        }, 500);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Exception:", err);
    } finally {
      setIsDeleting(false);
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
          isLoading={isLoading || isDeleting} 
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
            <AlertDialogAction 
              onClick={handleDeleteClient} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Clients;
