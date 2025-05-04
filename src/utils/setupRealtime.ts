
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForClients = async () => {
  try {
    // This function attempts to enable REPLICA IDENTITY FULL and add the table to the realtime publication
    // Note: This requires the user to have sufficient database privileges
    
    // Use the generic parameter to explicitly define the return type
    // and provide the function name and params correctly
    await supabase.rpc<void>('enable_realtime_for_clients', {});
    
    console.log('Real-time configuration for clients table has been set up');
    return true;
  } catch (error) {
    console.error('Failed to set up real-time for clients table:', error);
    return false;
  }
};
