
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { toast } from '@/components/ui/use-toast';

type VideoAnalysisData = {
  video_id: string;
  video_title?: string;
  video_craft?: string;
  video_format?: string;
  brand?: string;
  country?: string;
  channel?: string;
  video_description?: string;
  audience_fit_description?: string;
  brand_fit_description?: string;
  objective_fit_description?: string;
  platform_fit_description?: string;
  message_clarity_description?: string;
  creative_impact_description?: string;
  overall_assessment?: string;
  recommendations?: string;
}

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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-neo-red" />
        </div>
      </MainLayout>
    );
  }

  if (!analysis) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Video Analysis</h1>
          <Card>
            <CardContent className="pt-6">
              <p>No analysis found for this video. The analysis might still be processing.</p>
            </CardContent>
          </Card>
        </div>
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

        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="mb-2"><span className="font-medium">Brand:</span> {analysis.brand || 'Not available'}</p>
                <p className="mb-2"><span className="font-medium">Country:</span> {analysis.country || 'Not available'}</p>
                <p className="mb-2"><span className="font-medium">Channel:</span> {analysis.channel || 'Not available'}</p>
              </div>
              <div>
                <p className="mb-2"><span className="font-medium">Video Title:</span> {analysis.video_title || 'Untitled'}</p>
                <p className="mb-2"><span className="font-medium">Video Craft:</span> {analysis.video_craft || 'Not specified'}</p>
                <p className="mb-2"><span className="font-medium">Video Format:</span> {analysis.video_format || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Description Section */}
        {analysis.video_description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Video Description</h2>
            <MarkdownBox>{analysis.video_description}</MarkdownBox>
          </div>
        )}

        {/* Analysis Content */}
        <div className="space-y-6">
          {analysis.overall_assessment && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
                <MarkdownBox>{analysis.overall_assessment}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {/* Individual Analysis Sections */}
          {analysis.audience_fit_description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Audience Fit</h2>
                <MarkdownBox>{analysis.audience_fit_description}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {analysis.brand_fit_description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Brand Fit</h2>
                <MarkdownBox>{analysis.brand_fit_description}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {analysis.objective_fit_description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Objective Fit</h2>
                <MarkdownBox>{analysis.objective_fit_description}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {analysis.platform_fit_description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Platform Fit</h2>
                <MarkdownBox>{analysis.platform_fit_description}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {analysis.message_clarity_description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Message Clarity</h2>
                <MarkdownBox>{analysis.message_clarity_description}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {analysis.creative_impact_description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Creative Impact</h2>
                <MarkdownBox>{analysis.creative_impact_description}</MarkdownBox>
              </CardContent>
            </Card>
          )}

          {analysis.recommendations && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <MarkdownBox>{analysis.recommendations}</MarkdownBox>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VideoAnalysis;
