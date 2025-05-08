
import React from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, MessageCircle, Users } from 'lucide-react';

interface CampaignInfoSectionProps {
  target_audience?: string;
  targeting?: string;
  message_hook?: string;
}

export const CampaignInfoSection: React.FC<CampaignInfoSectionProps> = ({
  target_audience,
  targeting,
  message_hook,
}) => {
  return (
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black relative pb-2">
          Campaign Information
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#FF4B4F]"></span>
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Users className="w-4 h-4 mr-2" /> Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {target_audience || "No target audience information available."}
            </MarkdownBox>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <BarChart2 className="w-4 h-4 mr-2" /> Targeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {targeting || "No targeting information available."}
            </MarkdownBox>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" /> Message Hook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
            {message_hook || "No message hook defined for this campaign."}
          </MarkdownBox>
        </CardContent>
      </Card>
    </div>
  );
};
