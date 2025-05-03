
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Channel {
  id: string;
  channel: string;
}

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .order('channel', { ascending: true });
        
        if (error) throw error;
        
        setChannels(data || []);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching channels'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { channels, isLoading, error };
};
