
import React from 'react';
import CampaignCard, { Campaign } from './CampaignCard';

interface CampaignsListProps {
  campaigns: Campaign[];
  searchQuery: string;
  onDeleteCampaign: (id: string) => void;
  onEditCampaign: (id: string) => void;
}

const CampaignsList: React.FC<CampaignsListProps> = ({ 
  campaigns, 
  searchQuery, 
  onDeleteCampaign,
  onEditCampaign
}) => {
  // Filter campaigns based on search query
  const filteredCampaigns = searchQuery.trim() === "" 
    ? campaigns
    : campaigns.filter(campaign => {
        return campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.country.toLowerCase().includes(searchQuery.toLowerCase());
      });
  
  // Sort campaigns by status first (active at the top), then alphabetically by title
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    // First sort by status - active comes first, then draft, then completed
    if (a.status !== b.status) {
      if (a.status === 'active') return -1;
      if (b.status === 'active') return 1;
      if (a.status === 'draft') return -1;
      if (b.status === 'draft') return 1;
    }
    
    // Then sort by title alphabetically
    return a.title.localeCompare(b.title);
  });

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No campaigns found.</p>
        </div>
      </div>
    );
  }

  if (sortedCampaigns.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No campaigns found matching your search criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-2">
      {sortedCampaigns.map((campaign) => (
        <CampaignCard 
          key={campaign.id}
          campaign={campaign}
          onDelete={onDeleteCampaign}
          onEdit={onEditCampaign}
        />
      ))}
    </div>
  );
};

export default CampaignsList;
