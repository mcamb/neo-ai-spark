
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/video-fit/VideoCard';
import { toast } from '@/hooks/use-toast';

export const useVideos = () => {
  const fetchVideos = async (): Promise<Video[]> => {
    console.log("Fetching videos from Supabase");
    
    const { data, error } = await supabase
      .from('videos')
      .select(`
        id, 
        titel, 
        file,
        format,
        crafted_by,
        creator,
        created_at,
        campaign_id,
        campaigns (
          titel,
          client_id,
          clients (
            brand,
            country
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
    
    console.log("Fetched videos:", data);
    
    // Transform the data to match our Video interface
    const transformedVideos = data.map(video => ({
      id: video.id,
      title: video.titel,
      campaignId: video.campaign_id,
      campaignTitle: video.campaigns?.titel || 'Unknown Campaign',
      clientName: video.campaigns?.clients?.brand || 'Unknown Client',
      country: video.campaigns?.clients?.country || 'Unknown Country',
      file: video.file,
      format: video.format,
      craft: video.crafted_by,
      creator: video.creator,
      created_at: video.created_at
    }));
    
    return transformedVideos;
  };

  const { 
    data: videos = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  return {
    videos,
    isLoading,
    error,
    refetch
  };
};

// Delete video function
export const deleteVideo = async (videoId: string) => {
  try {
    // Delete the video from the database
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};
