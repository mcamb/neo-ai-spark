
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface UseClientDeletionProps {
  refetch: () => void;
}

export const useClientDeletion = ({ refetch }: UseClientDeletionProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleDeletePrompt = (id: string) => {
    setSelectedClientId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!selectedClientId || isDeleting) return;
    
    setIsDeleting(true);
    setDeleteDialogOpen(false);
    
    try {
      const deleteToastId = toast.loading("Deleting client...");
      
      // Delete related records first
      await supabase
        .from('relevance_scores')
        .delete()
        .eq('client_id', selectedClientId);
      
      // Then delete the client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClientId);
        
      if (error) {
        toast.dismiss(deleteToastId);
        toast.error(`Deletion failed: ${error.message}`);
        console.error("Database error:", error);
      } else {
        toast.dismiss(deleteToastId);
        toast.success("Client deleted successfully");
        
        // Update the client list after deletion
        // Use a slight delay to ensure UI updates properly
        setTimeout(() => {
          refetch();
          setIsDeleting(false);
        }, 800);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Exception:", err);
      setIsDeleting(false);
    } finally {
      setSelectedClientId(null);
    }
  };

  return {
    selectedClientId,
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeletePrompt,
    handleDeleteClient
  };
};
