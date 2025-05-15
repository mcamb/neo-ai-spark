
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Trash2 } from 'lucide-react';
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
  creator?: string;
  created_at?: string;
}

interface VideoCardProps {
  video: Video;
  onDelete: (id: string, video: Video) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete, onView }) => {
  // Create a placeholder URL if no video file is available
  const videoUrl = video.file || '';

  return (
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col">
      {/* Video Preview Section - Enhanced size with aspect ratio maintained */}
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
      <CardContent className="p-5 flex-grow">
        <div className="flex flex-col h-full">
          <h3 className="font-medium text-xl mb-2 line-clamp-2" title={video.title}>
            {video.title}
          </h3>
          
          <div className="text-gray-600 text-sm space-y-2 mb-4">
            <p className="line-clamp-1" title={video.campaignTitle}>
              Campaign: {video.campaignTitle}
            </p>
            <p className="line-clamp-1" title={`${video.clientName} - ${video.country}`}>
              <span className="font-bold">{video.clientName}</span> - {video.country}
            </p>
          </div>
          
          <div className="mt-auto space-y-2">
            {/* Updated craft and creator placement - now on the same line */}
            <div className="flex items-center flex-wrap gap-2">
              {video.craft && (
                <Badge 
                  variant="outline" 
                  className="bg-black text-white border border-black font-normal"
                >
                  {video.craft}
                </Badge>
              )}
              
              {/* Creator name displayed on the same line */}
              {video.creator && (
                <span className="text-sm">
                  Creator: <span className="font-bold">{video.creator}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      {/* Actions Footer */}
      <CardFooter className="p-3 justify-end bg-gray-50">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-100"
            onClick={() => onView(video.id)}
            title="View analysis"
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-gray-100 text-gray-600 hover:text-red-600"
            onClick={() => onDelete(video.id, video)}
            title="Delete video"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
