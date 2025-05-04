
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForClients = async () => {
  try {
    // This function attempts to enable REPLICA IDENTITY FULL and add the table to the realtime publication
    // Note: This requires the user to have sufficient database privileges
    
    // Use the generic parameters to explicitly define both the return type and params type
    await supabase.rpc<void, Record<string, never>>('enable_realtime_for_clients', {});
    
    console.log('Real-time configuration for clients table has been set up');
    return true;
  } catch (error) {
    console.error('Failed to set up real-time for clients table:', error);
    return false;
  }
};
