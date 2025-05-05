
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  brand: string;
  domain: string;
  logo?: string;
  agent_status: 'ready' | 'in_progress';
  country_id?: string;
  created_at?: string; // This field is now used for sorting
  brand_promise?: string;
  brand_challenge?: string;
  primary_audience_b2c?: string;
  secondary_audience_b2c?: string;
  primary_audience_b2b?: string;
  secondary_audience_b2b?: string;
  countries?: {
    code?: string;
    country: string;
  };
}

const fetchClients = async (): Promise<Client[]> => {
  console.log("Fetching clients from Supabase");
  
  const { data, error } = await supabase
    .from('clients')
    .select('*, countries(country)')
    .order('created_at', { ascending: false }); // Order by created_at, newest first
  
  if (error) {
    console.error("Error fetching clients from Supabase:", error);
    throw error;
  }
  
  console.log("Fetched clients:", data);
  return data as Client[];
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
