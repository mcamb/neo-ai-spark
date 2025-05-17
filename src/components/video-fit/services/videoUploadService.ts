
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

// Helper function to validate if a string is a valid UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const uploadVideo = async (file: File | null, videoData: VideoData): Promise<UploadResult> => {
  try {
    // Enhanced validation for campaign UUID - check if it's actually a valid UUID format
    if (!videoData.campaignId || !isValidUUID(videoData.campaignId)) {
      console.error('Invalid campaign ID format:', videoData.campaignId);
      throw new Error('Invalid campaign ID format. Please select a valid campaign.');
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
    
    console.log('Preparing to insert video record with campaign_id:', videoData.campaignId);
    
    // Define exact columns and values for the insert operation
    const { data: insertedData, error: dbError } = await supabase
      .from('videos')
      .insert({
        title: videoData.title,
        format: videoData.format,
        created_by: videoData.created_by,
        campaign_id: videoData.campaignId,
        creator: videoData.creator || null,
        video_url: publicUrl || null
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
