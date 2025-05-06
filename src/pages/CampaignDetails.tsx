
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaignDetails } from '@/hooks/useCampaignDetails';
import { CampaignHeader } from '@/components/campaign-details/CampaignHeader';
import { CampaignSummary } from '@/components/campaign-details/CampaignSummary';
import { CampaignAudienceSection } from '@/components/campaign-details/CampaignAudienceSection';
import { CampaignRecommendationsSection } from '@/components/campaign-details/CampaignRecommendationsSection';
import { CampaignNotFoundMessage } from '@/components/campaign-details/CampaignNotFoundMessage';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const { campaignDetails, isLoading, error } = useCampaignDetails(campaignId);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-8 w-full">
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
      <div className="space-y-8 w-full">
        <CampaignHeader
          title={campaignDetails.title}
          status={campaignDetails.status}
          clientName={campaignDetails.clientName}
          clientLogo={campaignDetails.clientLogo}
          country={campaignDetails.country}
        />
        
        <CampaignSummary
          targetAudience={campaignDetails.target_audience}
          objective={campaignDetails.objective_name}
          channel={campaignDetails.channel_name}
          status={campaignDetails.status}
        />
        
        <Separator className="my-8" />
        
        <div className="space-y-8 w-full">
          <CampaignAudienceSection
            campaignId={campaignDetails.id}
            targetAudienceSummary={campaignDetails.target_audience_summary}
            heroImageUrl={campaignDetails.hero_image_url}
          />
          
          <CampaignRecommendationsSection
            campaignId={campaignDetails.id}
            tone_style={campaignDetails.tone_style}
            formats={campaignDetails.formats}
            targeting={campaignDetails.targeting}
            creators_influencers={campaignDetails.creators_influencers}
            message_hook={campaignDetails.message_hook}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CampaignDetails;
