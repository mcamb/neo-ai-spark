
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MarkdownBox } from './MarkdownBox';

interface TargetAudience {
  b2c: {
    primary: string;
    secondary: string;
  };
  b2b: {
    primary: string;
    secondary: string;
  };
}

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
    <div className="space-y-6 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">Target Audience</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={isEditing ? onSaveEdits : onStartEditing}
        >
          {isEditing ? (
            <>
              <Save className="h-3.5 w-3.5 mr-2" />
              Save
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Toggle between B2C and B2B */}
        <RadioGroup 
          value={audienceType} 
          onValueChange={(value) => onSetAudienceType(value as 'b2c' | 'b2b')}
          className="flex space-x-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="b2c" id="b2c" />
            <label htmlFor="b2c" className="cursor-pointer font-medium text-black">B2C</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="b2b" id="b2b" />
            <label htmlFor="b2b" className="cursor-pointer font-medium text-black">B2B</label>
          </div>
        </RadioGroup>
        
        {/* Show selected audience type */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-black">Primary</h4>
            <MarkdownBox
              isEditing={isEditing}
              onEdit={(value) => onEditTargetAudience(audienceType, 'primary', value)}
              value={editedTargetAudience[audienceType].primary}
            >
              {isEditing 
                ? editedTargetAudience[audienceType].primary 
                : targetAudience[audienceType].primary}
            </MarkdownBox>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-black">Secondary</h4>
            <MarkdownBox
              isEditing={isEditing}
              onEdit={(value) => onEditTargetAudience(audienceType, 'secondary', value)}
              value={editedTargetAudience[audienceType].secondary}
            >
              {isEditing 
                ? editedTargetAudience[audienceType].secondary 
                : targetAudience[audienceType].secondary}
            </MarkdownBox>
          </div>
        </div>
      </div>
    </div>
  );
};
