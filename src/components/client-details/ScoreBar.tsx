
import React from 'react';

interface ScoreItem {
  name: string;
  score: number;
  rationale?: string;
}

interface ScoreBarProps {
  data: ScoreItem[];
  onBarClick: (platform: string, rationale: string) => void;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ data, onBarClick }) => {
  // Bar colors based on score
  const getBarColor = (score: number) => {
    if (score > 50) return '#94C29D'; // Green for scores above 50
    return '#ea384c';                 // Red for scores 50 and below
  };
  
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div 
          key={item.name} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => item.rationale && onBarClick(item.name, item.rationale)}
        >
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-black">{item.name}</span>
            <span className="text-sm font-medium text-black">{item.score}/100</span>
          </div>
          <div className="w-full h-6 bg-gray-200 rounded-sm overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out" 
              style={{ 
                width: `${item.score}%`, 
                backgroundColor: getBarColor(item.score)
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
