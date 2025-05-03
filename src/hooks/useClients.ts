
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  name: string;
  country: string;
  domain: string;
  logo?: string;
  agent_status: 'ready' | 'in_progress';
  country_id?: string;
}

const fetchClients = async () => {
  console.log("Fetching clients...");
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      domain,
      name,
      agent_status,
      logo,
      country:countries(id, country)
    `);

  if (error) {
    console.error("Error fetching clients:", error);
    throw new Error(error.message);
  }

  console.log("Raw client data from DB:", data);
  
  // Transform the data to match our Client interface
  return data.map(item => {
    const clientData = {
      id: item.id,
      domain: item.domain,
      name: item.name || item.domain.split('.')[0], // Use name from DB or fallback to domain
      country: item.country?.country?.toLowerCase().substring(0, 2) || 'us', // Convert to country code format
      country_id: item.country?.id,
      agent_status: item.agent_status, // Now using the actual agent_status from the database
      logo: item.logo,
    };
    
    console.log("Transformed client:", clientData);
    return clientData;
  });
};

export const useClients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: clients = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  console.log("useClients hook - clients:", clients);

  const addClientMutation = useMutation({
    mutationFn: async (newClient: { name: string; country: string; domain: string; country_id: string; logo?: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([
          { 
            domain: newClient.domain,
            name: newClient.name,
            country_id: newClient.country_id,
            logo: newClient.logo
            // agent_status will use the default value from the database ('in_progress')
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
    onSuccess: () => {
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

  const updateClientStatus = async (clientId: string, status: 'ready' | 'in_progress') => {
    try {
      console.log(`Updating client ${clientId} status to ${status}`);
      await supabase
        .from('clients')
        .update({ agent_status: status })
        .eq('id', clientId);
      
      // Invalidate the query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      if (status === 'ready') {
        toast({
          title: "Client Ready",
          description: `The client is now ready!`
        });
      }
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  return {
    clients,
    isLoading,
    error,
    addClient: (newClient: { name: string; country: string; domain: string; country_id: string; logo?: string }) => 
      addClientMutation.mutate(newClient),
    deleteClient: (id: string) => deleteClientMutation.mutate(id),
    updateClientStatus
  };
};
