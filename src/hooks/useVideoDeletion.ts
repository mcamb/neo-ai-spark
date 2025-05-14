
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { deleteVideo } from './useVideos';

interface UseVideoDeletionOptions {
  refetch: () => void;
}

export const useVideoDeletion = ({ refetch }: UseVideoDeletionOptions) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  
  const handleDeletePrompt = (id: string) => {
    setSelectedVideoId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteVideo = async () => {
    if (!selectedVideoId) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteVideo(selectedVideoId);
      
      if (result.success) {
        toast({
          title: "Video deleted",
          description: "The video has been successfully deleted.",
        });
        
        refetch();
      } else {
        toast({
          title: "Error",
          description: `Failed to delete video: ${result.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedVideoId(null);
    }
  };
  
  return {
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeletePrompt,
    handleDeleteVideo,
    selectedVideoId
  };
};
