
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Separator } from '@/components/ui/separator';
import { ClientHeader } from '@/components/client-details/ClientHeader';
import { BrandSection } from '@/components/client-details/BrandSection';
import { AudienceSection } from '@/components/client-details/AudienceSection';
import { ScoreSection } from '@/components/client-details/ScoreSection';
import { NotFoundMessage } from '@/components/client-details/NotFoundMessage';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from '@/components/ui/skeleton';

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const { 
    clientDetails,
    audienceType,
    isLoading,
    setAudienceType,
    isEditingBrand,
    isEditingAudience,
    editedBrandPromise,
    editedBrandChallenge,
    editedTargetAudience,
    startEditingBrand,
    saveBrandEdits,
    startEditingAudience,
    saveAudienceEdits,
    handleEditTargetAudience,
    setEditedBrandPromise,
    setEditedBrandChallenge
  } = useClientData(clientId);

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
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!clientDetails) {
    return (
      <MainLayout>
        <NotFoundMessage />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <ClientHeader
          name={clientDetails.name}
          country={clientDetails.country}
          domain={clientDetails.domain}
          logo={clientDetails.logo}
          description={clientDetails.description}
        />
        <Separator />
        
        <BrandSection
          isEditing={isEditingBrand}
          brandPromise={clientDetails.brandPromise}
          brandChallenge={clientDetails.brandChallenge}
          editedBrandPromise={editedBrandPromise}
          editedBrandChallenge={editedBrandChallenge}
          onStartEditing={startEditingBrand}
          onSaveEdits={saveBrandEdits}
          onEditBrandPromise={setEditedBrandPromise}
          onEditBrandChallenge={setEditedBrandChallenge}
        />
        
        <AudienceSection
          isEditing={isEditingAudience}
          audienceType={audienceType}
          targetAudience={clientDetails.targetAudience}
          editedTargetAudience={editedTargetAudience}
          onSetAudienceType={setAudienceType}
          onStartEditing={startEditingAudience}
          onSaveEdits={saveAudienceEdits}
          onEditTargetAudience={handleEditTargetAudience}
        />
        
        {clientDetails.socialMediaScores && clientDetails.socialMediaScores.length > 0 ? (
          <ScoreSection socialMediaScores={clientDetails.socialMediaScores} />
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ClientDetailsPage;
