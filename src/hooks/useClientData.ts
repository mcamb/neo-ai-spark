
import { useState, useEffect } from 'react';
import { ClientDetails, TargetAudience } from '@/models/clientDetails';
import { mockClientDetails } from '@/data/mockClients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useClientData = (clientId: string | undefined) => {
  const [clientDetails, setClientDetails] = useState<ClientDetails | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();
          
        if (error) {
          throw error;
        }

        if (data) {
          console.log("Client data from Supabase:", data);
          // We found data in Supabase, but we still need to map it to our ClientDetails model
          // For now, we'll use mock data for the fields not stored in the database
          if (mockClientDetails[clientId]) {
            // Use real data from Supabase for basic fields, and mock data for the rest
            const mockData = mockClientDetails[clientId];
            setClientDetails({
              ...mockData,
              id: data.id,
              name: data.name,
              country: data.country,
              domain: data.domain,
              logo: data.logo || mockData.logo,
            });
          } else {
            // If no matching mock data, create a default ClientDetails with real basic data
            setClientDetails({
              id: data.id,
              name: data.name,
              country: data.country,
              domain: data.domain,
              logo: data.logo,
              description: "No detailed description available.",
              brandPromise: "Brand promise not available.",
              brandChallenge: "Brand challenge not available.",
              targetAudience: {
                b2c: { primary: "No B2C primary audience defined.", secondary: "No B2C secondary audience defined." },
                b2b: { primary: "No B2B primary audience defined.", secondary: "No B2B secondary audience defined." }
              },
              socialMediaScores: []
            });
          }
        } else {
          // If not found in Supabase, fall back to mock data
          const mockData = mockClientDetails[clientId];
          if (mockData) {
            setClientDetails(mockData);
          } else {
            setClientDetails(undefined);
          }
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch client details. Using mock data if available.",
          variant: "destructive"
        });
        
        // Fall back to mock data
        if (clientId && mockClientDetails[clientId]) {
          setClientDetails(mockClientDetails[clientId]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, toast]);

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
  };
};
