
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseVideoUploadProps {
  onSuccess?: () => void;
}

export const useVideoUpload = ({ onSuccess }: UseVideoUploadProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Create preview URL for video
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Use file name as default title if no title is set
      if (!videoTitle) {
        setVideoTitle(file.name.split('.')[0]);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  // Reset campaign selection when client changes
  const resetCampaignOnClientChange = () => {
    setSelectedCampaignId('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCampaignId) {
      toast({
        title: "Error",
        description: "Please select a campaign",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please upload a video",
        variant: "destructive"
      });
      return;
    }

    if (!videoTitle) {
      toast({
        title: "Error",
        description: "Please enter a video title",
        variant: "destructive"
      });
      return;
    }

    if (showCreatorField && !creatorName) {
      toast({
        title: "Error",
        description: "Please enter creator name",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload video to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('videos')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded video
      const { data: publicUrlData } = supabase
        .storage
        .from('videos')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData.publicUrl;
      
      // Explicitly define which columns we're inserting data into
      const insertData = {
        titel: videoTitle,
        campaign_id: selectedCampaignId,
        file: publicUrl,
        format: videoFormat,
        crafted_by: videoCraft
      };
      
      // Only add creator if it's a Creator-crafted video
      if (videoCraft === 'Creator' && creatorName) {
        Object.assign(insertData, { creator: creatorName });
      }
      
      console.log('Inserting video data:', insertData);
      
      const { data, error: dbError } = await supabase
        .from('videos')
        .insert([insertData])
        .select('id')
        .single();
        
      if (dbError) throw dbError;
      
      toast({
        title: "Success",
        description: "Video uploaded successfully"
      });
      
      // Reset form after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
      setVideoTitle('');
      setVideoFormat('16:9');
      setVideoCraft('Brand');
      setCreatorName('');
      
      // Call the onSuccess callback if provided to close the modal and refresh the videos list
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

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
  };
};
