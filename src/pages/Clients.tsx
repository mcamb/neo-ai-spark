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
    if (!selectedClientId) {
      console.log("No client selected for deletion");
      return;
    }
    
    try {
      console.log("Starting deletion process for client ID:", selectedClientId);
      
      // Close the dialog immediately for better UX
      setDeleteDialogOpen(false);
      
      // Show pending toast
      const pendingToast = toast.loading("Deleting client...");
      
      console.log("First checking for related records in relevance_scores table");
      
      // First delete any related scores that might be preventing deletion
      const { error: relatedError } = await supabase
        .from('relevance_scores')
        .delete()
        .eq('client_id', selectedClientId);
        
      if (relatedError) {
        console.warn("Note: Error while cleaning related records:", relatedError);
        // Continue with deletion attempt even if this fails
      } else {
        console.log("Successfully removed related records or none existed");
      }
      
      // Brief delay to ensure related records deletion completes
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Now attempt to delete the actual client
      console.log("Now sending DELETE request to Supabase for client ID:", selectedClientId);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClientId);
      
      // Dismiss the pending toast
      toast.dismiss(pendingToast);
      
      if (error) {
        console.error("Delete operation failed with error:", error);
        toast.error("Failed to delete client: " + error.message);
        return;
      }
      
      console.log("Delete operation completed successfully");
      
      // Show success message
      toast.success("Client deleted successfully");
      
      // Reset selected client ID
      setSelectedClientId(null);
      
      // Refetch data after successful deletion
      // Delay refetch significantly to ensure the database has time to process the deletion
      setTimeout(() => {
        console.log("Triggering refetch after deletion");
        refetch();
      }, 2000); // Increased timeout further to ensure the database has time to process the deletion
    } catch (e) {
      console.error("Exception during client deletion:", e);
      toast.error("Error deleting client: " + (e instanceof Error ? e.message : String(e)));
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
