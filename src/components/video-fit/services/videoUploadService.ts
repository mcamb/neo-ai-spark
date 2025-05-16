
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
    
    // Create a record object with the correct field names matching the database schema
    const videoRecord = {
      titel: videoData.title,      // 'titel' is the column name in the database
      file: publicUrl,             // 'file' is the column name
      format: videoData.format,    // 'format' is the column name
      crafted_by: videoData.craft, // 'crafted_by' is the column name
      campaign_id: videoData.campaignId, // 'campaign_id' is the column name
      created_at: new Date().toISOString() // 'created_at' is required
    };
    
    // Only add creator field if craft is 'Creator'
    if (videoData.craft === 'Creator' && videoData.creatorName) {
      videoRecord['creator'] = videoData.creatorName; // 'creator' is the correct column name
    }
    
    console.log('Inserting video record:', videoRecord);
    
    // Insert data into videos table with the correct field mappings
    const { data, error: dbError } = await supabase
      .from('videos')
      .insert(videoRecord)
      .select();
    
    if (dbError) {
      console.error('Database error:', dbError);
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
