
import React from 'react';
import { TargetAudience } from '@/models/clientDetails';
import { SectionHeader } from './SectionHeader';
import { AudienceToggle } from './AudienceToggle';
import { AudienceContent } from './AudienceContent';

interface AudienceSectionProps {
  isEditing: boolean;
  audienceType: 'b2c' | 'b2b';
  targetAudience: TargetAudience;
  editedTargetAudience: TargetAudience;
  onSetAudienceType: (value: 'b2c' | 'b2b') => void;
  onStartEditing: () => void;
  onSaveEdits: () => void;
  onEditTargetAudience: (audienceType: 'b2c' | 'b2b', field: 'primary' | 'secondary', value: string) => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  isEditing,
  audienceType,
  targetAudience,
  editedTargetAudience,
  onSetAudienceType,
  onStartEditing,
  onSaveEdits,
  onEditTargetAudience
}) => {
  return (
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <SectionHeader
        title="Target Audience"
        isEditing={isEditing}
        onEdit={onStartEditing}
        onSave={onSaveEdits}
      />
      
      <AudienceToggle 
        audienceType={audienceType}
        onSetAudienceType={onSetAudienceType}
      />
      
      <AudienceContent
        audienceType={audienceType}
        isEditing={isEditing}
        targetAudience={targetAudience}
        editedTargetAudience={editedTargetAudience}
        onEditTargetAudience={onEditTargetAudience}
      />
    </div>
  );
};
