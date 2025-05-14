
import React from 'react';
import VideoCard, { Video } from './VideoCard';

interface VideosListProps {
  videos: Video[];
  searchQuery: string;
  onDeleteVideo: (id: string) => void;
  onEditVideo: (id: string) => void;
  onViewVideo: (id: string) => void;
}

const VideosList: React.FC<VideosListProps> = ({ 
  videos, 
  searchQuery, 
  onDeleteVideo,
  onEditVideo,
  onViewVideo
}) => {
  // Filter videos based on search query
  const filteredVideos = searchQuery.trim() === "" 
    ? videos
    : videos.filter(video => {
        return video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      });
  
  // Sort videos by created_at (newest first)
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    // First sort by created_at if available (newest first)
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    
    // Lastly sort by title alphabetically
    return a.title.localeCompare(b.title);
  });

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No videos found.</p>
        </div>
      </div>
    );
  }

  if (sortedVideos.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No videos found matching your search criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {sortedVideos.map((video) => (
        <VideoCard 
          key={video.id}
          video={video}
          onDelete={onDeleteVideo}
          onEdit={onEditVideo}
          onView={onViewVideo}
        />
      ))}
    </div>
  );
};

export default VideosList;
