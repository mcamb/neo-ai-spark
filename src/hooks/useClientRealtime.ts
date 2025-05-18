
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Client } from './useClients';
import { setupRealtimeForClients } from '@/utils/setupRealtime';

interface UseClientRealtimeProps {
  refetch: () => void;
}

/**
 * Hook to subscribe to real-time updates of client status changes
 */
export const useClientRealtime = ({ refetch }: UseClientRealtimeProps) => {
  useEffect(() => {
    // Initialize realtime functionality on mount
    const initializeRealtime = async () => {
      const success = await setupRealtimeForClients();
      if (!success) {
        console.warn("Couldn't confirm realtime setup for clients table, but subscription will be attempted anyway");
      }
    };
    
    initializeRealtime();
    
    // Subscribe to changes on the clients table
    const channel = supabase
      .channel('client-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all event types (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'clients',
        },
        (payload) => {
          const client = payload.new as Client;
          
          // Check if this is a client with "ready" status
          if (client && client.agent_status === 'ready') {
            // For updates, show a notification
            if (payload.eventType === 'UPDATE') {
              toast(`${client.brand} is now ready!`, {
                description: "The client status has been updated.",
              });
            } 
            // For new clients that are already ready
            else if (payload.eventType === 'INSERT') {
              toast(`New client ${client.brand} is ready!`, {
                description: "A new client has been added with ready status.",
              });
            }
            
            // Refresh client list for any change involving a ready client
            refetch();
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to client status changes');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to client status changes:', status);
        }
      });

    // Cleanup subscription when component unmounts
    return () => {
      console.log('Cleaning up client realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // No return value needed as this hook just sets up a subscription
};
