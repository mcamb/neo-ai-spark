
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForClients = async () => {
  try {
    // First check if the clients table is already added to the realtime publication
    // We need to use any here because the function is not typed in the generated types
    const { data: publicationData, error: checkError } = await supabase.rpc(
      'check_table_in_publication' as any, 
      { 
        table_name: 'clients',
        publication_name: 'supabase_realtime'
      }
    ).single();
    
    if (checkError) {
      // If the function doesn't exist, fall back to the standard approach
      // and handle the potential error gracefully
      console.log('Could not check if table is in publication, attempting to enable anyway:', checkError);
      
      const { data, error } = await supabase.rpc('enable_realtime_for_clients');
      
      if (error) {
        // Filter out the specific error about table already being a member
        if (error.message && error.message.includes('already member of publication')) {
          console.log('Table clients is already configured for real-time updates.');
          return true; // Return success since table is already set up
        }
        
        console.error('Error setting up real-time for clients table:', error);
        return false;
      }
      
      console.log('Real-time configuration for clients table has been set up successfully:', data);
      return true;
    }
    
    // If we successfully checked and table is already in publication
    // Cast to the expected type since TypeScript doesn't know the structure
    const typedData = publicationData as { exists: boolean };
    if (typedData && typedData.exists) {
      console.log('Table clients is already configured for real-time updates.');
      return true;
    }
    
    // If table is not in publication, add it
    const { data, error } = await supabase.rpc('enable_realtime_for_clients');
    
    if (error) {
      console.error('Error setting up real-time for clients table:', error);
      return false;
    }
    
    console.log('Real-time configuration for clients table has been set up successfully:', data);
    return true;
  } catch (error) {
    // This will catch any errors not caught in the try block
    console.error('Failed to set up real-time for clients table:', error);
    return false;
  }
};
