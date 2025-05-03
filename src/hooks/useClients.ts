
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

// Sample mock data to display the UI design
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corp',
    country: 'us',
    domain: 'acme.com',
    agent_status: 'ready',
    logo: 'https://picsum.photos/200'
  },
  {
    id: '2',
    name: 'TechFuture',
    country: 'ca',
    domain: 'techfuture.ca',
    agent_status: 'in_progress'
  },
  {
    id: '3',
    name: 'Globex Industries',
    country: 'uk',
    domain: 'globex.co.uk',
    agent_status: 'ready'
  },
  {
    id: '4',
    name: 'Venture Capital',
    country: 'de',
    domain: 'venturecap.de',
    agent_status: 'ready'
  }
];

const fetchClients = async (): Promise<Client[]> => {
  console.log("Using mock data instead of fetching from Supabase");
  
  // Return mock data
  return Promise.resolve(mockClients);
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
