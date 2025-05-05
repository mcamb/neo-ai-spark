
import React from 'react';
import { Users, Target, Radio, Activity } from 'lucide-react';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';

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
  // Properly cast the status to match CampaignStatusBadge's expected types
  const normalizedStatus = status as 'active' | 'draft' | 'completed' | 'Idea' | 'Planned' | 'Running' | 'Finished';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-[#FF4B4F]" />
          <h3 className="text-sm font-normal text-[#363636]">Target Audience</h3>
        </div>
        <p className="text-base font-bold">{targetAudience || "Not specified"}</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-[#FF4B4F]" />
          <h3 className="text-sm font-normal text-[#363636]">Objective</h3>
        </div>
        <p className="text-base font-bold">{objective || "Not specified"}</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-5 w-5 text-[#FF4B4F]" />
          <h3 className="text-sm font-normal text-[#363636]">Channel</h3>
        </div>
        <p className="text-base font-bold">{channel || "Not specified"}</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-[#FF4B4F]" />
          <h3 className="text-sm font-normal text-[#363636]">Status</h3>
        </div>
        <div>
          {status && <CampaignStatusBadge status={normalizedStatus} />}
        </div>
      </div>
    </div>
  );
};
