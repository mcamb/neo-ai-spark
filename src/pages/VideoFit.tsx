
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { FileVideo, Upload, Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define proper types based on the database schema
type Client = {
  id: string;
  brand: string;  // In the clients table, it's 'brand' not 'name'
};

type Campaign = {
  id: string;
  titel: string;  // In the campaigns table, it's 'titel' not 'name'
  client_id: string;
};

const VideoFit = () => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCraft, setVideoCraft] = useState<string>('Brand');
  const [videoFormat, setVideoFormat] = useState<string>('16:9');
  const [videoDescription, setVideoDescription] = useState<string>('');

  // Fetch clients - using 'brand' instead of 'name'
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, brand')  // Select brand instead of name
        .order('brand');      // Order by brand
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch campaigns based on selected client - using 'titel' instead of 'name'
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns', selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, titel, client_id')  // Select titel instead of name
        .eq('client_id', selectedClientId)
        .order('titel');                 // Order by titel
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedClientId
  });

  // Reset campaign selection when client changes
  useEffect(() => {
    setSelectedCampaignId('');
  }, [selectedClientId]);

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
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          campaign_id: selectedCampaignId,
          titel: videoTitle,
          craft: videoCraft,
          format: videoFormat,
          file: publicUrl,
          description: videoDescription
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Success",
        description: "Video uploaded for analysis"
      });
      
      // Reset form after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
      setVideoTitle('');
      setVideoDescription('');
      setVideoFormat('16:9');
      setVideoCraft('Brand');
      
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
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Video Fit</h1>
          <p className="text-gray-600 mt-1">
            Upload a video and analyze whether it aligns with your campaign.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select 
                  value={selectedClientId} 
                  onValueChange={setSelectedClientId}
                  disabled={isUploading}
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

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <Select 
                  value={selectedCampaignId} 
                  onValueChange={setSelectedCampaignId}
                  disabled={!selectedClientId || campaigns.length === 0 || isUploading}
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

              <div className="space-y-2">
                <Label htmlFor="video-title">Video Title</Label>
                <Input
                  id="video-title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                  disabled={isUploading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-craft">Video Craft</Label>
                  <Select 
                    value={videoCraft} 
                    onValueChange={setVideoCraft}
                    disabled={isUploading}
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
                  <Label htmlFor="video-format">Video Format</Label>
                  <Select 
                    value={videoFormat} 
                    onValueChange={setVideoFormat}
                    disabled={isUploading}
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

              <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Video</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
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

              <div className="space-y-2">
                <Label htmlFor="video-description">Description (optional)</Label>
                <Textarea
                  id="video-description"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Add a description for this video"
                  rows={3}
                  disabled={isUploading}
                />
              </div>

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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VideoFit;
