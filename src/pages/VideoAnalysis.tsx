
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';

type VideoAnalysisData = {
  video_id: string;
  video_title: string;
  video_craft: string;
  video_format: string;
  video_file: string;
  brand: string;
  country: string;
  campaign: string;
  channel: string;
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
        const { data, error } = await supabase
          .from('video_analysis')
          .select('*')
          .eq('video_id', videoId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setAnalysis(data);
        } else {
          // No analysis found for this video
          console.error('No analysis found for video ID:', videoId);
        }
      } catch (error) {
        console.error('Error fetching video analysis:', error);
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
                <p className="mb-2"><span className="font-medium">Brand:</span> {analysis.brand}</p>
                <p className="mb-2"><span className="font-medium">Country:</span> {analysis.country}</p>
                <p className="mb-2"><span className="font-medium">Campaign:</span> {analysis.campaign}</p>
                <p className="mb-2"><span className="font-medium">Channel:</span> {analysis.channel}</p>
              </div>
              <div>
                <p className="mb-2"><span className="font-medium">Video Title:</span> {analysis.video_title}</p>
                <p className="mb-2"><span className="font-medium">Video Craft:</span> {analysis.video_craft}</p>
                <p className="mb-2"><span className="font-medium">Video Format:</span> {analysis.video_format}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
