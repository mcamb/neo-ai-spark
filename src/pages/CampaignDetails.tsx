
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaignDetails } from '@/hooks/useCampaignDetails';
import { CampaignHeader } from '@/components/campaign-details/CampaignHeader';
import { CampaignInfoSection } from '@/components/campaign-details/CampaignInfoSection';
import { CampaignRecommendationsSection } from '@/components/campaign-details/CampaignRecommendationsSection';
import { CampaignBrandSection } from '@/components/campaign-details/CampaignBrandSection';
import { CampaignNotFoundMessage } from '@/components/campaign-details/CampaignNotFoundMessage';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const { campaignDetails, isLoading, error } = useCampaignDetails(campaignId);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 pb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 w-full max-w-md">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (error || !campaignDetails) {
    return (
      <MainLayout>
        <CampaignNotFoundMessage />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <CampaignHeader
          title={campaignDetails.title}
          status={campaignDetails.status}
          clientName={campaignDetails.clientName}
          clientLogo={campaignDetails.clientLogo}
          createdAt={campaignDetails.created_at}
          country={campaignDetails.country}
        />
        <Separator />
        
        <CampaignInfoSection
          target_audience={campaignDetails.target_audience}
          targeting={campaignDetails.targeting}
          message_hook={campaignDetails.message_hook}
        />
        
        <CampaignRecommendationsSection
          tone_style={campaignDetails.tone_style}
          formats={campaignDetails.formats}
          creators_influencers={campaignDetails.creators_influencers}
        />
        
        <CampaignBrandSection
          brand_promise={campaignDetails.brand_promise}
          brand_challenge={campaignDetails.brand_challenge}
        />
      </div>
    </MainLayout>
  );
};

export default CampaignDetails;
