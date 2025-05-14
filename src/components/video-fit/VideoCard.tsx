
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Video {
  id: string;
  title: string;
  campaignId: string;
  campaignTitle: string;
  clientName: string;
  country: string;
  file?: string;
  format?: string;
  craft?: string;
  created_at?: string;
}

interface VideoCardProps {
  video: Video;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete, onEdit, onView }) => {
  return (
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="flex flex-col flex-1">
            <h3 className="font-medium text-lg">{video.title}</h3>
            <div className="text-gray-600 text-sm">
              <p>{video.campaignTitle}</p>
              <p>{video.clientName} - {video.country}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={() => onView(video.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={() => onEdit(video.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-gray-100"
              onClick={() => onDelete(video.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
