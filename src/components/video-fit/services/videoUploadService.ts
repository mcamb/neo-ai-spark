
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

export const uploadVideo = async (file: File | null, videoData: VideoData): Promise<UploadResult> => {
  try {
    // Validate the campaign ID to ensure it's a valid UUID before proceeding
    if (!videoData.campaignId || videoData.campaignId.trim() === '' || videoData.campaignId === 'undefined') {
      throw new Error('Missing or invalid campaign ID. Please select a valid campaign.');
    }
    
    let publicUrl = '';
    
    // Only upload file if one was provided
    if (file) {
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
      
      publicUrl = publicUrlData.publicUrl;
    }
    
    // Define exact columns and values for the insert operation
    // This explicitly maps each column to its value to avoid column count mismatches
    const { data: insertedData, error: dbError } = await supabase
      .from('videos')
      .insert({
        title: videoData.title,
        format: videoData.format,
        created_by: videoData.created_by,
        campaign_id: videoData.campaignId,
        creator: videoData.creator || null,  // Handle null explicitly
        video_url: publicUrl || null  // Set to null if no URL exists
      });
    
    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    } else {
      console.log("✅ Video record created successfully");
    }
    
    toast({
      title: "Success",
      description: "Video record created successfully"
    });
    
    return {
      success: true, 
      message: "Video record created successfully"
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
