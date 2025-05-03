
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Client } from './useClients';

interface UseClientPollingProps {
  clients: Client[];
  updateClientStatus: (clientId: string, status: 'ready' | 'in_progress') => Promise<void>;
}

export const useClientPolling = ({
  clients,
  updateClientStatus
}: UseClientPollingProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      const inProgressClients = clients.filter(client => client.agent_status === 'in_progress');
      
      if (inProgressClients.length > 0 && Math.random() > 0.7) {
        const randomClient = inProgressClients[Math.floor(Math.random() * inProgressClients.length)];
        
        // Update a random client's status to 'ready'
        (async () => {
          try {
            await updateClientStatus(randomClient.id, 'ready');
            
            toast({
              title: "Client Ready",
              description: `${randomClient.name} is now ready!`
            });
          } catch (error) {
            console.error("Error updating client status:", error);
          }
        })();
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollingInterval);
  }, [clients, toast, updateClientStatus]);
};
