
import React from 'react';
import CampaignsList from './CampaignsList';
import { Campaign } from './CampaignCard';
import { Loader, AlertTriangle, RefreshCw, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CampaignsContentProps {
  campaigns: Campaign[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onDeleteCampaign: (id: string) => void;
  onEditCampaign: (id: string) => void;
  refetch: () => void;
}

const CampaignsContent: React.FC<CampaignsContentProps> = ({
  campaigns,
  isLoading,
  error,
  searchQuery,
  onDeleteCampaign,
  onEditCampaign,
  refetch
}) => {
  // Show loading state only when loading and there are no campaigns to display
  const showLoadingState = isLoading && (!campaigns || campaigns.length === 0);

  if (showLoadingState) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-neo-red" />
          <span className="text-gray-500">Loading campaigns...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p className="text-red-500">Error loading campaigns: {error.message}</p>
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

  // Show empty state when there are no campaigns
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-10">
        <Rocket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No campaigns found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by creating your first campaign.
        </p>
        <Button 
          onClick={refetch}
          className="mt-4 bg-neo-red hover:bg-red-600 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
    );
  }

  // Add a subtle loading indicator when refreshing with existing data
  return (
    <div className="relative px-0">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
          <div className="h-full bg-neo-red animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
      <CampaignsList 
        campaigns={campaigns} 
        searchQuery={searchQuery}
        onDeleteCampaign={onDeleteCampaign}
        onEditCampaign={onEditCampaign}
      />
    </div>
  );
};

export default CampaignsContent;
