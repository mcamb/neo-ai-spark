
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import CampaignsHeader from '@/components/campaigns/CampaignsHeader';
import CampaignsToolbar from '@/components/campaigns/CampaignsToolbar';
import CampaignsContent from '@/components/campaigns/CampaignsContent';
import { Campaign } from '@/components/campaigns/CampaignCard';
import { toast } from 'sonner';

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock data for campaigns - in a real app, this would come from an API
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Summer 2025 Launch',
      clientName: 'Nike',
      country: 'United States',
      status: 'active',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
    },
    {
      id: '2',
      title: 'Holiday Season Campaign',
      clientName: 'KitKat',
      country: 'Global',
      status: 'draft',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/KitKat_logo.svg/1200px-KitKat_logo.svg.png',
    },
    {
      id: '3',
      title: 'Product Launch Q3',
      clientName: 'Apple',
      country: 'Global',
      status: 'completed',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png',
    }
  ]);
  
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
  
  // Mock refetch function
  const refetch = () => {
    setIsLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Campaigns refreshed");
    }, 1000);
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
