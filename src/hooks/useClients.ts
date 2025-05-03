
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

const fetchClients = async (): Promise<Client[]> => {
  console.log("Fetching clients from Supabase");
  
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
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
