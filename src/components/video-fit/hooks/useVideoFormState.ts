
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
  creatorName: string;
  setCreatorName: (name: string) => void;
  showCreatorField: boolean;
  isFormValid: boolean;
}

export const useVideoFormState = (): VideoFormState => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCraft, setVideoCraft] = useState<string>('Brand');
  const [videoFormat, setVideoFormat] = useState<string>('16:9');
  const [creatorName, setCreatorName] = useState<string>('');
  const [showCreatorField, setShowCreatorField] = useState<boolean>(false);

  // Update showCreatorField when videoCraft changes
  useEffect(() => {
    setShowCreatorField(videoCraft === 'Creator');
    // Clear creator name if not showing the field
    if (videoCraft !== 'Creator') {
      setCreatorName('');
    }
  }, [videoCraft]);

  // Form validity check
  const isFormValid = !!selectedClientId && !!selectedCampaignId && !!selectedFile && !!videoTitle && 
    (!showCreatorField || (showCreatorField && !!creatorName));

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
    creatorName,
    setCreatorName,
    showCreatorField,
    isFormValid
  };
};
