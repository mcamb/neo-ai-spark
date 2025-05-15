
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import VideoAnalysisContent from '@/components/video-analysis/VideoAnalysisContent';
import VideoAnalysisHeader from '@/components/video-analysis/VideoAnalysisHeader';
import VideoAnalysisNavigation from '@/components/video-analysis/VideoAnalysisNavigation';
import LoadingState from '@/components/video-analysis/LoadingState';
import NotFoundState from '@/components/video-analysis/NotFoundState';

const VideoAnalysis = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { loading, analysis } = useVideoAnalysis(videoId);

  // Redirect if no videoId is provided
  if (!videoId && !loading) {
    navigate('/lab/video-fit');
    return null;
  }

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
        {/* Navigation */}
        <VideoAnalysisNavigation />

        {/* Page Header */}
        <VideoAnalysisHeader />

        {/* Analysis Content */}
        <VideoAnalysisContent analysis={analysis} />
      </div>
    </MainLayout>
  );
};

export default VideoAnalysis;
