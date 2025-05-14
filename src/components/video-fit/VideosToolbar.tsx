
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileVideo } from "lucide-react";

interface VideosToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddVideo: () => void;
  isDisabled?: boolean;
}

const VideosToolbar: React.FC<VideosToolbarProps> = ({ 
  searchQuery, 
  onSearchChange,
  onAddVideo,
  isDisabled = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="w-full sm:max-w-xs">
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          disabled={isDisabled}
        />
      </div>
      <Button 
        onClick={onAddVideo}
        className="bg-neo-red hover:bg-red-600 text-white"
        disabled={isDisabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Video
      </Button>
    </div>
  );
};

export default VideosToolbar;
