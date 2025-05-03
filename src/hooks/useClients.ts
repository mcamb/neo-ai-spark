
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
  
  // First, get all countries for reference
  const { data: countries, error: countryError } = await supabase
    .from('countries')
    .select('*');
    
  if (countryError) {
    console.error("Error fetching countries:", countryError);
    // Don't throw here, we can continue without countries
  }
  
  console.log("Available countries:", countries || []);
  
  // Get all clients - only select what we need
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

export const useClients = () => {
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

  return {
    clients,
    isLoading,
    error,
    refetch
  };
};
