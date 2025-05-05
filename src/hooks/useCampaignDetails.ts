
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CampaignDetails {
  id: string;
  title: string;
  status: string;
  agent_status: string;
  created_at: string;
  clientName: string;
  clientLogo?: string;
  country?: string;
  target_audience?: string;
  targeting?: string;
  message_hook?: string;
  tone_style?: string;
  formats?: string;
  creators_influencers?: string;
  brand_promise?: string;
  brand_challenge?: string;
}

export const useCampaignDetails = (campaignId: string | undefined) => {
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaign details
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!campaignId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Use the campaign_context_n8n_agents view to get all related campaign data
        const { data, error } = await supabase
          .from('campaign_context_n8n_agents')
          .select(`
            campaign_id,
            titel,
            status,
            agent_status,
            created_at,
            client_id,
            brand,
            logo:clients(logo),
            country,
            target_audience,
            targeting,
            message_hook,
            tone_style,
            formats,
            creators_influencers,
            brand_promise,
            brand_challenge
          `)
          .eq('campaign_id', campaignId)
          .single();

        if (error) throw error;

        if (data) {
          setCampaignDetails({
            id: data.campaign_id,
            title: data.titel,
            status: data.status,
            agent_status: data.agent_status,
            created_at: data.created_at,
            clientName: data.brand || 'Unknown Client',
            clientLogo: data.logo?.logo,
            country: data.country,
            target_audience: data.target_audience,
            targeting: data.targeting,
            message_hook: data.message_hook,
            tone_style: data.tone_style,
            formats: data.formats,
            creators_influencers: data.creators_influencers,
            brand_promise: data.brand_promise,
            brand_challenge: data.brand_challenge
          });
        }
      } catch (err) {
        console.error('Error fetching campaign details:', err);
        setError('Failed to load campaign details');
        toast.error('Failed to load campaign details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  return { campaignDetails, isLoading, error };
};
