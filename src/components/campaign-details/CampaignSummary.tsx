
import React from 'react';
import { Users, Target, Radio, Activity } from 'lucide-react';

interface CampaignSummaryProps {
  targetAudience?: string;
  objective?: string;
  channel?: string;
  status?: string;
}

export const CampaignSummary: React.FC<CampaignSummaryProps> = ({
  targetAudience,
  objective,
  channel,
  status
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-600">Target Audience</h3>
        </div>
        <p className="text-base">{targetAudience || "Not specified"}</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-600">Objective</h3>
        </div>
        <p className="text-base">{objective || "Not specified"}</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-600">Channel</h3>
        </div>
        <p className="text-base">{channel || "Not specified"}</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-600">Status</h3>
        </div>
        <p className="text-base">{status || "Not specified"}</p>
      </div>
    </div>
  );
};
