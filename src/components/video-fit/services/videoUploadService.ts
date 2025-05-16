
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  title: string;
  format: string;
  craft: string;
  campaignId: string;
  creatorName?: string;
}

export const uploadVideo = async (file: File, videoData: VideoData): Promise<boolean> => {
  try {
    // Upload video to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL for the uploaded video
    const { data: publicUrlData } = supabase
      .storage
      .from('videos')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData.publicUrl;
    
    // Create a database insert object with exact column names matching the videos table
    const insertData = {
      titel: videoData.title,
      file: publicUrl,
      format: videoData.format,
      crafted_by: videoData.craft,
      campaign_id: videoData.campaignId
    };
    
    // Only add creator field if it's a Creator-crafted video with a name
    if (videoData.craft === 'Creator' && videoData.creatorName) {
      insertData['creator'] = videoData.creatorName;
    }
    
    console.log('Inserting video data:', insertData);
    
    // Perform the direct insert without wrapping insertData in an array
    const { data, error: dbError } = await supabase
      .from('videos')
      .insert(insertData)
      .select();
    
    if (dbError) {
      console.error('Database insertion error:', dbError);
      throw dbError;
    }
    
    toast({
      title: "Success",
      description: "Video uploaded successfully"
    });
    
    return true;
  } catch (error) {
    console.error('Error uploading video:', error);
    toast({
      title: "Error",
      description: "Failed to upload video",
      variant: "destructive"
    });
    return false;
  }
};
