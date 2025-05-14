
import React from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';

interface VideoDescriptionProps {
  description: string;
}

const VideoDescription: React.FC<VideoDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Video Description</h2>
      <MarkdownBox>{description}</MarkdownBox>
    </div>
  );
};

export default VideoDescription;
