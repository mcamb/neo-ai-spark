
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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
  const [equalHeight, setEqualHeight] = useState<number | null>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  // Calculate equal heights for Primary and Secondary boxes
  useEffect(() => {
    const adjustHeights = () => {
      if (primaryRef.current && secondaryRef.current) {
        const primaryHeight = primaryRef.current.scrollHeight;
        const secondaryHeight = secondaryRef.current.scrollHeight;
        const maxHeight = Math.max(primaryHeight, secondaryHeight);
        setEqualHeight(maxHeight);
      }
    };

    // Initial calculation
    adjustHeights();
    
    // Recalculate on window resize
    window.addEventListener('resize', adjustHeights);
    return () => window.removeEventListener('resize', adjustHeights);
  }, [audienceType, isEditing, targetAudience]);

  return (
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black relative pb-2">
          Target Audience
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#FF4B4F]"></span>
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={isEditing ? onSaveEdits : onStartEditing}
          className="text-[#FF4B4F] hover:text-[#FF4B4F] hover:bg-[#FF4B4F]/10"
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
      
      {/* Toggle between B2C and B2B using Switch with more spacing */}
      <div className="flex items-center space-x-2 mb-8">
        <span className={`font-medium ${audienceType === 'b2c' ? 'text-black' : 'text-gray-400'}`}>B2C</span>
        <Switch 
          checked={audienceType === 'b2b'}
          onCheckedChange={(checked) => onSetAudienceType(checked ? 'b2b' : 'b2c')}
          className="data-[state=checked]:bg-[#FF4B4F]"
        />
        <span className={`font-medium ${audienceType === 'b2b' ? 'text-black' : 'text-gray-400'}`}>B2B</span>
      </div>
      
      {/* Show selected audience type */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-black">Primary</h4>
          <div ref={primaryRef}>
            <MarkdownBox
              isEditing={isEditing}
              onEdit={(value) => onEditTargetAudience(audienceType, 'primary', value)}
              value={editedTargetAudience[audienceType].primary}
              style={{
                minHeight: equalHeight && !isEditing ? `${equalHeight}px` : undefined,
                backgroundColor: isEditing ? "white" : "#E8E5DE"
              }}
            >
              {isEditing 
                ? editedTargetAudience[audienceType].primary 
                : targetAudience[audienceType].primary}
            </MarkdownBox>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-black">Secondary</h4>
          <div ref={secondaryRef}>
            <MarkdownBox
              isEditing={isEditing}
              onEdit={(value) => onEditTargetAudience(audienceType, 'secondary', value)}
              value={editedTargetAudience[audienceType].secondary}
              style={{
                minHeight: equalHeight && !isEditing ? `${equalHeight}px` : undefined,
                backgroundColor: isEditing ? "white" : "#E8E5DE"
              }}
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
