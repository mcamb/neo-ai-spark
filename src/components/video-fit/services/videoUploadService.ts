
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  title: string;
  format: string;
  created_by: string;
  campaignId: string;
  creator?: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  error?: any;
  videoId?: string;
}

export const uploadVideo = async (file: File, videoData: VideoData): Promise<UploadResult> => {
  try {
    // Validate the campaign ID to ensure it's a valid UUID before proceeding
    if (!videoData.campaignId || videoData.campaignId.trim() === '' || videoData.campaignId === 'undefined') {
      throw new Error('Missing or invalid campaign ID. Please select a valid campaign.');
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
    
    // Create a record with only the fields that exist in the database table
    const videoRecord = {
      title: videoData.title,
      video_url: publicUrl,
      format: videoData.format,
      created_by: videoData.created_by,
      campaign_id: videoData.campaignId,
      creator: videoData.creator
    };
    
    console.log("DEBUG: videoRecord", videoRecord);
    
    // Insert data into videos table with explicitly specified columns
    const { data: insertData, error: dbError } = await supabase
      .from('videos')
      .insert([{
        title: videoData.title,
        video_url: publicUrl,
        format: videoData.format,
        created_by: videoData.created_by,
        campaign_id: videoData.campaignId,
        creator: videoData.creator
      }]);
    
    // Log success or failure
    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    } else {
      console.log("✅ Insert successful");
    }
    
    console.log("Fertig"); // ✅ indicating completion
    
    toast({
      title: "Success",
      description: "Video uploaded successfully"
    });
    
    // Return success but without videoId since we're not fetching it
    return {
      success: true, 
      message: "Video uploaded successfully"
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = "Failed to upload video";
    
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
