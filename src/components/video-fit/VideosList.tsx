
import React, { useMemo } from 'react';
import VideoCard, { Video } from './VideoCard';

interface VideosListProps {
  videos: Video[];
  searchQuery: string;
  onDeleteVideo: (id: string, video: Video) => void;
  onEditVideo: (id: string) => void;
  onViewVideo: (id: string) => void;
}

const VideosList: React.FC<VideosListProps> = ({
  videos,
  searchQuery,
  onDeleteVideo,
  onEditVideo,
  onViewVideo,
}) => {
  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) {
      return videos;
    }
    
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    return videos.filter(video => 
      video.title.toLowerCase().includes(lowerQuery) ||
      video.clientName.toLowerCase().includes(lowerQuery) ||
      video.campaignTitle.toLowerCase().includes(lowerQuery) ||
      (video.creator && video.creator.toLowerCase().includes(lowerQuery))
    );
  }, [videos, searchQuery]);
  
  if (filteredVideos.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No videos match your search.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onDelete={() => onDeleteVideo(video.id, video)}
          onEdit={() => onEditVideo(video.id)}
          onView={() => onViewVideo(video.id)}
        />
      ))}
    </div>
  );
};

export default VideosList;
