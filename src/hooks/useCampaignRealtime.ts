
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCampaignRealtimeProps {
  refetch: () => void;
}

export const useCampaignRealtime = ({ refetch }: UseCampaignRealtimeProps) => {
  useEffect(() => {
    console.log('Setting up real-time subscription for campaigns table');
    
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
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Return cleanup function
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);
};
