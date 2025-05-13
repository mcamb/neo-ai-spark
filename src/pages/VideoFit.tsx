
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { FileVideo, Upload } from 'lucide-react';
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Client = {
  id: string;
  name: string;
};

type Campaign = {
  id: string;
  name: string;
  client_id: string;
};

const VideoFit = () => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch campaigns based on selected client
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns', selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, client_id')
        .eq('client_id', selectedClientId)
        .order('name');
      
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
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      toast.error('Please select a client');
      return;
    }
    
    if (!selectedCampaignId) {
      toast.error('Please select a campaign');
      return;
    }
    
    if (!selectedFile) {
      toast.error('Please upload a video');
      return;
    }
    
    // Add your video upload and analysis logic here
    toast.success('Video uploaded for analysis');
    
    // For demonstration purposes only:
    console.log({
      clientId: selectedClientId,
      campaignId: selectedCampaignId,
      fileName: selectedFile.name,
      fileSize: selectedFile.size
    });
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
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
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
                  disabled={!selectedClientId || campaigns.length === 0}
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
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <Button 
                type="submit" 
                className="w-full"
                disabled={!selectedClientId || !selectedCampaignId || !selectedFile}
              >
                <FileVideo className="mr-2 h-4 w-4" />
                Analyze Video Fit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VideoFit;
