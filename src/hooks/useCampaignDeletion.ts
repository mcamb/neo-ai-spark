
import { useState } from 'react';
import { toast } from "sonner";
import { deleteCampaign } from './useCampaigns';

interface UseCampaignDeletionProps {
  refetch: () => void;
}

export const useCampaignDeletion = ({ refetch }: UseCampaignDeletionProps) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleDeletePrompt = (id: string) => {
    setSelectedCampaignId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCampaign = async () => {
    if (!selectedCampaignId || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      const deleteToastId = toast.loading("Deleting campaign...");
      
      const { success, error } = await deleteCampaign(selectedCampaignId);
        
      if (error) {
        toast.dismiss(deleteToastId);
        toast.error(`Deletion failed: ${error}`);
        console.error("Database error:", error);
      } else {
        toast.dismiss(deleteToastId);
        toast.success("Campaign deleted successfully");
        
        // Update the campaign list after deletion
        refetch();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Exception:", err);
    } finally {
      setIsDeleting(false);
      setSelectedCampaignId(null);
      setDeleteDialogOpen(false);
    }
  };

  return {
    selectedCampaignId,
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeletePrompt,
    handleDeleteCampaign
  };
};
