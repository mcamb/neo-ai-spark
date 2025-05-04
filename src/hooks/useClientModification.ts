
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface UseClientModificationProps {
  refetch: () => void;
}

export const useClientModification = ({ refetch }: UseClientModificationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsModalOpen(false);
  };

  const handleAddClient = async (clientData: any) => {
    try {
      setIsSubmitting(true);
      
      // First, insert the client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert(clientData)
        .select();

      if (clientError) {
        throw clientError;
      }
      
      if (newClient && newClient.length > 0) {
        // Get all channel IDs
        const { data: channels, error: channelsError } = await supabase
          .from('channels')
          .select('id');
          
        if (channelsError) {
          throw channelsError;
        }
        
        if (channels && channels.length > 0) {
          // Create default relevance scores for each channel
          const relevanceScores = channels.map(channel => ({
            client_id: newClient[0].id,
            channel_id: channel.id,
            score: 50, // Default score of 50 out of 100
            rationale: 'Initial default score'
          }));
          
          // Insert the default relevance scores
          const { error: scoresError } = await supabase
            .from('relevance_scores')
            .insert(relevanceScores);
            
          if (scoresError) {
            // Log error but don't fail the whole operation
            console.error("Error creating default scores:", scoresError);
            toast("Warning: Client created but default scores could not be added.");
          }
        }
      }
      
      toast("Client added successfully");
      
      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error in client creation:", error);
      toast(`Failed to add client: ${error.message}`, {
        style: { backgroundColor: 'red', color: 'white' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClient = (id: string) => {
    setSelectedClientId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClientId(null);
  };

  return {
    // Add client state and handlers
    isModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    handleAddClient,
    isSubmitting,
    
    // Edit client state and handlers
    isEditModalOpen,
    selectedClientId,
    handleEditClient,
    handleCloseEditModal,
  };
};
