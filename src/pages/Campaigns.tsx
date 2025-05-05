
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import CampaignsHeader from '@/components/campaigns/CampaignsHeader';
import CampaignsToolbar from '@/components/campaigns/CampaignsToolbar';
import CampaignsContent from '@/components/campaigns/CampaignsContent';
import { toast } from 'sonner';
import { useCampaigns } from '@/hooks/useCampaigns';
import NewCampaignModal from '@/components/campaigns/NewCampaignModal';
import EditCampaignModal from '@/components/campaigns/EditCampaignModal';
import DeleteCampaignDialog from '@/components/campaigns/DeleteCampaignDialog';
import { useCampaignDeletion } from '@/hooks/useCampaignDeletion';
import { useCampaignRealtime } from '@/hooks/useCampaignRealtime';
import { setupRealtimeForCampaigns } from '@/utils/setupRealtimeCampaigns';

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
  
  // Use the campaign deletion hook
  const {
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeletePrompt,
    handleDeleteCampaign
  } = useCampaignDeletion({ refetch });

  // Set up realtime updates for campaigns
  useCampaignRealtime({ refetch });
  
  // Set up realtime configuration when component mounts
  useEffect(() => {
    (async () => {
      await setupRealtimeForCampaigns();
      refetch();
    })();
  }, [refetch]);
  
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
  
  const handleSubmit = () => {
    refetch();
    toast.success('Campaign updated successfully');
  };
  
  // Combine loading states for better UX
  const isPageLoading = isLoading || isDeleting;
  
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
          isDisabled={isPageLoading}
        />
        
        <CampaignsContent 
          campaigns={campaigns}
          isLoading={isPageLoading}
          error={error}
          searchQuery={searchQuery}
          onDeleteCampaign={handleDeletePrompt}
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

        <DeleteCampaignDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDeleteCampaign}
          isDeleting={isDeleting}
        />
      </div>
    </MainLayout>
  );
};

export default Campaigns;
