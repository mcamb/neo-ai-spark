
import { useState } from 'react';
import { TargetAudience } from '@/models/clientDetails';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAudienceEditor = (
  clientId: string | undefined,
  initialTargetAudience: TargetAudience,
  onUpdateClientDetails: (updateFn: (prev: any) => any) => void
) => {
  const [isEditingAudience, setIsEditingAudience] = useState(false);
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
  const { toast } = useToast();

  const startEditingAudience = () => {
    setEditedTargetAudience({
      b2c: {
        primary: initialTargetAudience.b2c.primary,
        secondary: initialTargetAudience.b2c.secondary
      },
      b2b: {
        primary: initialTargetAudience.b2b.primary,
        secondary: initialTargetAudience.b2b.secondary
      }
    });
    setIsEditingAudience(true);
  };

  const saveAudienceEdits = async () => {
    if (!clientId) return;
    
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
      onUpdateClientDetails(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
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
        };
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

  const handleEditTargetAudience = (
    audienceType: 'b2c' | 'b2b', 
    field: 'primary' | 'secondary', 
    value: string
  ) => {
    setEditedTargetAudience(prev => ({
      ...prev,
      [audienceType]: {
        ...prev[audienceType],
        [field]: value
      }
    }));
  };

  return {
    isEditingAudience,
    editedTargetAudience,
    startEditingAudience,
    saveAudienceEdits,
    handleEditTargetAudience
  };
};
