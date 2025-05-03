
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import NewClientModal from '@/components/NewClientModal';
import { useClients } from '@/hooks/useClients';
import { useClientPolling } from '@/hooks/useClientPolling';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsToolbar from '@/components/clients/ClientsToolbar';
import ClientsContent from '@/components/clients/ClientsContent';
import { useToast } from '@/hooks/use-toast';

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    clients,
    isLoading,
    error,
    addClient,
    deleteClient,
    updateClientStatus
  } = useClients();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading clients",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Set up client polling
  useClientPolling({
    clients,
    updateClientStatus
  });

  const handleAddClient = (newClient: {
    name: string;
    country: string;
    domain: string;
    country_id: string;
    logo?: string;
  }) => {
    addClient(newClient);
  };

  console.log("Current clients state:", clients);
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientsHeader 
          title="Clients" 
          description="This is about selecting or creating clients."
        />
        
        <ClientsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClient={() => setIsModalOpen(true)}
        />
        
        <ClientsContent
          clients={clients}
          isLoading={isLoading}
          error={error as Error | null}
          searchQuery={searchQuery}
          onDeleteClient={deleteClient}
        />
      </div>
      
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddClient} 
      />
    </MainLayout>
  );
};

export default ClientsPage;
