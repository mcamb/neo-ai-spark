
import React, { useState, useEffect } from 'react';
import { ScoreBar } from './ScoreBar';
import { MarkdownBox } from './MarkdownBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <h2 className="text-xl font-semibold text-black relative pb-2 mb-4">
          Relevance Score
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#FF4B4F]"></span>
        </h2>
        
        <Tabs defaultValue="score" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="score" className="text-[#000000]">Score Overview</TabsTrigger>
            <TabsTrigger value="details" className="text-[#000000]">All Platforms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="score" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ScoreBar data={sortedData} onBarClick={handleBarClick} />
              </div>
              <div>
                {selectedRationale && (
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">{selectedPlatform} Rationale</h3>
                    <MarkdownBox style={{ backgroundColor: "#E8E5DE", minHeight: "300px" }}>
                      {selectedRationale}
                    </MarkdownBox>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              {sortedData.map((platform) => (
                <div key={platform.name} className="p-3 border rounded bg-[#E8E5DE] cursor-pointer hover:bg-opacity-80" 
                     onClick={() => handleBarClick(platform.name, platform.rationale || '')}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black">{platform.name}</span>
                    <span className={`px-3 py-1 rounded text-white ${platform.score > 70 ? 'bg-[#94C29D]' : platform.score > 50 ? 'bg-[#FF4B4F]' : 'bg-gray-400'}`}>
                      {platform.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
