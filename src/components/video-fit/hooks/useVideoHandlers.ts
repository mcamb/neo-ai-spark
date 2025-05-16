import { useState } from 'react';
import { uploadVideo, UploadResult } from '../services/videoUploadService';
import { validateVideoForm } from '../utils/formValidation';
import { createVideoPreview, getVideoTitleFromFileName } from '../utils/videoFileUtils';
import { VideoFormState } from './useVideoFormState';
import { toast } from '@/hooks/use-toast';

interface VideoHandlersProps {
  formState: VideoFormState;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useVideoHandlers = ({ formState, onSuccess, onClose }: VideoHandlersProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [lastUploadResult, setLastUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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
    
    // Reset previous errors when selecting a new file
    setUploadError(null);
    setLastUploadResult(null);
    
    // Create preview URL for video
    if (file) {
      const url = createVideoPreview(file);
      setPreviewUrl(url);
      // Use file name as default title if no title is set
      if (!videoTitle) {
        setVideoTitle(getVideoTitleFromFileName(file));
      }
      
      // Show a toast for file selection
      toast({
        title: "File Selected",
        description: `Selected ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`
      });
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
    
    // Reset previous results
    setLastUploadResult(null);
    setUploadError(null);
    
    // Validate form data
    const isValid = validateVideoForm({
      selectedClientId,
      selectedCampaignId,
      selectedFile,
      videoTitle,
      showCreatorField,
      creatorName
    });
    
    if (!isValid) {
      setUploadError("Form validation failed");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Hold at 90% until actual completion
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      // Upload video and save to database
      const result = await uploadVideo(
        selectedFile as File,
        {
          title: videoTitle,
          format: videoFormat,
          craft: videoCraft,
          campaignId: selectedCampaignId,
          creatorName: creatorName || undefined
        }
      );
      
      setLastUploadResult(result);
      
      if (result.success) {
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setVideoTitle('');
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Close the modal if onClose callback is provided
        if (onClose) {
          onClose();
        }
      } else {
        setUploadError(result.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Unexpected error during upload:", error);
      setUploadError("An unexpected error occurred");
      setLastUploadResult({
        success: false,
        message: "Unexpected error",
        error: error
      });
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(100); // Complete the progress bar
      
      // Give time for progress bar to show completion
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadError,
    lastUploadResult,
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit
  };
};
