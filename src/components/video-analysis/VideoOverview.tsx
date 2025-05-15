
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VideoAnalysisData } from '@/types/video';

interface VideoOverviewProps {
  analysis: VideoAnalysisData;
}

const VideoOverview: React.FC<VideoOverviewProps> = ({ analysis }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><span className="font-medium">Brand:</span> {analysis.brand || 'Not available'}</p>
            <p className="mb-2"><span className="font-medium">Country:</span> {analysis.country || 'Not available'}</p>
            <p className="mb-2"><span className="font-medium">Campaign:</span> {analysis.campaign_title || 'Not available'}</p>
            <p className="mb-2"><span className="font-medium">Channel:</span> {analysis.channel || 'Not available'}</p>
          </div>
          <div>
            <p className="mb-2"><span className="font-medium">Video Title:</span> {analysis.video_title || 'Untitled'}</p>
            <p className="mb-2"><span className="font-medium">Crafted By:</span> {analysis.video_craft || 'Not specified'}</p>
            <p className="mb-2"><span className="font-medium">Video Format:</span> {analysis.video_format || 'Not specified'}</p>
            {analysis.creator && (
              <p className="mb-2"><span className="font-medium">Creator:</span> <span className="font-bold">{analysis.creator}</span></p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoOverview;
