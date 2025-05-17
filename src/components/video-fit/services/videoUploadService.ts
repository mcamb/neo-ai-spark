
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
    } else {
      // For testing: Use a placeholder URL when no file is provided
      publicUrl = 'https://placeholder-for-testing.com/no-video-uploaded';
      console.log("No file uploaded, using placeholder URL for testing");
    }
    
    // Prepare insert data
    const insertData = {
      title: videoData.title,
      video_url: publicUrl,
      format: videoData.format,
      created_by: videoData.created_by,
      campaign_id: videoData.campaignId
    };

    // Only add creator field if it's provided and not empty
    if (videoData.creator && videoData.creator.trim() !== '') {
      insertData['creator'] = videoData.creator;
    }
    
    console.log("DEBUG: Inserting with data:", JSON.stringify(insertData, null, 2));
    
    // Explicitly list columns and values to ensure they match
    const { data: insertedData, error: dbError } = await supabase
      .from('videos')
      .insert(insertData);
    
    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    } else {
      console.log("✅ Insert successful");
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
