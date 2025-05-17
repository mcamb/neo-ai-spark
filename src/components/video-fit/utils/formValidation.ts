
import { toast } from '@/hooks/use-toast';

export interface ValidationData {
  selectedClientId: string;
  selectedCampaignId: string;
  selectedFile: File | null;
  videoTitle: string;
  creatorName: string;
}

export const validateVideoForm = (data: ValidationData): boolean => {
  if (!data.selectedClientId) {
    toast({
      title: "Error",
      description: "Please select a client",
      variant: "destructive"
    });
    return false;
  }
  
  if (!data.selectedCampaignId) {
    toast({
      title: "Error",
      description: "Please select a campaign",
      variant: "destructive"
    });
    return false;
  }
  
  if (!data.selectedFile) {
    toast({
      title: "Error",
      description: "Please upload a video",
      variant: "destructive"
    });
    return false;
  }

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
