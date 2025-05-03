
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

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const { 
    clientDetails,
    audienceType,
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
        
        <ScoreSection socialMediaScores={clientDetails.socialMediaScores} />
      </div>
    </MainLayout>
  );
};

export default ClientDetailsPage;
