
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { uploadVideo } from './services/videoUploadService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VideoUploadFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onSuccess, onClose }) => {
  // Client state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  
  // Video details
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCraft, setVideoCraft] = useState<string>('Brand');
  const [videoFormat, setVideoFormat] = useState<string>('16:9');
  const [creatorName, setCreatorName] = useState<string>('');
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, brand')
        .order('brand');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch campaigns based on selected client
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns', selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, titel, client_id')
        .eq('client_id', selectedClientId)
        .order('titel');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedClientId
  });
  
  // Handle client change - reset campaign selection
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedCampaignId('');
  };
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Reset previous errors
    setUploadError(null);
    
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
  
  // Show creator field only when "Creator" is selected
  const showCreatorField = videoCraft === 'Creator';
  
  // Form validation
  const isFormValid = Boolean(
    selectedClientId &&
    selectedCampaignId &&
    selectedFile &&
    videoTitle &&
    (!showCreatorField || (showCreatorField && creatorName))
  );
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !selectedFile) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const result = await uploadVideo(
        selectedFile,
        {
          title: videoTitle,
          format: videoFormat,
          craft: videoCraft,
          campaignId: selectedCampaignId,
          creatorName: creatorName || undefined
        }
      );
      
      if (result.success) {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        setUploadError(result.message);
      }
    } catch (error) {
      setUploadError("An unexpected error occurred");
      console.error(error);
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
      {/* Client Selection */}
      <div className="space-y-2">
        <Label htmlFor="client">Client<span className="text-red-500">*</span></Label>
        <Select 
          value={selectedClientId} 
          onValueChange={handleClientChange}
          disabled={isUploading}
          required
        >
          <SelectTrigger id="client">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Campaign Selection */}
      <div className="space-y-2">
        <Label htmlFor="campaign">Campaign<span className="text-red-500">*</span></Label>
        <Select 
          value={selectedCampaignId} 
          onValueChange={setSelectedCampaignId}
          disabled={!selectedClientId || campaigns.length === 0 || isUploading}
          required
        >
          <SelectTrigger id="campaign">
            <SelectValue placeholder={
              !selectedClientId 
                ? "Select a client first" 
                : campaigns.length === 0 
                  ? "No campaigns available" 
                  : "Select a campaign"
            } />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.titel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
      <div className="space-y-2">
        <Label htmlFor="video-upload">Upload Video<span className="text-red-500">*</span></Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <Input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
            required
          />
          
          {!previewUrl ? (
            <label 
              htmlFor="video-upload" 
              className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">
                Drag and drop a video file, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                MP4, MOV, or WebM files supported
              </p>
            </label>
          ) : (
            <div className="space-y-4">
              <video
                controls
                src={previewUrl}
                className="max-h-64 mx-auto rounded"
              />
              <p className="text-sm text-gray-500 mt-2">
                {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <label 
                htmlFor="video-upload" 
                className="text-sm text-blue-500 cursor-pointer"
              >
                Choose a different video
              </label>
            </div>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {uploadError}
        </div>
      )}
      
      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full"
        disabled={!isFormValid || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading Video...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload and Analyze Video
          </>
        )}
      </Button>
    </form>
  );
};

export default VideoUploadForm;
