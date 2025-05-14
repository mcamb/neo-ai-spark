
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/video-fit/VideoCard';

interface UseVideoDeletionOptions {
  refetch: () => void;
}

export const useVideoDeletion = ({ refetch }: UseVideoDeletionOptions) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const handleDeletePrompt = (id: string, video: Video) => {
    setSelectedVideoId(id);
    setSelectedVideo(video);
    setDeleteDialogOpen(true);
  };
  
  const deleteVideoFile = async (fileUrl: string): Promise<boolean> => {
    try {
      // Extract the file path from the URL
      // URL format is typically: https://[project-ref].supabase.co/storage/v1/object/public/videos/[filename]
      const urlParts = fileUrl.split('/');
      const filePath = urlParts[urlParts.length - 1]; // Get the filename
      
      const { error } = await supabase
        .storage
        .from('videos')
        .remove([filePath]);
      
      if (error) {
        console.error("Error deleting file from storage:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteVideoFile:", error);
      return false;
    }
  };
  
  const deleteVideoRecord = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting video record:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteVideoRecord:", error);
      return false;
    }
  };
  
  const handleDeleteVideo = async () => {
    if (!selectedVideoId || !selectedVideo) return;
    
    setIsDeleting(true);
    
    try {
      // Step 1: Delete the file from storage if a file URL exists
      let fileDeleted = true;
      if (selectedVideo.file) {
        fileDeleted = await deleteVideoFile(selectedVideo.file);
      }
      
      // Step 2: Delete the database record
      const recordDeleted = await deleteVideoRecord(selectedVideoId);
      
      if (fileDeleted && recordDeleted) {
        toast({
          title: "Video deleted",
          description: "The video and its associated file have been successfully deleted.",
        });
        
        refetch();
      } else if (recordDeleted) {
        toast({
          title: "Video deleted",
          description: "The video record was deleted, but there may have been an issue deleting the file.",
        });
        
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the video. Please try again.",
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
      setSelectedVideo(null);
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

export const deleteVideo = async (videoId: string) => {
  try {
    // First, get the video to find its file URL
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('id, file')
      .eq('id', videoId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // If the video has a file, delete it from storage
    if (video.file) {
      const urlParts = video.file.split('/');
      const filePath = urlParts[urlParts.length - 1];
      
      const { error: storageError } = await supabase
        .storage
        .from('videos')
        .remove([filePath]);
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
    }
    
    // Delete the video record from the database
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};
