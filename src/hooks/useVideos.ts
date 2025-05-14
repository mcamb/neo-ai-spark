
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
        craft,
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
      craft: video.craft,
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
    // First, get the video data to find the file path
    const { data: videoData, error: fetchError } = await supabase
      .from('videos')
      .select('file')
      .eq('id', videoId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching video data:", fetchError);
      return { 
        success: false, 
        error: fetchError.message
      };
    }
    
    // Extract the file path from the URL
    // The storage URL format is typically: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[filepath]
    if (videoData.file) {
      // Parse file path from the URL
      const url = new URL(videoData.file);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.indexOf('public') + 1;
      
      if (bucketIndex > 0 && bucketIndex < pathSegments.length) {
        // The bucket name is the next segment after 'public'
        const bucket = pathSegments[bucketIndex];
        
        // The file path is everything after the bucket name
        const filePath = pathSegments.slice(bucketIndex + 1).join('/');
        
        if (bucket && filePath) {
          console.log(`Attempting to delete file from bucket: ${bucket}, path: ${filePath}`);
          
          // Delete the file from storage
          const { error: storageError } = await supabase
            .storage
            .from(bucket)
            .remove([filePath]);
          
          if (storageError) {
            console.error("Error deleting file from storage:", storageError);
            // Continue with DB deletion even if storage deletion fails
          } else {
            console.log("File successfully deleted from storage");
          }
        }
      }
    }
    
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
