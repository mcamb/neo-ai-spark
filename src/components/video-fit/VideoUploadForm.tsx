
import React, { useEffect } from 'react';
import ClientSelector from './ClientSelector';
import CampaignSelector from './CampaignSelector';
import VideoPreview from './VideoPreview';
import VideoDetailSection from './form-sections/VideoDetailSection';
import FormSubmitButton from './form-sections/FormSubmitButton';
import { useVideoUpload } from './hooks/useVideoUpload';

type VideoFormProps = {
  onSuccess?: () => void;
};

const VideoUploadForm: React.FC<VideoFormProps> = ({ onSuccess }) => {
  const {
    selectedClientId,
    setSelectedClientId,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedFile,
    previewUrl,
    isUploading,
    videoTitle,
    setVideoTitle,
    videoCraft,
    setVideoCraft,
    videoFormat,
    setVideoFormat,
    creatorName,
    setCreatorName,
    showCreatorField,
    handleFileChange,
    resetCampaignOnClientChange,
    handleSubmit,
    isFormValid
  } = useVideoUpload({ onSuccess });

  // Reset campaign selection when client changes
  useEffect(() => {
    resetCampaignOnClientChange();
  }, [selectedClientId]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClientSelector 
        selectedClientId={selectedClientId} 
        setSelectedClientId={setSelectedClientId}
        disabled={isUploading}
        required={true}
      />

      <CampaignSelector
        selectedClientId={selectedClientId}
        selectedCampaignId={selectedCampaignId}
        setSelectedCampaignId={setSelectedCampaignId}
        disabled={isUploading}
        required={true}
      />

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

      <VideoPreview 
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
        required={true}
      />

      <FormSubmitButton 
        isUploading={isUploading}
        isFormValid={isFormValid}
      />
    </form>
  );
};

export default VideoUploadForm;
