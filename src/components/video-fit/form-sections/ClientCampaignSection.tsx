
import React from 'react';
import ClientSelector from '../ClientSelector';
import CampaignSelector from '../CampaignSelector';

interface ClientCampaignSectionProps {
  selectedClientId: string;
  setSelectedClientId: (clientId: string) => void;
  selectedCampaignId: string;
  setSelectedCampaignId: (campaignId: string) => void;
  isUploading: boolean;
  resetCampaignOnClientChange: () => void;
  required?: boolean;
}

const ClientCampaignSection: React.FC<ClientCampaignSectionProps> = ({
  selectedClientId,
  setSelectedClientId,
  selectedCampaignId,
  setSelectedCampaignId,
  isUploading,
  resetCampaignOnClientChange,
  required = false
}) => {
  // Client change handler to reset campaign selection
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    resetCampaignOnClientChange();
  };

  return (
    <>
      <ClientSelector 
        selectedClientId={selectedClientId} 
        setSelectedClientId={handleClientChange}
        disabled={isUploading}
        required={required}
      />
      
      <CampaignSelector 
        selectedClientId={selectedClientId}
        selectedCampaignId={selectedCampaignId}
        setSelectedCampaignId={setSelectedCampaignId}
        disabled={isUploading}
        required={required}
      />
    </>
  );
};

export default ClientCampaignSection;
