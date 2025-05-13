
import React from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
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
          <label 
            htmlFor="video-upload" 
            className="flex flex-col items-center justify-center cursor-pointer space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag and drop a video file, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              MP4, MOV, or WebM files supported
            </p>
          </label>
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
            <label 
              htmlFor="video-upload" 
              className="text-sm text-blue-500 cursor-pointer"
            >
              Choose a different video
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
