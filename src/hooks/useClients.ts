
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  
  try {
    // Get all clients with explicit SELECT to ensure we get all fields
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, domain, logo, agent_status, country_id');

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
      // Create a default country code if none is provided
      const countryCode = item.country_id ? 'us' : 'us';
      
      const clientData: Client = {
        id: item.id || '',
        domain: item.domain || '',
        name: item.name || (item.domain ? item.domain.split('.')[0] : 'Unnamed Client'),
        country: countryCode,
        country_id: item.country_id,
        agent_status: item.agent_status as 'ready' | 'in_progress' || 'in_progress',
        logo: item.logo,
      };
      
      console.log("Transformed client:", clientData);
      return clientData;
    });
    
    console.log(`Returning ${transformedClients.length} clients`);
    return transformedClients;
  } catch (error) {
    console.error("Error in fetchClients function:", error);
    throw error;
  }
};

export const useClients = () => {
  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    retry: 1,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    staleTime: 30000, // Data considered fresh for 30 seconds
  });

  console.log("useClients hook - clients:", clients);

  return {
    clients,
    isLoading,
    error,
    refetch
  };
};
