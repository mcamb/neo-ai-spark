
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCampaignRealtimeProps {
  refetch: () => void;
}

export const useCampaignRealtime = ({ refetch }: UseCampaignRealtimeProps) => {
  useEffect(() => {
    // Subscribe to changes on the campaigns table
    const channel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'campaigns'
        },
        (payload) => {
          console.log('Campaign table change detected:', payload);
          refetch();
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
};
