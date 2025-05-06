
import React, { useState } from 'react';
import { ScoreBar } from './ScoreBar';
import { ScoreEditor } from './ScoreEditor';
import { ScoreRationale } from './ScoreRationale';
import { SectionHeader } from './SectionHeader';
import { Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SocialMediaScore } from '@/models/clientDetails';
import { saveScoresToSupabase } from '@/services/scoreService';

interface ScoreSectionProps {
  socialMediaScores: SocialMediaScore[];
  clientId: string;
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ socialMediaScores, clientId }) => {
  // State
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedRationale, setSelectedRationale] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedScores, setEditedScores] = useState<SocialMediaScore[]>([]);
  const { toast } = useToast();

  // Format the data for the chart
  const chartData = socialMediaScores.map(item => ({
    name: item.platform,
    score: item.score,
    rationale: item.rationale
  }));

  // Sort data by score (highest to lowest)
  const sortedData = [...chartData].sort((a, b) => b.score - a.score);

  // Set the default platform and rationale when component mounts
  React.useEffect(() => {
    if (sortedData.length > 0 && !selectedPlatform) {
      const topPlatform = sortedData[0];
      setSelectedPlatform(topPlatform.name);
      setSelectedRationale(topPlatform.rationale || '');
    }
    
    // Initialize edited scores
    setEditedScores([...socialMediaScores]);
  }, [socialMediaScores]);

  // Handlers
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
  
  const handleSelectPlatform = (platform: string, rationale: string) => {
    setSelectedPlatform(platform);
    setSelectedRationale(rationale);
  };
  
  const saveScoresChanges = async () => {
    const result = await saveScoresToSupabase(clientId, editedScores);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Social media scores updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update social media scores.",
        variant: "destructive"
      });
    }
    
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 bg-white shadow-sm rounded-lg w-full">
      <div className="p-6">
        <SectionHeader
          title="Relevance Score"
          isEditing={isEditing}
          onEdit={startEditing}
          onSave={saveScoresChanges}
        />
        
        <div className="grid md:grid-cols-2 gap-6 w-full">
          <div className="w-full">
            {isEditing ? (
              <ScoreEditor
                scores={editedScores}
                onScoreChange={handleScoreChange}
                onSelectPlatform={handleSelectPlatform}
                selectedPlatform={selectedPlatform}
              />
            ) : (
              <ScoreBar data={sortedData} onBarClick={handleBarClick} />
            )}
          </div>
          
          <div className="h-full w-full">
            {selectedRationale && (
              <ScoreRationale
                platform={selectedPlatform}
                rationale={selectedRationale}
                isEditing={isEditing}
                onRationaleChange={handleRationaleChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
