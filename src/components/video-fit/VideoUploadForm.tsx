
import React from 'react';
import { useVideoUpload } from './hooks/useVideoUpload';
import ClientSelector from './ClientSelector';
import CampaignSelector from './CampaignSelector';
import VideoPreview from './VideoPreview';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Client change handler to reset campaign selection
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    resetCampaignOnClientChange();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client and Campaign Selection */}
      <ClientSelector 
        selectedClientId={selectedClientId} 
        setSelectedClientId={handleClientChange}
        disabled={isUploading}
        required
      />
      
      <CampaignSelector 
        selectedClientId={selectedClientId}
        selectedCampaignId={selectedCampaignId}
        setSelectedCampaignId={setSelectedCampaignId}
        disabled={isUploading}
        required
      />
      
      {/* Video Title */}
      <div className="space-y-2">
        <Label htmlFor="video-title">Video Title<span className="text-red-500">*</span></Label>
        <Input
          id="video-title"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="Enter video title"
          disabled={isUploading}
          required
        />
      </div>
      
      {/* Video Craft and Format */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="video-craft">Video Crafted By<span className="text-red-500">*</span></Label>
          <Select 
            value={videoCraft} 
            onValueChange={setVideoCraft}
            disabled={isUploading}
            required
          >
            <SelectTrigger id="video-craft">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Brand">Brand</SelectItem>
              <SelectItem value="Creator">Creator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="video-format">Video Format<span className="text-red-500">*</span></Label>
          <Select 
            value={videoFormat} 
            onValueChange={setVideoFormat}
            disabled={isUploading}
            required
          >
            <SelectTrigger id="video-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="9:16">9:16</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
              <SelectItem value="4:5">4:5</SelectItem>
              <SelectItem value="2:3">2:3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Creator Name (conditionally rendered) */}
      {showCreatorField && (
        <div className="space-y-2">
          <Label htmlFor="creator-name">Creator<span className="text-red-500">*</span></Label>
          <Input
            id="creator-name"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Enter creator name"
            disabled={isUploading}
            required={showCreatorField}
          />
        </div>
      )}
      
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
