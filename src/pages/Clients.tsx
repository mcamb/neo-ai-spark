
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsToolbar from '@/components/clients/ClientsToolbar';
import ClientsContent from '@/components/clients/ClientsContent';
import { useClients } from '@/hooks/useClients';
import NewClientModal from '@/components/NewClientModal';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clients, isLoading, error, addClient, deleteClient, refetch } = useClients();
  
  console.log("Current clients state:", clients);
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddClient = (clientData: any) => {
    addClient(clientData);
    handleCloseModal();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientsHeader 
          title="Clients" 
          description="View and manage your client accounts."
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
          onDeleteClient={deleteClient}
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
