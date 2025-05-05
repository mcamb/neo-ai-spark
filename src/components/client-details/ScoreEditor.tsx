
import React from 'react';

interface ScoreItem {
  platform: string;
  score: number;
  rationale: string;
}

interface ScoreEditorProps {
  scores: ScoreItem[];
  onScoreChange: (platform: string, newScore: number) => void;
  onSelectPlatform: (platform: string, rationale: string) => void;
  selectedPlatform: string;
}

export const ScoreEditor: React.FC<ScoreEditorProps> = ({ 
  scores, 
  onScoreChange, 
  onSelectPlatform,
  selectedPlatform
}) => {
  return (
    <div className="space-y-3">
      {scores.map((item) => (
        <div key={item.platform} className="space-y-2">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-black">{item.platform}</span>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={item.score}
                onChange={(e) => onScoreChange(item.platform, parseInt(e.target.value) || 0)}
                className="w-16 text-right border border-gray-300 rounded px-2 py-1"
              />
              <span className="ml-2 text-sm font-medium text-black">/100</span>
            </div>
          </div>
          <div 
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onSelectPlatform(item.platform, item.rationale)}
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
  );
};
