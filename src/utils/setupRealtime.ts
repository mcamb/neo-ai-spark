
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForClients = async () => {
  try {
    // This function attempts to enable REPLICA IDENTITY FULL and add the table to the realtime publication
    // Note: This requires the user to have sufficient database privileges
    
    // Call the RPC function with the correct return type
    const { data, error } = await supabase.rpc('enable_realtime_for_clients');
    
    if (error) {
      console.error('Error setting up real-time for clients table:', error);
      return false;
    }
    
    console.log('Real-time configuration for clients table has been set up', data);
    return true;
  } catch (error) {
    console.error('Failed to set up real-time for clients table:', error);
    return false;
  }
};
