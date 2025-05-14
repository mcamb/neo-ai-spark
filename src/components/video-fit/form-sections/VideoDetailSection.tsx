
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface VideoDetailProps {
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoCraft: string;
  setVideoCraft: (craft: string) => void;
  videoFormat: string;
  setVideoFormat: (format: string) => void;
  isUploading: boolean;
}

const VideoDetailSection: React.FC<VideoDetailProps> = ({
  videoTitle,
  setVideoTitle,
  videoCraft,
  setVideoCraft,
  videoFormat,
  setVideoFormat,
  isUploading
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="video-title">Video Title<span className="text-red-500">*</span></Label>
        <Input
          id="video-title"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="Enter video title"
          disabled={isUploading}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="video-craft">Video Craft<span className="text-red-500">*</span></Label>
          <Select 
            value={videoCraft} 
            onValueChange={setVideoCraft}
            disabled={isUploading}
            required
          >
            <SelectTrigger id="video-craft">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Brand">Brand</SelectItem>
              <SelectItem value="Creator">Creator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-format">Video Format<span className="text-red-500">*</span></Label>
          <Select 
            value={videoFormat} 
            onValueChange={setVideoFormat}
            disabled={isUploading}
            required
          >
            <SelectTrigger id="video-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="9:16">9:16</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
              <SelectItem value="4:5">4:5</SelectItem>
              <SelectItem value="2:3">2:3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default VideoDetailSection;
