
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoAnalysisNavigation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button variant="ghost" onClick={() => navigate('/lab/video-fit')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Video Fit Overview
      </Button>
    </div>
  );
};

export default VideoAnalysisNavigation;
