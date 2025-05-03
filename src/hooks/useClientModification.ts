
import { useState } from 'react';

interface UseClientModificationProps {
  refetch: () => void;
}

export const useClientModification = ({ refetch }: UseClientModificationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsModalOpen(false);
  };

  const handleAddClient = () => {
    refetch();
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
    
    // Edit client state and handlers
    isEditModalOpen,
    selectedClientId,
    handleEditClient,
    handleCloseEditModal,
  };
};
