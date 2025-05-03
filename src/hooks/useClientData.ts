
import { useState } from 'react';
import { ClientDetails, TargetAudience } from '@/models/clientDetails';
import { mockClientDetails } from '@/data/mockClients';

export const useClientData = (clientId: string | undefined) => {
  const clientDetails = clientId ? mockClientDetails[clientId] : undefined;
  
  // State for audience type selection
  const [audienceType, setAudienceType] = useState<'b2c' | 'b2b'>('b2c');
  
  // State for editing mode and content
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [isEditingAudience, setIsEditingAudience] = useState(false);
  const [editedBrandPromise, setEditedBrandPromise] = useState('');
  const [editedBrandChallenge, setEditedBrandChallenge] = useState('');
  const [editedTargetAudience, setEditedTargetAudience] = useState<TargetAudience>({
    b2c: {
      primary: '',
      secondary: ''
    },
    b2b: {
      primary: '',
      secondary: ''
    }
  });

  // Start editing functions
  const startEditingBrand = () => {
    if (!clientDetails) return;
    setEditedBrandPromise(clientDetails.brandPromise);
    setEditedBrandChallenge(clientDetails.brandChallenge);
    setIsEditingBrand(true);
  };

  const saveBrandEdits = () => {
    // In a real app, you would save these changes to your backend
    setIsEditingBrand(false);
  };

  const startEditingAudience = () => {
    if (!clientDetails) return;
    setEditedTargetAudience({
      b2c: {
        primary: clientDetails.targetAudience.b2c.primary,
        secondary: clientDetails.targetAudience.b2c.secondary
      },
      b2b: {
        primary: clientDetails.targetAudience.b2b.primary,
        secondary: clientDetails.targetAudience.b2b.secondary
      }
    });
    setIsEditingAudience(true);
  };

  const saveAudienceEdits = () => {
    // In a real app, you would save these changes to your backend
    setIsEditingAudience(false);
  };

  const handleEditTargetAudience = (audienceType: 'b2c' | 'b2b', field: 'primary' | 'secondary', value: string) => {
    setEditedTargetAudience(prev => ({
      ...prev,
      [audienceType]: {
        ...prev[audienceType],
        [field]: value
      }
    }));
  };

  return {
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
  };
};
