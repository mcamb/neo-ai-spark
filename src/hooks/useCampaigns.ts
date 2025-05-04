
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from '@/components/campaigns/CampaignCard';

export const useCampaigns = () => {
  const fetchCampaigns = async (): Promise<Campaign[]> => {
    console.log("Fetching campaigns from Supabase");
    
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        id, 
        titel, 
        status, 
        agent_status,
        client_id,
        clients (
          brand,
          logo,
          country_id,
          countries (
            country
          )
        )
      `);
    
    if (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
    
    console.log("Fetched campaigns:", data);
    
    // Transform the data to match our Campaign interface
    const transformedCampaigns = data.map(campaign => ({
      id: campaign.id,
      title: campaign.titel,
      status: campaign.status.toLowerCase() as 'active' | 'draft' | 'completed',
      clientName: campaign.clients?.brand || 'Unknown',
      country: campaign.clients?.countries?.country || 'Global',
      logo: campaign.clients?.logo || undefined,
      agent_status: campaign.agent_status
    }));
    
    return transformedCampaigns;
  };

  const { 
    data: campaigns = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  return {
    campaigns,
    isLoading,
    error,
    refetch
  };
};
