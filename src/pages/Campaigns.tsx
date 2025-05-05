
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import CampaignsHeader from '@/components/campaigns/CampaignsHeader';
import CampaignsToolbar from '@/components/campaigns/CampaignsToolbar';
import CampaignsContent from '@/components/campaigns/CampaignsContent';
import { toast } from 'sonner';
import { useCampaigns } from '@/hooks/useCampaigns';
import NewCampaignModal from '@/components/campaigns/NewCampaignModal';
import EditCampaignModal from '@/components/campaigns/EditCampaignModal';

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  const { 
    campaigns, 
    isLoading, 
    error, 
    refetch 
  } = useCampaigns();
  
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  
  const handleOpenEditModal = (id: string) => {
    setSelectedCampaignId(id);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCampaignId(null);
  };
  
  // Function for deleting a campaign
  const handleDeleteCampaign = (id: string) => {
    toast.success(`Campaign ${id} would be deleted in a real app.`);
  };
  
  const handleSubmit = () => {
    refetch();
    toast.success('Campaign updated successfully');
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <CampaignsHeader 
          title="Campaigns" 
          description="Select your campaign or create a new one. It takes about 1 minute until the details are ready."
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
          onEditCampaign={handleOpenEditModal}
          refetch={refetch}
        />
        
        <NewCampaignModal 
          isOpen={isAddModalOpen} 
          onClose={handleCloseAddModal} 
          onSubmit={handleSubmit}
        />
        
        {selectedCampaignId && (
          <EditCampaignModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            campaignId={selectedCampaignId}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Campaigns;
