
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';

interface VideoDescriptionProps {
  description: string | null | undefined;
}

const VideoDescription: React.FC<VideoDescriptionProps> = ({ description }) => {
  // Wenn keine Beschreibung vorhanden ist oder nur Leerzeichen, nichts rendern
  if (!description || description.trim() === '') {
    return null;
  }
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Video Description</h2>
        <MarkdownBox className="video-description-markdown">{description}</MarkdownBox>
      </CardContent>
    </Card>
  );
};

export default VideoDescription;
