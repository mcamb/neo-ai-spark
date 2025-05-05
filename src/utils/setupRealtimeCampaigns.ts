
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForCampaigns = async () => {
  try {
    // This function enables REPLICA IDENTITY FULL and adds the table to the realtime publication
    const { data, error } = await supabase.rpc('enable_realtime_for_campaigns');
    
    if (error) {
      console.error('Error setting up real-time for campaigns table:', error);
      return false;
    }
    
    console.log('Real-time configuration for campaigns table has been set up successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to set up real-time for campaigns table:', error);
    return false;
  }
};
