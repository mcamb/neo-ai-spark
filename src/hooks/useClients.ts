
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
  console.log("Fetching clients from Supabase...");
  
  // First, get all countries for reference
  const { data: countries, error: countryError } = await supabase
    .from('countries')
    .select('*');
    
  if (countryError) {
    console.error("Error fetching countries:", countryError);
  }
  
  console.log("Available countries:", countries || []);
  
  // Get all clients
  const { data, error } = await supabase
    .from('clients')
    .select('*');

  if (error) {
    console.error("Error fetching clients:", error);
    throw new Error(`Failed to fetch clients: ${error.message}`);
  }

  console.log("Raw client data from DB:", data || []);
  
  if (!data || data.length === 0) {
    console.log("No clients found in database - returning empty array");
    return [];
  }
  
  // Transform the data to match our Client interface
  const transformedClients = data.map(item => {
    // Default to 'us' if we can't determine country
    let countryCode = 'us';
    
    if (item.country_id && countries && countries.length > 0) {
      const country = countries.find(c => c.id === item.country_id);
      if (country) {
        // Take first two letters of country name as code
        countryCode = country.country.toLowerCase().substring(0, 2);
        console.log(`Mapped country ID ${item.country_id} to code ${countryCode} from name ${country.country}`);
      } else {
        console.log(`Could not find country with ID ${item.country_id}`);
      }
    }
    
    const clientData = {
      id: item.id,
      domain: item.domain || '',
      name: item.name || (item.domain ? item.domain.split('.')[0] : 'Unnamed Client'),
      country: countryCode,
      country_id: item.country_id,
      agent_status: item.agent_status || 'in_progress',
      logo: item.logo,
    };
    
    console.log("Transformed client:", clientData);
    return clientData;
  });
  
  console.log(`Returning ${transformedClients.length} clients`);
  return transformedClients;
};

// Function to add a test client directly (for debugging)
export const addTestClient = async () => {
  console.log("Adding test client to database...");
  
  // First, check if we have any countries
  const { data: countries } = await supabase
    .from('countries')
    .select('*');
    
  console.log("Available countries for test client:", countries || []);
  
  let countryId;
  
  // If no countries exist, create one
  if (!countries || countries.length === 0) {
    console.log("No countries found, creating a test country...");
    const { data: newCountry, error: countryError } = await supabase
      .from('countries')
      .insert({ country: 'United States' })
      .select();
      
    if (countryError) {
      console.error("Error creating test country:", countryError);
      throw new Error(`Failed to create test country: ${countryError.message}`);
    }
    
    countryId = newCountry?.[0]?.id;
    console.log("Created new country with ID:", countryId);
  } else {
    countryId = countries[0].id;
    console.log("Using existing country with ID:", countryId);
  }
  
  // Now create a test client with properly typed agent_status
  const testClient = {
    name: "Test Client",
    domain: "testclient.com",
    country_id: countryId,
    agent_status: 'ready' as const // Fixed: Explicitly type as 'ready' | 'in_progress'
  };
  
  const { data, error } = await supabase
    .from('clients')
    .insert(testClient)
    .select();
    
  if (error) {
    console.error("Error adding test client:", error);
    throw new Error(`Failed to add test client: ${error.message}`);
  }
  
  console.log("Successfully added test client:", data);
  return data;
};

export const useClients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  console.log("useClients hook - clients:", clients);

  const addClientMutation = useMutation({
    mutationFn: async (newClient: { name: string; country: string; domain: string; country_id: string; logo?: string }) => {
      console.log("Adding new client:", newClient);
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

      if (error) {
        console.error("Error in addClientMutation:", error);
        throw new Error(error.message);
      }
      console.log("Client added successfully:", data);
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
    refetch,
    addTestClient,
    addClient: (newClient: { name: string; country: string; domain: string; country_id: string; logo?: string }) => 
      addClientMutation.mutate(newClient),
    deleteClient: (id: string) => deleteClientMutation.mutate(id),
    updateClientStatus
  };
};
