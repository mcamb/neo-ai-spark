
import React from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { SectionHeader } from '@/components/client-details/SectionHeader';
import { Award, Target } from 'lucide-react';

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
    <div className="bg-[#FFFFFF] rounded-lg w-full">
      <div className="flex flex-col">
        <SectionHeader title="Brand Context" isEditing={false} onEdit={() => {}} onSave={() => {}} />
        
        <div className="px-6 pb-6">
          <div className="grid md:grid-cols-2 gap-6 w-full">
            {brand_promise && (
              <div className="space-y-2">
                <h3 className="font-medium text-black flex items-center text-base">
                  <Award className="h-4 w-4 mr-2 text-black" />
                  Brand Promise
                </h3>
                <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
                  {brand_promise}
                </MarkdownBox>
              </div>
            )}
            
            {brand_challenge && (
              <div className="space-y-2">
                <h3 className="font-medium text-black flex items-center text-base">
                  <Target className="h-4 w-4 mr-2 text-black" />
                  Brand Challenge
                </h3>
                <MarkdownBox style={{ backgroundColor: "#E8E5DE" }}>
                  {brand_challenge}
                </MarkdownBox>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
