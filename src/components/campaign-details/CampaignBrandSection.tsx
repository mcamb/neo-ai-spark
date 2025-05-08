
import React from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';

interface CampaignBrandSectionProps {
  brand_promise?: string;
  brand_challenge?: string;
}

export const CampaignBrandSection: React.FC<CampaignBrandSectionProps> = ({
  brand_promise,
  brand_challenge,
}) => {
  if (!brand_promise && !brand_challenge) return null;
  
  return (
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black relative pb-2">
          Brand Context
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#FF4B4F]"></span>
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {brand_promise && (
          <div className="space-y-2">
            <h3 className="font-medium text-black">Brand Promise</h3>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {brand_promise}
            </MarkdownBox>
          </div>
        )}
        
        {brand_challenge && (
          <div className="space-y-2">
            <h3 className="font-medium text-black">Brand Challenge</h3>
            <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
              {brand_challenge}
            </MarkdownBox>
          </div>
        )}
      </div>
    </div>
  );
};
