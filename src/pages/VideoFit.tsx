
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useVideos } from '@/hooks/useVideos';
import VideosContent from '@/components/video-fit/VideosContent';
import VideosToolbar from '@/components/video-fit/VideosToolbar';
import { useVideoDeletion } from '@/hooks/useVideoDeletion';
import DeleteVideoDialog from '@/components/video-fit/DeleteVideoDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Video } from '@/components/video-fit/VideoCard';

const VideoFit = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    videos, 
    isLoading, 
    error, 
    refetch 
  } = useVideos();
  
  // Use the video deletion hook
  const {
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeletePrompt,
    handleDeleteVideo,
    selectedVideoId
  } = useVideoDeletion({ refetch });
  
  // Handle empty button click (no functionality)
  const handleAddVideoClick = () => {
    // This is intentionally empty to disable the add video functionality
    console.log('Add video button clicked - functionality removed');
  };
  
  const handleViewVideo = (id: string) => {
    navigate(`/lab/video-fit/analysis/${id}`);
  };

  const handleInitiateDeleteVideo = (id: string, video: Video) => {
    handleDeletePrompt(id, video);
  };
  
  // Combine loading states for better UX
  const isPageLoading = isLoading || isDeleting;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Video Fit</h1>
          <p className="text-gray-600 mt-1">
            Upload a video and analyze whether it aligns with your campaign.
          </p>
        </div>
        
        <VideosToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddVideo={handleAddVideoClick}
          isDisabled={isPageLoading}
        />
        
        <VideosContent 
          videos={videos}
          isLoading={isPageLoading}
          error={error}
          searchQuery={searchQuery}
          onDeleteVideo={handleInitiateDeleteVideo}
          onEditVideo={() => {}} // Empty function since we removed the edit button
          onViewVideo={handleViewVideo}
          refetch={refetch}
          onAddVideo={handleAddVideoClick}
        />
        
        <DeleteVideoDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDeleteVideo}
          isDeleting={isDeleting}
        />
      </div>
    </MainLayout>
  );
};

export default VideoFit;
