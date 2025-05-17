
import { useVideoFormState } from './useVideoFormState';
import { useVideoHandlers } from './useVideoHandlers';

interface UseVideoUploadProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useVideoUpload = ({ onSuccess, onClose }: UseVideoUploadProps) => {
  // Get form state
  const formState = useVideoFormState();
  
  // Get handlers with tracking features
  const {
    isUploading,
    uploadProgress,
    uploadError,
    lastUploadResult,
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit
  } = useVideoHandlers({ 
    formState,
    onSuccess,
    onClose
  });

  // Calculate if form is valid for submit button state
  const isFormValid = Boolean(
    formState.selectedClientId &&
    formState.selectedCampaignId &&
    formState.selectedFile &&
    formState.videoTitle &&
    formState.creatorName
  );

  // Return everything needed by the VideoUploadForm component
  return {
    // Form state
    ...formState,
    // Upload state
    isUploading,
    uploadProgress,
    uploadError,
    lastUploadResult,
    isFormValid,
    // Handlers
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit
  };
};
