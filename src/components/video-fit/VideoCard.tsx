
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, Trash2Icon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Video {
  id: string;
  title: string;
  campaignId?: string;
  campaignTitle?: string;
  clientName?: string;
  country?: string;
  video_url?: string;
  format?: string;
  craft?: string;
  creator?: string;
  created_at?: string;
}

interface VideoCardProps {
  video: Video;
  onDelete: (id: string, video: Video) => void;
  onEdit?: (id: string) => void;
  onView: (id: string) => void;
}

const formatTimestamp = (timestamp: string): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (e) {
    console.error('Invalid timestamp format:', e);
    return 'Unknown date';
  }
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete, onView }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(video.id, video);
  };

  const handleView = () => {
    onView(video.id);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {video.video_url ? (
          <video 
            src={video.video_url} 
            className="object-cover w-full h-full cursor-pointer" 
            onClick={handleView}
            preload="metadata"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <p className="text-gray-500">No preview available</p>
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle 
            className="text-lg font-semibold truncate cursor-pointer" 
            onClick={handleView}
          >
            {video.title || 'Untitled Video'}
          </CardTitle>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {video.format && (
            <Badge variant="outline" className="text-xs">
              {video.format}
            </Badge>
          )}
          {video.craft && (
            <Badge variant="outline" className="text-xs bg-blue-50">
              {video.craft}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-gray-500">
          <p className="truncate">
            Campaign: {video.campaignTitle || 'Not assigned'}
          </p>
          <p className="truncate">
            Client: {video.clientName || 'Unknown'}
          </p>
          {video.creator && (
            <p className="truncate">
              Creator: {video.creator}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-xs text-gray-400">
          {video.created_at ? formatTimestamp(video.created_at) : 'Recently added'}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleView}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
            onClick={handleDelete}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
