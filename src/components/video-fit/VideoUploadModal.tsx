
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoUploadForm from './VideoUploadForm';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video for Analysis</DialogTitle>
        </DialogHeader>
        <VideoUploadForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
