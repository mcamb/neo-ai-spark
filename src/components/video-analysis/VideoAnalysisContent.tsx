
import React from 'react';
import { VideoAnalysisData } from '@/types/video';
import VideoOverview from '@/components/video-analysis/VideoOverview';
import VideoDescription from '@/components/video-analysis/VideoDescription';
import AnalysisSection from '@/components/video-analysis/AnalysisSection';

interface VideoAnalysisContentProps {
  analysis: VideoAnalysisData;
}

const VideoAnalysisContent: React.FC<VideoAnalysisContentProps> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <VideoOverview analysis={analysis} />

      {/* Video Description Section - Verbesserte Integration */}
      <VideoDescription description={analysis.video_description} />

      {/* Analysis Content */}
      <div className="space-y-6">
        {analysis.overall_assessment && (
          <AnalysisSection 
            title="Overall Assessment" 
            content={analysis.overall_assessment} 
          />
        )}
        {analysis.recommendations && (
          <AnalysisSection 
            title="Recommendations" 
            content={analysis.recommendations} 
          />
        )}
      </div>
    </div>
  );
};

export default VideoAnalysisContent;
