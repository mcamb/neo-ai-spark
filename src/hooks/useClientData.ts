
import { useState, useEffect } from 'react';
import { ClientDetails } from '@/models/clientDetails';
import { mockClientDetails } from '@/data/mockClients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useBrandEditor } from './useBrandEditor';
import { useAudienceEditor } from './useAudienceEditor';
import { transformClientData } from '@/utils/clientDataTransformer';

export const useClientData = (clientId: string | undefined) => {
  const [clientDetails, setClientDetails] = useState<ClientDetails | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // State for audience type selection
  const [audienceType, setAudienceType] = useState<'b2c' | 'b2b'>('b2c');
  
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch basic client info with country relationship
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select(`
            *,
            countries (
              code,
              country
            )
          `)
          .eq('id', clientId)
          .single();
          
        if (clientError) throw clientError;
        
        if (!clientData) {
          // If no client found in database, check mock data as fallback
          if (mockClientDetails[clientId]) {
            setClientDetails(mockClientDetails[clientId]);
          } else {
            setClientDetails(undefined);
          }
          setIsLoading(false);
          return;
        }
        
        console.log("Client data from Supabase:", clientData);
        
        // Fetch relevance scores for this client
        const { data: scoresData, error: scoresError } = await supabase
          .from('relevance_scores')
          .select(`
            id,
            score,
            rationale,
            channels (
              id,
              channel
            )
          `)
          .eq('client_id', clientId);
        
        if (scoresError) {
          console.error("Error fetching scores:", scoresError);
          // Continue despite error - we'll just show the client without scores
        }
        
        const transformedClientDetails = transformClientData(clientData, scoresData);
        setClientDetails(transformedClientDetails);
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

  // Initialize the brand and audience editors with current values
  const {
    isEditingBrand,
    editedBrandPromise,
    editedBrandChallenge,
    startEditingBrand,
    saveBrandEdits,
    setEditedBrandPromise,
    setEditedBrandChallenge
  } = useBrandEditor(
    clientId,
    clientDetails?.brandPromise || '',
    clientDetails?.brandChallenge || '',
    setClientDetails
  );

  const {
    isEditingAudience,
    editedTargetAudience,
    startEditingAudience,
    saveAudienceEdits,
    handleEditTargetAudience
  } = useAudienceEditor(
    clientId,
    clientDetails?.targetAudience || {
      b2c: { primary: '', secondary: '' },
      b2b: { primary: '', secondary: '' }
    },
    setClientDetails
  );

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
