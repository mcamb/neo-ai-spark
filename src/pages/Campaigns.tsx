
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import CampaignsHeader from '@/components/campaigns/CampaignsHeader';
import CampaignsToolbar from '@/components/campaigns/CampaignsToolbar';
import CampaignsContent from '@/components/campaigns/CampaignsContent';
import { toast } from 'sonner';
import { useCampaigns } from '@/hooks/useCampaigns';

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    campaigns, 
    isLoading, 
    error, 
    refetch 
  } = useCampaigns();
  
  // Mock function for adding a new campaign
  const handleOpenAddModal = () => {
    toast.info("Add Campaign functionality will be implemented in the future.");
  };
  
  // Mock function for deleting a campaign
  const handleDeleteCampaign = (id: string) => {
    toast.success(`Campaign ${id} would be deleted in a real app.`);
  };
  
  // Mock function for editing a campaign
  const handleEditCampaign = (id: string) => {
    toast.info(`Editing Campaign ${id} would open an edit modal in a real app.`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <CampaignsHeader 
          title="Campaigns" 
          description="Create and manage your social media campaigns here."
        />
        
        <CampaignsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCampaign={handleOpenAddModal}
          isDisabled={isLoading}
        />
        
        <CampaignsContent 
          campaigns={campaigns}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          onDeleteCampaign={handleDeleteCampaign}
          onEditCampaign={handleEditCampaign}
          refetch={refetch}
        />
      </div>
    </MainLayout>
  );
};

export default Campaigns;
