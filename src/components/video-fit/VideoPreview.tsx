
import React from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type VideoPreviewProps = {
  selectedFile: File | null;
  previewUrl: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  required?: boolean;
};

const VideoPreview: React.FC<VideoPreviewProps> = ({
  selectedFile,
  previewUrl,
  handleFileChange,
  isUploading,
  required = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="video-upload">
        Upload Video
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="border-2 border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <Input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
          required={required}
        />
        
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              Click below to select a video file
            </p>
            <p className="text-xs text-gray-400">
              MP4, MOV, or WebM files supported
            </p>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('video-upload')?.click()}
              disabled={isUploading}
              type="button"
            >
              Select Video
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <video
              controls
              src={previewUrl}
              className="max-h-64 mx-auto rounded"
            />
            <p className="text-sm text-gray-500 mt-2">
              {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('video-upload')?.click()}
              disabled={isUploading}
              type="button"
              size="sm"
            >
              Choose a different video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
