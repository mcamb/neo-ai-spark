
import React, { useState, useEffect } from 'react';
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
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedRationale, setSelectedRationale] = useState<string>('');

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
  }, [socialMediaScores]);

  const handleBarClick = (platform: string, rationale: string) => {
    setSelectedPlatform(platform);
    setSelectedRationale(rationale);
  };

  return (
    <div className="space-y-6 bg-white shadow-sm rounded-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-black">Relevance Score</h2>
        <ScoreChart data={chartData} onBarClick={handleBarClick} />
      </div>
      
      {selectedRationale && (
        <div className="p-6 pt-0">
          <h3 className="text-lg font-medium text-black mb-2">{selectedPlatform} Rationale</h3>
          <MarkdownBox>
            {selectedRationale}
          </MarkdownBox>
        </div>
      )}
    </div>
  );
};
