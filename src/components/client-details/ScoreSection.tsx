
import React from 'react';
import { ScoreChart } from './ScoreChart';

interface SocialMediaScore {
  platform: string;
  score: number;
  rationale: string;
}

interface ScoreSectionProps {
  socialMediaScores: SocialMediaScore[];
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ socialMediaScores }) => {
  // Format the data for the chart
  const chartData = socialMediaScores.map(item => ({
    name: item.platform,
    score: item.score,
    rationale: item.rationale
  }));

  return (
    <div className="space-y-6 bg-white shadow-sm rounded-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-black">Relevance Score</h2>
        <ScoreChart data={chartData} />
      </div>
    </div>
  );
};
