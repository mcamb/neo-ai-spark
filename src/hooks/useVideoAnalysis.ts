
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VideoAnalysisData } from '@/types/video';
import { toast } from '@/components/ui/use-toast';

export const useVideoAnalysis = (videoId: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<VideoAnalysisData | null>(null);

  useEffect(() => {
    const fetchVideoAnalysis = async () => {
      if (!videoId) {
        setLoading(false);
        return null;
      }

      try {
        setLoading(true);
        // First get the video basic info
        const { data: videoData, error: videoError } = await supabase
          .from('videos')
          .select(`
            *,
            campaigns (
              *,
              clients (
                *
              ),
              channels (
                *
              )
            )
          `)
          .eq('id', videoId)
          .maybeSingle();

        if (videoError) {
          throw videoError;
        }
        
        if (!videoData) {
          console.error('No video found with ID:', videoId);
          setLoading(false);
          toast({
            title: "Video not found",
            description: "The requested video could not be found",
            variant: "destructive"
          });
          return;
        }

        console.log("Video data loaded:", videoData); // Debugging: Video-Daten in der Konsole ausgeben

        // Construct analysis data from the video information
        const analysisData: VideoAnalysisData = {
          video_id: videoId,
          video_title: videoData.titel,
          video_craft: videoData.crafted_by,
          video_format: videoData.format,
          video_description: videoData.description || null,
          overall_assessment: videoData.assessment || null,
          recommendations: videoData.recommendations || null,
          creator: videoData.creator || null,
          campaign_title: videoData.campaigns?.titel || null,
        };

        // Add campaign and client context data if available
        if (videoData.campaigns?.clients) {
          analysisData.brand = videoData.campaigns.clients.brand || null;
          analysisData.country = videoData.campaigns.clients.country || null;
        }
        
        // Add channel data if available
        if (videoData.campaigns?.channels) {
          analysisData.channel = videoData.campaigns.channels.channel || null;
        }

        console.log("Processed analysis data:", analysisData); // Debugging: Die aufbereiteten Daten in der Konsole ausgeben

        setAnalysis(analysisData);
      } catch (error) {
        console.error('Error fetching video analysis:', error);
        toast({
          title: "Error",
          description: "Failed to load video analysis data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAnalysis();
  }, [videoId]);

  return { loading, analysis };
};
