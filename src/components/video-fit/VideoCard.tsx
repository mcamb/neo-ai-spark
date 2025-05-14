
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

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
  // Create a placeholder URL if no video file is available
  const videoUrl = video.file || '';

  return (
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col">
      {/* Video Preview Section */}
      <div className="relative">
        <AspectRatio ratio={16/9} className="bg-gray-100">
          {videoUrl ? (
            <video 
              className="object-cover w-full h-full" 
              src={videoUrl}
              muted 
              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
              onMouseOut={(e) => {
                (e.target as HTMLVideoElement).pause();
                (e.target as HTMLVideoElement).currentTime = 0;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-sm">No video preview</p>
            </div>
          )}
        </AspectRatio>
      </div>
      
      {/* Content Section */}
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-col h-full">
          <h3 className="font-medium text-lg mb-1 line-clamp-2" title={video.title}>
            {video.title}
          </h3>
          
          <div className="text-gray-600 text-sm space-y-1 mb-3">
            <p className="line-clamp-1" title={video.campaignTitle}>
              Campaign: {video.campaignTitle}
            </p>
            <p className="line-clamp-1" title={`${video.clientName} - ${video.country}`}>
              {video.clientName} - {video.country}
            </p>
          </div>
          
          {video.craft && (
            <div className="mt-auto">
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-gray-50 text-gray-700 border border-gray-200 font-normal",
                  video.craft?.toLowerCase() === "video" && "bg-blue-50 text-blue-700 border-blue-200",
                  video.craft?.toLowerCase() === "image" && "bg-purple-50 text-purple-700 border-purple-200",
                  video.craft?.toLowerCase() === "audio" && "bg-green-50 text-green-700 border-green-200"
                )}
              >
                {video.craft}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      
      <Separator />
      
      {/* Actions Footer */}
      <CardFooter className="p-2 justify-end bg-gray-50">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-100"
            onClick={() => onView(video.id)}
            title="View analysis"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-100"
            onClick={() => onEdit(video.id)}
            title="Edit video"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-gray-100 text-gray-600 hover:text-red-600"
            onClick={() => onDelete(video.id)}
            title="Delete video"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
