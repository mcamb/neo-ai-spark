import React, { useState } from 'react';
import { FileVideo, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ClientSelector from './ClientSelector';
import CampaignSelector from './CampaignSelector';
import VideoPreview from './VideoPreview';

type VideoFormProps = {
  onSuccess?: () => void;
};

const VideoUploadForm: React.FC<VideoFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCraft, setVideoCraft] = useState<string>('Brand');
  const [videoFormat, setVideoFormat] = useState<string>('16:9');

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
  React.useEffect(() => {
    setSelectedCampaignId('');
  }, [selectedClientId]);

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
      
      // Save video metadata to the database
      const { data: videoData, error: dbError } = await supabase
        .from('videos')
        .insert({
          campaign_id: selectedCampaignId,
          titel: videoTitle,
          craft: videoCraft,
          format: videoFormat,
          file: publicUrl
        })
        .select('id')
        .single();
        
      if (dbError) throw dbError;
      
      toast({
        title: "Success",
        description: "Video uploaded for analysis"
      });
      
      // Reset form after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
      setVideoTitle('');
      setVideoFormat('16:9');
      setVideoCraft('Brand');
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate to the video analysis page
      if (videoData?.id) {
        navigate(`/lab/video-fit/analysis/${videoData.id}`);
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

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="video-craft">Video Craft<span className="text-red-500">*</span></Label>
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

      <VideoPreview 
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
        required={true}
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={!selectedClientId || !selectedCampaignId || !selectedFile || !videoTitle || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading Video...
          </>
        ) : (
          <>
            <FileVideo className="mr-2 h-4 w-4" />
            Upload and Analyze Video
          </>
        )}
      </Button>
    </form>
  );
};

export default VideoUploadForm;
