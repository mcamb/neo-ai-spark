
import { supabase } from '@/integrations/supabase/client';
import { SocialMediaScore } from '@/models/clientDetails';

export async function saveScoresToSupabase(
  clientId: string,
  scores: SocialMediaScore[]
): Promise<{ success: boolean, error?: any }> {
  try {
    // First get channel IDs for each platform
    const { data: channelsData, error: channelsError } = await supabase
      .from('channels')
      .select('id, channel');
      
    if (channelsError) throw channelsError;
    
    const channelMap = new Map(channelsData.map((ch: any) => [ch.channel, ch.id]));
    
    for (const score of scores) {
      const channelId = channelMap.get(score.platform);
      if (!channelId) {
        console.error(`No channel ID found for platform ${score.platform}`);
        continue;
      }
      
      // Check if this score exists in the database
      const { data: existingScore, error: scoreCheckError } = await supabase
        .from('relevance_scores')
        .select('id')
        .eq('client_id', clientId)
        .eq('channel_id', channelId)
        .maybeSingle();
        
      if (scoreCheckError) throw scoreCheckError;
      
      if (existingScore) {
        // Update existing score
        const { error: updateError } = await supabase
          .from('relevance_scores')
          .update({
            score: score.score,
            rationale: score.rationale
          })
          .eq('id', existingScore.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new score
        const { error: insertError } = await supabase
          .from('relevance_scores')
          .insert({
            client_id: clientId,
            channel_id: channelId,
            score: score.score,
            rationale: score.rationale
          });
          
        if (insertError) throw insertError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving scores:", error);
    return { success: false, error };
  }
}
