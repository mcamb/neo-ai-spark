
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
    
    try {
      const deleteToastId = toast.loading("Deleting client...");
      
      // First delete related records in relevance_scores
      const { error: relatedError } = await supabase
        .from('relevance_scores')
        .delete()
        .eq('client_id', selectedClientId);
      
      if (relatedError) {
        console.error("Error deleting related records:", relatedError);
        toast.dismiss(deleteToastId);
        toast.error(`Failed to delete related records: ${relatedError.message}`);
        setIsDeleting(false);
        return;
      }
      
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
        refetch();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Exception:", err);
    } finally {
      setIsDeleting(false);
      setSelectedClientId(null);
      setDeleteDialogOpen(false);
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
