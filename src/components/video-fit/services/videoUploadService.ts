
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
    
    // Create a record object with the correct field names matching the database schema
    const videoRecord = {
      titel: videoData.title,
      file: publicUrl,
      format: videoData.format,
      crafted_by: videoData.craft,
      campaign_id: videoData.campaignId
    };
    
    // Only add creator field if craft is 'Creator'
    if (videoData.craft === 'Creator' && videoData.creatorName) {
      videoRecord['creator'] = videoData.creatorName;
    }
    
    console.log("DEBUG: videoRecord", videoRecord);
    console.log("DEBUG: JSON payload", JSON.stringify(videoRecord, null, 2));
    
    // Insert data into videos table - simple insert without select or columns
    const { error: dbError } = await supabase
      .from('videos')
      .insert([videoRecord]);
    
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
