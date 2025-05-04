
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Client } from './useClients';

interface UseClientRealtimeProps {
  refetch: () => void;
}

/**
 * Hook to subscribe to real-time updates of client status changes
 */
export const useClientRealtime = ({ refetch }: UseClientRealtimeProps) => {
  useEffect(() => {
    // Subscribe to changes on the clients table
    const channel = supabase
      .channel('client-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clients',
          filter: 'agent_status=eq.ready'
        },
        (payload) => {
          const updatedClient = payload.new as Client;
          
          // If the client status is now 'ready', show a notification and refresh the list
          if (updatedClient.agent_status === 'ready') {
            toast(`${updatedClient.brand} is now ready!`, {
              description: "The client status has been updated.",
            });
            
            // Refresh client list
            refetch();
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // No return value needed as this hook just sets up a subscription
};
