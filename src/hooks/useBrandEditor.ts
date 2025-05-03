
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBrandEditor = (
  clientId: string | undefined,
  initialBrandPromise: string,
  initialBrandChallenge: string,
  onUpdateClientDetails: (updateFn: (prev: any) => any) => void
) => {
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [editedBrandPromise, setEditedBrandPromise] = useState('');
  const [editedBrandChallenge, setEditedBrandChallenge] = useState('');
  const { toast } = useToast();

  const startEditingBrand = () => {
    setEditedBrandPromise(initialBrandPromise);
    setEditedBrandChallenge(initialBrandChallenge);
    setIsEditingBrand(true);
  };

  const saveBrandEdits = async () => {
    if (!clientId) return;
    
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
      onUpdateClientDetails(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          brandPromise: editedBrandPromise,
          brandChallenge: editedBrandChallenge
        };
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

  return {
    isEditingBrand,
    editedBrandPromise,
    editedBrandChallenge,
    startEditingBrand,
    saveBrandEdits,
    setEditedBrandPromise,
    setEditedBrandChallenge
  };
};
