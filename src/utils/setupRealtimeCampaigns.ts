
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForCampaigns = async () => {
  try {
    console.log('Setting up real-time for campaigns table...');
    
    // Use the more generic supabase.rpc() approach with a type assertion
    // This bypasses the TypeScript type checking for the function name
    const { data, error } = await supabase.rpc(
      'enable_realtime_for_campaigns' as any
    );
    
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
