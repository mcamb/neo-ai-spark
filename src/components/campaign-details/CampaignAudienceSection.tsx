
import React, { useState } from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { SectionHeader } from '@/components/client-details/SectionHeader';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Image } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CampaignAudienceSectionProps {
  campaignId: string;
  targetAudienceSummary?: string;
  heroImageUrl?: string;
}

export const CampaignAudienceSection: React.FC<CampaignAudienceSectionProps> = ({
  campaignId,
  targetAudienceSummary,
  heroImageUrl
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAudienceSummary, setEditedAudienceSummary] = useState(targetAudienceSummary || '');

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedAudienceSummary(targetAudienceSummary || '');
  };

  const handleSaveEdits = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ target_audience_summary: editedAudienceSummary })
        .eq('id', campaignId);

      if (error) throw error;
      
      toast.success('Audience information updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating audience information:', error);
      toast.error('Failed to update audience information');
    }
  };

  return (
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF] w-full">
      <div className="mb-4">
        <h2 className="section-title">Audience Snapshot</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <User className="h-4 w-4 mr-2 text-black" />
            People we talk to
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={setEditedAudienceSummary}
            value={editedAudienceSummary}
            style={{ backgroundColor: isEditing ? "#FFFFFF" : "#E8E5DE", minHeight: "230px" }}
            className="h-full"
          >
            {targetAudienceSummary || "No audience information available."}
          </MarkdownBox>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Image className="h-4 w-4 mr-2 text-black" />
            Images they respond to
          </h3>
          <div className="bg-gray-100 rounded-lg overflow-hidden w-full h-auto">
            <AspectRatio ratio={4/3}>
              {heroImageUrl ? (
                <img 
                  src={heroImageUrl} 
                  alt="Target audience" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                    target.className = "p-8 object-contain w-full h-full";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Image className="h-20 w-20 text-gray-400" />
                </div>
              )}
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  );
};
