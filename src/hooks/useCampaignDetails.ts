
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
  target_audience_summary?: string;
  targeting?: string;
  message_hook?: string;
  tone_style?: string;
  formats?: string;
  creators_influencers?: string;
  brand_promise?: string;
  brand_challenge?: string;
  objective_name?: string;
  channel_name?: string;
  hero_image_url?: string;
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
        // Use the campaigns table and join with clients, objectives, and channels to get all related data
        const { data, error } = await supabase
          .from('campaigns')
          .select(`
            id,
            titel,
            status,
            agent_status,
            created_at,
            client_id,
            target_audience,
            target_audience_summary,
            targeting,
            message_hook,
            tone_style,
            formats,
            creators_influencers,
            objective_id,
            channel_id,
            hero_image_url,
            clients (
              brand,
              logo,
              brand_promise,
              brand_challenge,
              country
            ),
            objectives (
              objective
            ),
            channels (
              channel
            )
          `)
          .eq('id', campaignId)
          .single();

        if (error) throw error;

        if (data) {
          setCampaignDetails({
            id: data.id,
            title: data.titel,
            status: data.status,
            agent_status: data.agent_status,
            created_at: data.created_at,
            clientName: data.clients?.brand || 'Unknown Client',
            clientLogo: data.clients?.logo,
            country: data.clients?.country,
            target_audience: data.target_audience,
            target_audience_summary: data.target_audience_summary,
            targeting: data.targeting,
            message_hook: data.message_hook,
            tone_style: data.tone_style,
            formats: data.formats,
            creators_influencers: data.creators_influencers,
            brand_promise: data.clients?.brand_promise,
            brand_challenge: data.clients?.brand_challenge,
            objective_name: data.objectives?.objective,
            channel_name: data.channels?.channel,
            hero_image_url: data.hero_image_url
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
