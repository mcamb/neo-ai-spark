
import React from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Palette } from 'lucide-react';

interface CampaignRecommendationsSectionProps {
  tone_style?: string;
  formats?: string;
  creators_influencers?: string;
}

export const CampaignRecommendationsSection: React.FC<CampaignRecommendationsSectionProps> = ({
  tone_style,
  formats,
  creators_influencers,
}) => {
  return (
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black relative pb-2">
          Recommendations
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#FF4B4F]"></span>
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Palette className="w-4 h-4 mr-2" /> Tone & Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {tone_style || "No tone and style recommendations available."}
            </MarkdownBox>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {formats || "No format recommendations available."}
            </MarkdownBox>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Users className="w-4 h-4 mr-2" /> Creators/Influencers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {creators_influencers || "No creator or influencer recommendations available."}
            </MarkdownBox>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
