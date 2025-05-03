import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import NewClientModal from '@/components/NewClientModal';
import { useToast } from '@/hooks/use-toast';
import ClientsList from '@/components/clients/ClientsList';
import { countryNames } from '@/utils/clientDataUtils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Client {
  id: string;
  name?: string;
  country: string;
  domain: string;
  logo?: string;
  agent_status: 'ready' | 'in_progress';
  country_id?: string;
}

type CountryOption = {
  id: string;
  country: string;
};

const fetchClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      domain,
      country:countries(id, country)
    `);

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match our Client interface
  return data.map(item => ({
    id: item.id,
    domain: item.domain,
    country: item.country?.country?.toLowerCase().substring(0, 2) || 'us', // Convert to country code format
    country_id: item.country?.id,
    agent_status: 'ready' as const, // Default to ready for now
    name: item.domain.split('.')[0] // Use domain name as client name for now
  }));
};

const ClientsPage = () => {
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  const addClientMutation = useMutation({
    mutationFn: async (newClient: { name: string; country: string; domain: string; country_id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([
          { 
            domain: newClient.domain,
            country_id: newClient.country_id
          }
        ])
        .select();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success",
        description: "Client created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create client: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Deleted",
        description: "The client has been deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete client: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleAddClient = (newClient: {
    name: string;
    country: string;
    domain: string;
    country_id: string;
  }) => {
    addClientMutation.mutate(newClient);
  };

  const handleDeleteClient = (id: string) => {
    deleteClientMutation.mutate(id);
  };

  // For polling the status of in_progress clients
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      const inProgressClients = clients.filter(client => client.agent_status === 'in_progress');
      
      if (inProgressClients.length > 0 && Math.random() > 0.7) {
        const randomClient = inProgressClients[Math.floor(Math.random() * inProgressClients.length)];
        
        // This is just for the demo effect - in a real app this would come from the database
        queryClient.setQueryData(['clients'], (oldClients: Client[] | undefined) => 
          (oldClients || []).map(client => client.id === randomClient.id ? {
            ...client,
            agent_status: 'ready' as const
          } : client)
        );
        
        toast({
          title: "Client Ready",
          description: `${randomClient.name} is now ready!`
        });
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollingInterval);
  }, [clients, toast, queryClient]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold relative pb-2">Clients</h1>
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-neo-red"></span>
          <p className="mt-3 text-custom-text">This is about selecting or creating clients.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Type here to search" 
              className="pl-10 border-gray-300 focus:border-neo-red focus:ring-neo-red" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-neo-red hover:bg-red-600 text-white"
          >
            Add client
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Loading clients...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Error loading clients: {(error as Error).message}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-1">
            <ClientsList 
              clients={clients} 
              searchQuery={searchQuery} 
              countryNames={countryNames} 
              onDeleteClient={handleDeleteClient} 
            />
          </div>
        )}
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
