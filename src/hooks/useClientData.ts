
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
        // Fetch basic client info
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
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
        
        // Transform the scores data into the format our frontend expects
        const socialMediaScores = scoresData?.map(score => ({
          platform: score.channels.channel,
          score: score.score,
          rationale: score.rationale || ''
        })) || [];
        
        console.log("Transformed social media scores:", socialMediaScores);
        
        // Build the client details object from the database data
        const clientDetails: ClientDetails = {
          id: clientData.id,
          name: clientData.name,
          country: clientData.country,
          domain: clientData.domain,
          logo: clientData.logo,
          description: "Client details from database", // This could be added as a field to the clients table in future
          brandPromise: clientData.brand_promise || "Brand promise not available.",
          brandChallenge: clientData.brand_challenge || "Brand challenge not available.",
          targetAudience: {
            b2c: {
              primary: clientData.primary_audience_b2c || "No B2C primary audience defined.",
              secondary: clientData.secondary_audience_b2c || "No B2C secondary audience defined."
            },
            b2b: {
              primary: clientData.primary_audience_b2b || "No B2B primary audience defined.",
              secondary: clientData.secondary_audience_b2b || "No B2B secondary audience defined."
            }
          },
          socialMediaScores: socialMediaScores.length > 0 ? socialMediaScores : [
            // Fallback scores if none found in database
            {
              platform: "LinkedIn",
              score: 80,
              rationale: "Professional platform matches well with business focus."
            },
            {
              platform: "Instagram",
              score: 60,
              rationale: "Visual platform provides good engagement opportunities."
            },
            {
              platform: "Facebook",
              score: 55,
              rationale: "Wide audience reach but declining organic engagement."
            },
            {
              platform: "Twitter",
              score: 45,
              rationale: "Good for quick updates but limited engagement depth."
            }
          ]
        };
        
        setClientDetails(clientDetails);
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

  const saveBrandEdits = async () => {
    if (!clientId || !clientDetails) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          brand_promise: editedBrandPromise,
          brand_challenge: editedBrandChallenge
        })
        .eq('id', clientId);
        
      if (error) throw error;
      
      // Update local state with new values
      setClientDetails({
        ...clientDetails,
        brandPromise: editedBrandPromise,
        brandChallenge: editedBrandChallenge
      });
      
      toast({
        title: "Success",
        description: "Brand information updated successfully.",
      });
    } catch (error) {
      console.error("Error saving brand edits:", error);
      toast({
        title: "Error",
        description: "Failed to update brand information.",
        variant: "destructive"
      });
    }
    
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

  const saveAudienceEdits = async () => {
    if (!clientId || !clientDetails) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          primary_audience_b2c: editedTargetAudience.b2c.primary,
          secondary_audience_b2c: editedTargetAudience.b2c.secondary,
          primary_audience_b2b: editedTargetAudience.b2b.primary,
          secondary_audience_b2b: editedTargetAudience.b2b.secondary
        })
        .eq('id', clientId);
        
      if (error) throw error;
      
      // Update local state with new values
      setClientDetails({
        ...clientDetails,
        targetAudience: {
          b2c: {
            primary: editedTargetAudience.b2c.primary,
            secondary: editedTargetAudience.b2c.secondary
          },
          b2b: {
            primary: editedTargetAudience.b2b.primary,
            secondary: editedTargetAudience.b2b.secondary
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Target audience information updated successfully.",
      });
    } catch (error) {
      console.error("Error saving audience edits:", error);
      toast({
        title: "Error",
        description: "Failed to update target audience information.",
        variant: "destructive"
      });
    }
    
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
