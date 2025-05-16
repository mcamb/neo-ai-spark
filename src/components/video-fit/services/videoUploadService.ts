
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  title: string;
  format: string;
  craft: string;
  campaignId: string;
  creatorName?: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  error?: any;
  videoId?: string;
}

export const uploadVideo = async (file: File, videoData: VideoData): Promise<UploadResult> => {
  try {
    // Upload video to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the uploaded video
    const { data: publicUrlData } = supabase
      .storage
      .from('videos')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData.publicUrl;
    
    // Create database entry
    const { data, error: dbError } = await supabase
      .from('videos')
      .insert({
        titel: videoData.title,
        file: publicUrl,
        format: videoData.format,
        crafted_by: videoData.craft,
        campaign_id: videoData.campaignId,
        creator: videoData.craft === 'Creator' ? videoData.creatorName : null
      })
      .select();
    
    if (dbError) {
      throw dbError;
    }
    
    toast({
      title: "Success",
      description: "Video uploaded successfully"
    });
    
    return {
      success: true, 
      message: "Video uploaded successfully",
      videoId: data?.[0]?.id
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = "Failed to upload video";
    
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    if (error.code === '23505') {
      errorMessage = "A video with this name already exists";
    } else if (error.code === '23503') {
      errorMessage = "Referenced campaign does not exist";
    } else if (error.code === '23502') {
      errorMessage = "Missing required field in video data";
    } else if (error.code === '42601') {
      errorMessage = "SQL syntax error - please check column names in the insert statement";
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
    
    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};
