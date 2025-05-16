
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import VideoUploadForm from './VideoUploadForm';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video for Analysis</DialogTitle>
          <DialogDescription>
            Add a new video to analyze its fit with your campaign.
          </DialogDescription>
        </DialogHeader>
        <VideoUploadForm onSuccess={onSuccess} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
