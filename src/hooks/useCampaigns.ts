
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
        created_at,
        clients (
          brand,
          logo,
          country_id,
          countries (
            country
          )
        )
      `)
      .order('created_at', { ascending: false });
    
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
      agent_status: campaign.agent_status,
      created_at: campaign.created_at
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

// Add a function to delete a campaign
export const deleteCampaign = async (campaignId: string) => {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};
