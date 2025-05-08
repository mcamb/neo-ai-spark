
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownBox } from './MarkdownBox';
import { Star, Users } from 'lucide-react';
import { TargetAudience } from '@/models/clientDetails';

interface AudienceContentProps {
  audienceType: 'b2c' | 'b2b';
  isEditing: boolean;
  targetAudience: TargetAudience;
  editedTargetAudience: TargetAudience;
  onEditTargetAudience: (audienceType: 'b2c' | 'b2b', field: 'primary' | 'secondary', value: string) => void;
}

export const AudienceContent: React.FC<AudienceContentProps> = ({
  audienceType,
  isEditing,
  targetAudience,
  editedTargetAudience,
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
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <h4 className="text-base font-medium text-black flex items-center">
          <Star className="h-4 w-4 mr-2 text-black" />
          Primary
        </h4>
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
        <h4 className="text-base font-medium text-black flex items-center">
          <Users className="h-4 w-4 mr-2 text-black" />
          Secondary
        </h4>
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
  );
};
