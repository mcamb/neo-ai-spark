
import { toast } from '@/hooks/use-toast';

export interface ValidationData {
  selectedClientId: string;
  selectedCampaignId: string;
  selectedFile: File | null;
  videoTitle: string;
  creatorName: string;
}

// Helper function to validate if a string is a valid UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const validateVideoForm = (data: ValidationData): boolean => {
  if (!data.selectedClientId || !isValidUUID(data.selectedClientId)) {
    toast({
      title: "Error",
      description: "Please select a valid client",
      variant: "destructive"
    });
    return false;
  }
  
  if (!data.selectedCampaignId || !isValidUUID(data.selectedCampaignId)) {
    toast({
      title: "Error",
      description: "Please select a valid campaign",
      variant: "destructive"
    });
    return false;
  }
  
  // Video file is now optional - removed validation check
  
  if (!data.videoTitle) {
    toast({
      title: "Error",
      description: "Please enter a video title",
      variant: "destructive"
    });
    return false;
  }

  if (!data.creatorName) {
    toast({
      title: "Error",
      description: "Please enter creator name",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};
