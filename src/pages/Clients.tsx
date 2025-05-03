
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
    if (!selectedClientId || isDeleting) return;
    
    setIsDeleting(true);
    setDeleteDialogOpen(false);
    
    const toastId = toast.loading("Deleting client...");
    
    try {
      console.log("Deleting client with ID:", selectedClientId);
      
      // First, delete related relevance scores
      const { error: relScoresError } = await supabase
        .from('relevance_scores')
        .delete()
        .eq('client_id', selectedClientId);
        
      if (relScoresError) {
        console.error("Error deleting related relevance scores:", relScoresError);
        // Continue with client deletion attempt even if this fails
      } else {
        console.log("Successfully deleted related relevance scores");
      }
      
      // Now delete the client
      const { error: clientError } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClientId);
      
      if (clientError) {
        console.error("Error deleting client:", clientError);
        toast.dismiss(toastId);
        toast.error(`Failed to delete client: ${clientError.message}`);
      } else {
        console.log("Client successfully deleted!");
        toast.dismiss(toastId);
        toast.success("Client deleted successfully");
        refetch(); // Refetch data after successful deletion
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("Exception during deletion:", e);
      toast.dismiss(toastId);
      toast.error(`Error: ${errorMessage}`);
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
