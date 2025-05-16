
import React from 'react';
import { useVideoUpload } from './hooks/useVideoUpload';
import VideoPreview from './VideoPreview';
import ClientCampaignSection from './form-sections/ClientCampaignSection';
import VideoDetailSection from './form-sections/VideoDetailSection';
import FormSubmitButton from './form-sections/FormSubmitButton';
import UploadFeedback from './form-sections/UploadFeedback';

interface VideoUploadFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onSuccess, onClose }) => {
  // Use our custom hook that provides all form state and handlers
  const {
    // Form state
    selectedClientId,
    setSelectedClientId,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedFile,
    previewUrl,
    videoTitle,
    setVideoTitle,
    videoCraft,
    setVideoCraft,
    videoFormat,
    setVideoFormat,
    creatorName,
    setCreatorName,
    showCreatorField,
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
  } = useVideoUpload({ onSuccess, onClose });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client and Campaign Selection */}
      <ClientCampaignSection
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        selectedCampaignId={selectedCampaignId}
        setSelectedCampaignId={setSelectedCampaignId}
        isUploading={isUploading}
        resetCampaignOnClientChange={resetCampaignOnClientChange}
        required
      />
      
      {/* Video Details */}
      <VideoDetailSection
        videoTitle={videoTitle}
        setVideoTitle={setVideoTitle}
        videoCraft={videoCraft}
        setVideoCraft={setVideoCraft}
        videoFormat={videoFormat}
        setVideoFormat={setVideoFormat}
        isUploading={isUploading}
        showCreatorField={showCreatorField}
        creatorName={creatorName}
        setCreatorName={setCreatorName}
      />
      
      {/* Video Upload */}
      <VideoPreview
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
        required
      />
      
      {/* Upload Feedback (errors, progress, etc.) */}
      <UploadFeedback
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
        lastUploadResult={lastUploadResult}
      />
      
      {/* Submit Button */}
      <FormSubmitButton 
        isUploading={isUploading} 
        isFormValid={isFormValid} 
      />
    </form>
  );
};

export default VideoUploadForm;
