
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
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <SectionHeader
        title="Audience Snapshot"
        isEditing={isEditing}
        onEdit={handleStartEditing}
        onSave={handleSaveEdits}
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-md font-semibold mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            People we talk to
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={setEditedAudienceSummary}
            value={editedAudienceSummary}
            style={{ backgroundColor: "#E8E5DE" }}
          >
            {targetAudienceSummary || "No audience information available."}
          </MarkdownBox>
        </div>
        
        <div>
          <h3 className="text-md font-semibold mb-3">Typically look like this.</h3>
          <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
            <User className="h-20 w-20 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
