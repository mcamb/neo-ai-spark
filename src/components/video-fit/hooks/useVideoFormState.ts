
import { useState, useEffect } from 'react';

export interface VideoFormState {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedCampaignId: string;
  setSelectedCampaignId: (id: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoCraft: string;
  setVideoCraft: (craft: string) => void;
  videoFormat: string;
  setVideoFormat: (format: string) => void;
  showCreatorField: boolean;
  creatorName: string;
  setCreatorName: (name: string) => void;
}

export const useVideoFormState = (): VideoFormState => {
  // Client and Campaign selection state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Video details state
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCraft, setVideoCraft] = useState<string>('Brand'); // Default to Brand
  const [videoFormat, setVideoFormat] = useState<string>('16:9'); // Default to 16:9
  
  // Creator field state
  const [creatorName, setCreatorName] = useState<string>('');
  
  // Determine if the creator field should be shown
  const showCreatorField = videoCraft === 'Creator';
  
  // Log state changes for debugging
  useEffect(() => {
    console.log('Form state updated:', {
      videoCraft,
      showCreatorField,
      creatorName
    });
  }, [videoCraft, showCreatorField, creatorName]);
  
  // Update showCreatorField and reset creatorName when the craft changes
  useEffect(() => {
    if (videoCraft !== 'Creator') {
      setCreatorName(''); // Reset creator name if craft is not Creator
    }
  }, [videoCraft]);
  
  return {
    selectedClientId,
    setSelectedClientId,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedFile,
    setSelectedFile,
    previewUrl, 
    setPreviewUrl,
    videoTitle,
    setVideoTitle,
    videoCraft,
    setVideoCraft,
    videoFormat,
    setVideoFormat,
    showCreatorField,
    creatorName,
    setCreatorName
  };
};
