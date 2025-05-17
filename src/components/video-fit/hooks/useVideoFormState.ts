
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
  const [creatorName, setCreatorName] = useState<string>('');
  
  // Log state changes for debugging
  useEffect(() => {
    console.log('Form state updated:', {
      videoCraft,
      creatorName
    });
  }, [videoCraft, creatorName]);
  
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
    setCreatorName
  };
};
