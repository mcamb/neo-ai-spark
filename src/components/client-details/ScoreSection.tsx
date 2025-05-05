
import React, { useState, useEffect } from 'react';
import { ScoreBar } from './ScoreBar';
import { MarkdownBox } from './MarkdownBox';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Activity, FileText } from 'lucide-react';
import { useChannels } from '@/hooks/useChannels';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaScore {
  platform: string;
  score: number;
  rationale: string;
}

interface ScoreSectionProps {
  socialMediaScores: SocialMediaScore[];
  clientId: string;
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ socialMediaScores, clientId }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedRationale, setSelectedRationale] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedScores, setEditedScores] = useState<SocialMediaScore[]>([]);
  const { channels } = useChannels();
  const { toast } = useToast();

  // Format the data for the chart
  const chartData = socialMediaScores.map(item => ({
    name: item.platform,
    score: item.score,
    rationale: item.rationale
  }));

  // Sort data by score (highest to lowest) to get the top channel
  const sortedData = [...chartData].sort((a, b) => b.score - a.score);

  useEffect(() => {
    // Set the default platform and rationale to the top scoring platform
    if (sortedData.length > 0 && !selectedPlatform) {
      const topPlatform = sortedData[0];
      setSelectedPlatform(topPlatform.name);
      setSelectedRationale(topPlatform.rationale || '');
    }
    
    // Initialize edited scores
    setEditedScores([...socialMediaScores]);
  }, [socialMediaScores]);

  const handleBarClick = (platform: string, rationale: string) => {
    setSelectedPlatform(platform);
    setSelectedRationale(rationale);
  };
  
  const startEditing = () => {
    setIsEditing(true);
  };
  
  const handleScoreChange = (platform: string, newScore: number) => {
    setEditedScores(prev => 
      prev.map(score => 
        score.platform === platform ? { ...score, score: newScore } : score
      )
    );
  };
  
  const handleRationaleChange = (value: string) => {
    setSelectedRationale(value);
    setEditedScores(prev => 
      prev.map(score => 
        score.platform === selectedPlatform ? { ...score, rationale: value } : score
      )
    );
  };
  
  const saveScoresChanges = async () => {
    try {
      // First get channel IDs for each platform
      const { data: channelsData, error: channelsError } = await supabase
        .from('channels')
        .select('id, channel');
        
      if (channelsError) throw channelsError;
      
      const channelMap = new Map(channelsData.map((ch: any) => [ch.channel, ch.id]));
      
      for (const score of editedScores) {
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
      
      toast({
        title: "Success",
        description: "Social media scores updated successfully.",
      });
    } catch (error) {
      console.error("Error saving scores:", error);
      toast({
        title: "Error",
        description: "Failed to update social media scores.",
        variant: "destructive"
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 bg-white shadow-sm rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black relative pb-2">
            Relevance Score
            <span className="absolute bottom-0 left-0 h-1 bg-[#FF4B4F]" style={{ width: '100%' }}></span>
          </h2>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={isEditing ? saveScoresChanges : startEditing}
            className="text-[#FF4B4F] hover:text-[#FF4B4F] hover:bg-[#FF4B4F]/10"
          >
            {isEditing ? (
              <>
                <Save className="h-3.5 w-3.5 mr-2" />
                Save
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {isEditing ? (
              <div className="space-y-3">
                {editedScores.map((item) => (
                  <div key={item.platform} className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-base font-medium text-black">{item.platform}</span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.score}
                          onChange={(e) => handleScoreChange(item.platform, parseInt(e.target.value) || 0)}
                          className="w-16 text-right border border-gray-300 rounded px-2 py-1"
                        />
                        <span className="ml-2 text-sm font-medium text-black">/100</span>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setSelectedPlatform(item.platform);
                        setSelectedRationale(item.rationale);
                      }}
                    >
                      <div className="w-full h-6 bg-gray-200 rounded-sm overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500 ease-out" 
                          style={{ 
                            width: `${item.score}%`, 
                            backgroundColor: item.score > 50 ? '#94C29D' : '#ea384c'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ScoreBar data={sortedData} onBarClick={handleBarClick} />
            )}
          </div>
          <div className="h-full">
            {selectedRationale && (
              <div className="h-full">
                <h3 className="text-base font-medium text-black mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-black" />
                  {selectedPlatform} Rationale
                </h3>
                <MarkdownBox 
                  isEditing={isEditing}
                  onEdit={handleRationaleChange}
                  value={selectedRationale}
                  style={{ backgroundColor: isEditing ? "white" : "#E8E5DE", height: "100%", minHeight: "300px" }}
                >
                  {selectedRationale}
                </MarkdownBox>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
