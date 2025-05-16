
import { useState } from 'react';
import { uploadVideo } from '../services/videoUploadService';
import { validateVideoForm } from '../utils/formValidation';
import { createVideoPreview, getVideoTitleFromFileName } from '../utils/videoFileUtils';
import { VideoFormState } from './useVideoFormState';

interface VideoHandlersProps {
  formState: VideoFormState;
  onSuccess?: () => void;
}

export const useVideoHandlers = ({ formState, onSuccess }: VideoHandlersProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {
    selectedClientId,
    selectedCampaignId,
    selectedFile, 
    setSelectedFile,
    videoTitle,
    setVideoTitle,
    videoCraft,
    videoFormat,
    creatorName,
    showCreatorField,
    setPreviewUrl,
  } = formState;

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Create preview URL for video
    if (file) {
      const url = createVideoPreview(file);
      setPreviewUrl(url);
      // Use file name as default title if no title is set
      if (!videoTitle) {
        setVideoTitle(getVideoTitleFromFileName(file));
      }
    } else {
      setPreviewUrl(null);
    }
  };

  // Reset campaign selection when client changes
  const resetCampaignOnClientChange = () => {
    // This function is used as a side effect in VideoUploadForm
    // and doesn't need any implementation here
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const isValid = validateVideoForm({
      selectedClientId,
      selectedCampaignId,
      selectedFile,
      videoTitle,
      showCreatorField,
      creatorName
    });
    
    if (!isValid) return;
    
    setIsUploading(true);
    
    try {
      // Upload video and save to database
      const uploadSuccess = await uploadVideo(
        selectedFile as File,
        {
          title: videoTitle,
          format: videoFormat,
          craft: videoCraft,
          campaignId: selectedCampaignId,
          creatorName: creatorName || undefined
        }
      );
      
      if (uploadSuccess) {
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setVideoTitle('');
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit
  };
};
