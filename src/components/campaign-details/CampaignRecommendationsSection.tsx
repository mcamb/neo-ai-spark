
import React, { useState } from 'react';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';
import { FileText, Palette, Users, Target, MessageCircle, Video } from 'lucide-react';
import { SectionHeader } from '@/components/client-details/SectionHeader';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CampaignRecommendationsSectionProps {
  campaignId: string;
  tone_style?: string;
  formats?: string;
  targeting?: string;
  creators_influencers?: string;
  message_hook?: string;
}

export const CampaignRecommendationsSection: React.FC<CampaignRecommendationsSectionProps> = ({
  campaignId,
  tone_style,
  formats,
  targeting,
  creators_influencers,
  message_hook,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    tone_style: tone_style || '',
    formats: formats || '',
    targeting: targeting || '',
    creators_influencers: creators_influencers || '',
    message_hook: message_hook || '',
  });

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedValues({
      tone_style: tone_style || '',
      formats: formats || '',
      targeting: targeting || '',
      creators_influencers: creators_influencers || '',
      message_hook: message_hook || '',
    });
  };

  const handleSaveEdits = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          tone_style: editedValues.tone_style,
          formats: editedValues.formats,
          targeting: editedValues.targeting,
          creators_influencers: editedValues.creators_influencers,
          message_hook: editedValues.message_hook,
        })
        .eq('id', campaignId);

      if (error) throw error;
      
      toast.success('Recommendations updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating recommendations:', error);
      toast.error('Failed to update recommendations');
    }
  };

  const handleEdit = (field: keyof typeof editedValues, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Common style for all markdown boxes to maintain consistent height
  const boxStyle = {
    backgroundColor: isEditing ? "#FFFFFF" : "#E8E5DE",
    minHeight: "230px"
  };

  return (
    <div className="space-y-12 p-8 rounded-lg bg-[#FFFFFF]">
      <SectionHeader
        title="Recommendations"
        isEditing={isEditing}
        onEdit={handleStartEditing}
        onSave={handleSaveEdits}
      />
      
      {/* First row - Message Hook & Tone Style */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <MessageCircle className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            Message Hook
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('message_hook', value)}
            value={editedValues.message_hook}
            style={boxStyle}
            className="h-full"
          >
            {message_hook || "No message hook defined for this campaign."}
          </MarkdownBox>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Palette className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            Tone & Style
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('tone_style', value)}
            value={editedValues.tone_style}
            style={boxStyle}
            className="h-full"
            darkMode={true}
          >
            {tone_style || "No tone and style recommendations available."}
          </MarkdownBox>
        </div>
      </div>
      
      {/* Second row - Formats & Targeting with significant vertical spacing */}
      <div className="grid md:grid-cols-2 gap-12 pt-6">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            Formats
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('formats', value)}
            value={editedValues.formats}
            style={boxStyle}
            className="h-full"
            darkMode={true}
          >
            {formats || "No format recommendations available."}
          </MarkdownBox>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Target className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            Targeting
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('targeting', value)}
            value={editedValues.targeting}
            style={boxStyle}
            className="h-full"
          >
            {targeting || "No targeting information available."}
          </MarkdownBox>
        </div>
      </div>
      
      {/* Third row - Creators & Video with significant vertical spacing */}
      <div className="grid md:grid-cols-2 gap-12 pt-6">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Users className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            Creators / Influencers
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('creators_influencers', value)}
            value={editedValues.creators_influencers}
            style={boxStyle}
            className="h-full"
            darkMode={true}
          >
            {creators_influencers || "No creator or influencer recommendations available."}
          </MarkdownBox>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Video className="h-4 w-4 mr-2 text-[#FF4B4F]" />
            #1 Creator Video
          </h3>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-[230px]">
            <Video className="h-20 w-20 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
