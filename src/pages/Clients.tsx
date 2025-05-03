
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import NewClientModal from '@/components/NewClientModal';
import { useToast } from '@/hooks/use-toast';
import ClientsList from '@/components/clients/ClientsList';
import { countryNames } from '@/utils/clientDataUtils';

interface Client {
  id: string;
  name: string;
  country: string;
  domain: string;
  logo?: string;
  agent_status: 'ready' | 'in_progress';
}

const ClientsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Acme Corp', country: 'us', domain: 'acme.com', agent_status: 'ready' },
    { id: '2', name: 'Globex Industries', country: 'uk', domain: 'globex.co.uk', agent_status: 'in_progress' },
    { id: '3', name: 'TechFuture', country: 'ca', domain: 'techfuture.ca', agent_status: 'ready' },
  ]);
  
  // For polling the status of in_progress clients
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      // This would be a call to your Supabase database in a real implementation
      // For demo, we'll simulate randomly changing an in_progress client to ready
      const inProgressClients = clients.filter(client => client.agent_status === 'in_progress');
      
      if (inProgressClients.length > 0 && Math.random() > 0.7) {
        const randomClient = inProgressClients[Math.floor(Math.random() * inProgressClients.length)];
        
        setClients(prev => 
          prev.map(client => 
            client.id === randomClient.id 
              ? {...client, agent_status: 'ready' as const} 
              : client
          )
        );
        
        toast({
          title: "Client Ready",
          description: `${randomClient.name} is now ready!`,
        });
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(pollingInterval);
  }, [clients, toast]);
  
  const handleAddClient = (newClient: { name: string; country: string; domain: string }) => {
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      country: newClient.country,
      domain: newClient.domain,
      agent_status: 'in_progress'
    };
    
    setClients([client, ...clients]);
  };
  
  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    toast({
      title: "Client Deleted",
      description: "The client has been deleted successfully",
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold relative pb-2">Clients</h1>
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-neo-red"></span>
          <p className="text-gray-600 mt-3">This is about selecting or creating clients.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              className="pl-10 border-gray-300 focus:border-neo-red focus:ring-neo-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-neo-red hover:bg-red-600 text-white"
          >
            New Client
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-1">
          <ClientsList 
            clients={clients} 
            searchQuery={searchQuery} 
            countryNames={countryNames} 
            onDeleteClient={handleDeleteClient}
          />
        </div>
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
