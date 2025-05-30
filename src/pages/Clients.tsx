import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsToolbar from '@/components/clients/ClientsToolbar';
import ClientsContent from '@/components/clients/ClientsContent';
import { useClients } from '@/hooks/useClients';
import NewClientModal from '@/components/clients/NewClientModal';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import EditClientModal from '@/components/EditClientModal';
import DeleteClientDialog from '@/components/clients/DeleteClientDialog';
import { useClientDeletion } from '@/hooks/useClientDeletion';
import { useClientModification } from '@/hooks/useClientModification';
import { useClientRealtime } from '@/hooks/useClientRealtime';
import { setupRealtimeForClients } from '@/utils/setupRealtime';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, isLoading, error, refetch } = useClients();
  
  // Client deletion logic
  const { 
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeletePrompt,
    handleDeleteClient
  } = useClientDeletion({ refetch });
  
  // Client modification logic (add/edit)
  const {
    isModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    handleAddClient,
    isSubmitting,
    isEditModalOpen,
    selectedClientId,
    handleEditClient,
    handleCloseEditModal
  } = useClientModification({ refetch });
  
  // Subscribe to real-time updates for client status changes
  useClientRealtime({ refetch });
  
  // Function to update client status - keeping this in case needed later
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

  useEffect(() => {
    // When component mounts, force a data refresh and ensure realtime is setup
    (async () => {
      await setupRealtimeForClients();
      refetch();
    })();
  }, [refetch]);

  useEffect(() => {
    if (error) {
      toast.error("Error loading clients: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [error]);

  // Combine loading states for better UX
  const isPageLoading = isLoading || isDeleting;

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientsHeader 
          title="Clients" 
          description="Select your client or create a new one. It takes about 2 minutes until the details are ready."
        />
        
        <ClientsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={handleOpenAddModal}
          isDisabled={isPageLoading}
        />
        
        <ClientsContent 
          clients={clients} 
          isLoading={isPageLoading} 
          error={error} 
          searchQuery={searchQuery}
          onDeleteClient={handleDeletePrompt}
          onEditClient={handleEditClient}
          refetch={refetch}
        />
      </div>
      
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={handleCloseAddModal} 
        onSubmit={handleAddClient}
        isSubmitting={isSubmitting}
      />

      {selectedClientId && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          clientId={selectedClientId}
          onSubmit={refetch}
        />
      )}

      <DeleteClientDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteClient}
        isDeleting={isDeleting}
      />
    </MainLayout>
  );
};

export default Clients;
