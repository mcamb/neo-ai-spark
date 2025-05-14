
import React from 'react';

interface VideoDescriptionProps {
  description: string;
}

const VideoDescription: React.FC<VideoDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Video Description</h2>
      <div 
        className="bg-white border border-gray-200 rounded-lg p-5 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default VideoDescription;
