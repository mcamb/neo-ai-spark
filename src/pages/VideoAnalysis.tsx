
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { VideoAnalysisData } from '@/types/video';
import VideoOverview from '@/components/video-analysis/VideoOverview';
import VideoDescription from '@/components/video-analysis/VideoDescription';
import AnalysisSection from '@/components/video-analysis/AnalysisSection';
import LoadingState from '@/components/video-analysis/LoadingState';
import NotFoundState from '@/components/video-analysis/NotFoundState';

const VideoAnalysis = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<VideoAnalysisData | null>(null);

  useEffect(() => {
    const fetchVideoAnalysis = async () => {
      if (!videoId) {
        navigate('/lab/video-fit');
        return;
      }

      try {
        // First get the video basic info
        const { data: videoData, error: videoError } = await supabase
          .from('videos')
          .select('*')
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

        // Get additional context from video_context_n8n_agents view
        const { data: contextData, error: contextError } = await supabase
          .from('video_context_n8n_agents')
          .select('*')
          .eq('video_id', videoId)
          .maybeSingle();

        if (contextError) {
          console.warn('Error fetching video context:', contextError);
          // Continue with just video data
        }

        // Combine data
        const analysisData: VideoAnalysisData = {
          video_id: videoId,
          video_title: videoData.titel,
          video_craft: videoData.craft,
          video_format: videoData.format,
          video_description: videoData.description,
          audience_fit_description: videoData.audience_fit_description,
          brand_fit_description: videoData.brand_fit_description,
          objective_fit_description: videoData.objective_fit_description,
          platform_fit_description: videoData.platform_fit_description,
          message_clarity_description: videoData.message_clarity_description,
          creative_impact_description: videoData.creative_impact_description,
          overall_assessment: videoData.overall_assessment,
          recommendations: videoData.recommendations,
          // Add context data if available
          ...(contextData && {
            brand: contextData.brand,
            country: contextData.country,
            channel: contextData.channel
          })
        };

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
  }, [videoId, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (!analysis) {
    return (
      <MainLayout>
        <NotFoundState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Video Analysis</h1>
          <p className="text-gray-600 mt-1">
            This is an AI analysis of your uploaded video.
          </p>
        </div>

        <VideoOverview analysis={analysis} />

        {/* Video Description Section */}
        <VideoDescription description={analysis.video_description || ''} />

        {/* Analysis Content */}
        <div className="space-y-6">
          <AnalysisSection 
            title="Overall Assessment" 
            content={analysis.overall_assessment} 
          />
          <AnalysisSection 
            title="Audience Fit" 
            content={analysis.audience_fit_description} 
          />
          <AnalysisSection 
            title="Brand Fit" 
            content={analysis.brand_fit_description} 
          />
          <AnalysisSection 
            title="Objective Fit" 
            content={analysis.objective_fit_description} 
          />
          <AnalysisSection 
            title="Platform Fit" 
            content={analysis.platform_fit_description} 
          />
          <AnalysisSection 
            title="Message Clarity" 
            content={analysis.message_clarity_description} 
          />
          <AnalysisSection 
            title="Creative Impact" 
            content={analysis.creative_impact_description} 
          />
          <AnalysisSection 
            title="Recommendations" 
            content={analysis.recommendations} 
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default VideoAnalysis;
