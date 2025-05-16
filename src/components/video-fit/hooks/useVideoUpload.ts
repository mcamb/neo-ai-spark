
import { useVideoFormState } from './useVideoFormState';
import { useVideoHandlers } from './useVideoHandlers';

interface UseVideoUploadProps {
  onSuccess?: () => void;
}

export const useVideoUpload = ({ onSuccess }: UseVideoUploadProps) => {
  // Get form state
  const formState = useVideoFormState();
  
  // Get handlers
  const {
    isUploading,
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit
  } = useVideoHandlers({ 
    formState,
    onSuccess
  });

  // Return everything needed by the VideoUploadForm component
  return {
    // Form state
    ...formState,
    // Upload state
    isUploading,
    // Handlers
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit
  };
};
