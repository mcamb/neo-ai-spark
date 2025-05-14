
import React from 'react';
import VideosList from './VideosList';
import { Video } from './VideoCard';
import { Loader, AlertTriangle, RefreshCw, FileVideo, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideosContentProps {
  videos: Video[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onDeleteVideo: (id: string, video: Video) => void;
  onEditVideo: (id: string) => void;
  onViewVideo: (id: string) => void;
  refetch: () => void;
  onAddVideo: () => void;
}

const VideosContent: React.FC<VideosContentProps> = ({
  videos,
  isLoading,
  error,
  searchQuery,
  onDeleteVideo,
  onEditVideo,
  onViewVideo,
  refetch,
  onAddVideo
}) => {
  // Show loading state only when loading and there are no videos to display
  const showLoadingState = isLoading && (!videos || videos.length === 0);

  if (showLoadingState) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-neo-red" />
          <span className="text-gray-500">Loading videos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p className="text-red-500">Error loading videos: {error.message}</p>
        <Button 
          onClick={refetch} 
          className="mt-4 bg-neo-red hover:bg-red-600 text-white"
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  // Show empty state when there are no videos
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm p-6">
        <FileVideo className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by uploading your first video for analysis.
        </p>
        <Button 
          onClick={onAddVideo}
          className="mt-4 bg-neo-red hover:bg-red-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Video
        </Button>
      </div>
    );
  }

  // Add a subtle loading indicator when refreshing with existing data
  return (
    <div className="bg-white rounded-lg shadow-sm relative">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
          <div className="h-full bg-neo-red animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
      <VideosList 
        videos={videos} 
        searchQuery={searchQuery}
        onDeleteVideo={onDeleteVideo}
        onEditVideo={onEditVideo}
        onViewVideo={onViewVideo}
      />
    </div>
  );
};

export default VideosContent;
