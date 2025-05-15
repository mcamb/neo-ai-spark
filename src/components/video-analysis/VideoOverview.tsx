
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
            <p className="mb-2"><span className="font-medium">Brand:</span> <span className="font-bold">{analysis.brand || 'Not available'}</span></p>
            <p className="mb-2"><span className="font-medium">Country:</span> <span className="font-bold">{analysis.country || 'Not available'}</span></p>
            <p className="mb-2"><span className="font-medium">Campaign:</span> <span className="font-bold">{analysis.campaign_title || 'Not available'}</span></p>
            <p className="mb-2"><span className="font-medium">Channel:</span> <span className="font-bold">{analysis.channel || 'Not available'}</span></p>
          </div>
          <div>
            <p className="mb-2"><span className="font-medium">Video Title:</span> <span className="font-bold">{analysis.video_title || 'Untitled'}</span></p>
            <p className="mb-2"><span className="font-medium">Crafted By:</span> <span className="font-bold">{analysis.video_craft || 'Not specified'}</span></p>
            <p className="mb-2"><span className="font-medium">Video Format:</span> <span className="font-bold">{analysis.video_format || 'Not specified'}</span></p>
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
