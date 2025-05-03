
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsToolbar from '@/components/clients/ClientsToolbar';
import ClientsContent from '@/components/clients/ClientsContent';
import { useClients } from '@/hooks/useClients';
import NewClientModal from '@/components/NewClientModal';
import { toast } from "sonner";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clients, isLoading, error, refetch } = useClients();
  
  console.log("Clients page - Current clients state:", clients);
  console.log("Clients page - isLoading:", isLoading);
  console.log("Clients page - error:", error);

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
    handleCloseModal();
    refetch();
  };

  const handleRefresh = () => {
    toast.info("Refreshing client data...");
    refetch();
  };

  const handleDeleteClient = (id: string) => {
    // Currently this does nothing but is required by the interface
    console.log("Delete client requested for ID:", id);
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
        
        <button 
          onClick={handleRefresh} 
          className="text-sm text-neo-red hover:underline flex items-center"
        >
          Manual Refresh
        </button>
        
        <ClientsContent 
          clients={clients} 
          isLoading={isLoading} 
          error={error} 
          searchQuery={searchQuery}
          onDeleteClient={handleDeleteClient} 
          refetch={refetch}
        />
      </div>
      
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleAddClient}
      />
    </MainLayout>
  );
};

export default Clients;
