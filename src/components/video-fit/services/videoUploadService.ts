
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  title: string;
  format: string;
  created_by: string;
  campaign_id: string; // Changed from campaignId to campaign_id
  creator: string; // Removed optional flag
}

export interface UploadResult {
  success: boolean;
  message: string;
  error?: any;
  videoId?: string;
}

// Helper function to validate if a string is a valid UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const uploadVideo = async (file: File | null, videoData: VideoData): Promise<UploadResult> => {
  try {
    // Enhanced validation for campaign UUID - check if it's actually a valid UUID format
    if (!videoData.campaign_id || !isValidUUID(videoData.campaign_id)) {
      console.error('Invalid campaign ID format:', videoData.campaign_id);
      throw new Error('Invalid campaign ID format. Please select a valid campaign.');
    }
    
    // Validate that a file was provided (now required)
    if (!file) {
      throw new Error('No video file selected. Please select a video file.');
    }
    
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
    
    console.log('Video uploaded successfully with URL:', publicUrl);
    
    // Wait a small amount of time to ensure the URL is accessible
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Preparing to insert video record with campaign_id:', videoData.campaign_id);
    
    // Fix: Explicitly specify columns and values for the insert operation
    const { data: insertedData, error: dbError } = await supabase
      .from('videos')
      .insert({
        title: videoData.title,
        format: videoData.format,
        created_by: videoData.created_by,
        campaign_id: videoData.campaign_id,  // Using campaign_id instead of campaignId
        creator: videoData.creator,  // Removed the || null fallback
        video_url: publicUrl
      })
      .select('id')
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    } else {
      console.log("✅ Video record created successfully:", insertedData);
    }
    
    toast({
      title: "Success",
      description: "Video record created successfully"
    });
    
    return {
      success: true, 
      message: "Video record created successfully",
      videoId: insertedData?.id
    };
  } catch (error) {
    console.error('Error creating video record:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = "Failed to create video record";
    
    if (error.message) {
      errorMessage += `: ${error.message}`;
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
