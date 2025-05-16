
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
    
    console.log('Starting file upload to storage:', { filePath, fileSize: file.size });
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully:', uploadData);
    
    // Get the public URL for the uploaded video
    const { data: publicUrlData } = supabase
      .storage
      .from('videos')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData.publicUrl;
    console.log('Public URL generated:', publicUrl);
    
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
    
    console.log('Video data inserted successfully:', data);
    
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
    } else if (error.message?.includes('column') && error.message?.includes('does not exist')) {
      errorMessage = "Database schema mismatch: " + error.message;
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
