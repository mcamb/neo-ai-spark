
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
    // First fetch clients with all necessary fields
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, domain, logo, agent_status, country_id');

    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
    }

    console.log("Raw client data from DB:", clientsData || []);
    
    if (!clientsData || clientsData.length === 0) {
      console.log("No clients found in database - returning empty array");
      return [];
    }
    
    // Fetch all countries to map with client.country_id
    const { data: countriesData, error: countriesError } = await supabase
      .from('countries')
      .select('id, country');
    
    if (countriesError) {
      console.error("Error fetching countries:", countriesError);
      // Continue with clients data even if countries fetch fails
    }
    
    console.log("Countries data:", countriesData || []);
    
    // Create a map of country_id to two-letter country code
    const countryIdToCode = {};
    if (countriesData && countriesData.length > 0) {
      countriesData.forEach(country => {
        // Generate country code - first try to create a meaningful two-letter code
        let code;
        
        // Use first two letters of country name, unless it would create a duplicate
        code = country.country.substring(0, 2).toLowerCase();
        
        // Store the mapping
        countryIdToCode[country.id] = code;
      });
    }
    
    console.log("Country ID to code mapping:", countryIdToCode);
    
    // Transform the clients data to match our Client interface
    const transformedClients = clientsData.map(item => {
      // Get country code from the mapping, or use a fallback
      const countryCode = item.country_id && countryIdToCode[item.country_id] 
        ? countryIdToCode[item.country_id] 
        : 'unkn';
      
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
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  console.log("useClients hook - clients:", clients);

  return {
    clients,
    isLoading,
    error,
    refetch
  };
};
