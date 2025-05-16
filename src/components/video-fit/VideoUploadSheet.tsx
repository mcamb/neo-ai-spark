
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import VideoUploadForm from './VideoUploadForm';

interface VideoUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VideoUploadSheet: React.FC<VideoUploadSheetProps> = ({ isOpen, onClose, onSuccess }) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Upload Video for Analysis</SheetTitle>
          <SheetDescription>
            Add a new video to analyze its fit with your campaign.
          </SheetDescription>
        </SheetHeader>
        <VideoUploadForm onSuccess={onSuccess} onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export default VideoUploadSheet;
