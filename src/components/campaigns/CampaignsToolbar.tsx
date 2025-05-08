
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CampaignsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCampaign: () => void;
  isDisabled?: boolean;
}

const CampaignsToolbar: React.FC<CampaignsToolbarProps> = ({ 
  searchQuery, 
  onSearchChange,
  onAddCampaign,
  isDisabled = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="w-full sm:max-w-xs">
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          disabled={isDisabled}
        />
      </div>
      <Button 
        onClick={onAddCampaign}
        className="bg-neo-red hover:bg-red-600 text-white"
        disabled={isDisabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Campaign
      </Button>
    </div>
  );
};

export default CampaignsToolbar;
