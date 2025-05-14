
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import VideoUploadModal from '@/components/video-fit/VideoUploadModal';
import { useVideos } from '@/hooks/useVideos';
import VideosContent from '@/components/video-fit/VideosContent';
import VideosToolbar from '@/components/video-fit/VideosToolbar';
import { useVideoDeletion } from '@/hooks/useVideoDeletion';
import DeleteVideoDialog from '@/components/video-fit/DeleteVideoDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const VideoFit = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
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
  
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };
  
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };
  
  const handleUploadSuccess = () => {
    refetch();
    toast({
      title: "Video Added",
      description: "Your video has been added and is ready for analysis",
    });
  };
  
  const handleViewVideo = (id: string) => {
    navigate(`/lab/video-fit/analysis/${id}`);
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
          onAddVideo={handleOpenUploadModal}
          isDisabled={isPageLoading}
        />
        
        <VideosContent 
          videos={videos}
          isLoading={isPageLoading}
          error={error}
          searchQuery={searchQuery}
          onDeleteVideo={handleDeletePrompt}
          onEditVideo={() => {}} // Empty function since we removed the edit button
          onViewVideo={handleViewVideo}
          refetch={refetch}
          onAddVideo={handleOpenUploadModal}
        />
        
        <VideoUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={handleCloseUploadModal} 
          onSuccess={handleUploadSuccess}
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
