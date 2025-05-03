
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save } from 'lucide-react';
import { ScoreChart } from './ScoreChart';
import { MarkdownBox } from './MarkdownBox';

interface SocialMediaScore {
  platform: string;
  score: number;
  rationale: string;
}

interface ScoreSectionProps {
  socialMediaScores: SocialMediaScore[];
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ socialMediaScores }) => {
  const [selectedScore, setSelectedScore] = useState<SocialMediaScore | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRationale, setEditedRationale] = useState('');

  // Format the data for the chart
  const chartData = socialMediaScores.map(item => ({
    name: item.platform,
    score: item.score,
    rationale: item.rationale
  }));

  // Set the highest scoring platform as default selected
  useEffect(() => {
    if (socialMediaScores.length > 0 && !selectedScore) {
      const highestScore = [...socialMediaScores].sort((a, b) => b.score - a.score)[0];
      setSelectedScore(highestScore);
      setEditedRationale(highestScore.rationale);
    }
  }, [socialMediaScores, selectedScore]);

  const handleBarClick = (item: any) => {
    const clicked = socialMediaScores.find(score => score.platform === item.name);
    if (clicked) {
      setSelectedScore(clicked);
      setEditedRationale(clicked.rationale);
    }
  };

  const startEditing = () => {
    if (selectedScore) {
      setEditedRationale(selectedScore.rationale);
      setIsEditing(true);
    }
  };

  const saveEdits = () => {
    // In a real app, you would save these changes to your backend
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">Relevance Score</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={isEditing ? saveEdits : startEditing}
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
      
      <ScoreChart data={chartData} onBarClick={handleBarClick} />
      
      {selectedScore && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-black mb-2">{selectedScore.platform} Rationale</h3>
          <MarkdownBox
            isEditing={isEditing}
            onEdit={setEditedRationale}
            value={editedRationale}
          >
            {isEditing ? editedRationale : selectedScore.rationale}
          </MarkdownBox>
        </div>
      )}
    </div>
  );
};
