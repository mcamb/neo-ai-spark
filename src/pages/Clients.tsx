
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
    if (!selectedClientId || isDeleting) {
      console.log("No client selected for deletion or deletion already in progress");
      return;
    }
    
    try {
      // Set deleting state to prevent multiple deletion attempts
      setIsDeleting(true);
      
      // Close the dialog immediately for better UX
      setDeleteDialogOpen(false);
      
      // Show pending toast with ID to track it
      const pendingToastId = toast.loading(`Deleting client ID: ${selectedClientId}...`);
      
      console.log("Starting deletion process for client ID:", selectedClientId);
      
      // Step 1: Delete related records in relevance_scores first
      console.log("Step 1: Deleting related records in relevance_scores for client:", selectedClientId);
      const { data: relatedData, error: relatedQueryError } = await supabase
        .from('relevance_scores')
        .select('id')
        .eq('client_id', selectedClientId);
        
      if (relatedQueryError) {
        console.error("Error querying related records:", relatedQueryError);
        toast.error(`Failed to query related records: ${relatedQueryError.message}`);
        setIsDeleting(false);
        toast.dismiss(pendingToastId);
        return;
      }
      
      if (relatedData && relatedData.length > 0) {
        console.log(`Found ${relatedData.length} related records to delete`);
        
        const { error: relatedDeleteError } = await supabase
          .from('relevance_scores')
          .delete()
          .eq('client_id', selectedClientId);
          
        if (relatedDeleteError) {
          console.error("Error deleting related records:", relatedDeleteError);
          toast.error(`Failed to delete related records: ${relatedDeleteError.message}`);
          setIsDeleting(false);
          toast.dismiss(pendingToastId);
          return;
        }
        
        console.log("Successfully deleted related records");
      } else {
        console.log("No related records found to delete");
      }
      
      // Add a small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Now delete the client
      console.log("Step 2: Deleting client with ID:", selectedClientId);
      const { error: clientDeleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClientId);
      
      if (clientDeleteError) {
        console.error("Error deleting client:", clientDeleteError);
        toast.dismiss(pendingToastId);
        toast.error(`Failed to delete client: ${clientDeleteError.message}`);
        setIsDeleting(false);
        return;
      }
      
      // Successful deletion
      console.log("Client successfully deleted!");
      toast.dismiss(pendingToastId);
      toast.success("Client deleted successfully");
      
      // Reset state
      setSelectedClientId(null);
      setIsDeleting(false);
      
      // Force refetch with significant delay to ensure consistency
      console.log("Scheduling data refetch...");
      setTimeout(() => {
        console.log("Executing refetch after deletion");
        refetch();
      }, 2500);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("Exception during client deletion:", e);
      toast.error(`Error deleting client: ${errorMessage}`);
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
