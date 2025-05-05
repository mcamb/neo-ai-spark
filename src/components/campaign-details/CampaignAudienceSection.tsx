
import React, { useState } from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { SectionHeader } from '@/components/client-details/SectionHeader';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';

interface CampaignAudienceSectionProps {
  campaignId: string;
  targetAudienceSummary?: string;
}

export const CampaignAudienceSection: React.FC<CampaignAudienceSectionProps> = ({
  campaignId,
  targetAudienceSummary
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
    <div className="space-y-8 p-8 rounded-lg bg-[#FFFFFF]">
      <SectionHeader
        title="Audience Snapshot"
        isEditing={isEditing}
        onEdit={handleStartEditing}
        onSave={handleSaveEdits}
      />
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <User className="h-4 w-4 mr-2 text-[#FF4B4F]" />
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
            <User className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            Typically look like this.
          </h3>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-[230px]">
            <User className="h-20 w-20 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

