
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Award, Target } from 'lucide-react';
import { MarkdownBox } from './MarkdownBox';
import { SectionHeader } from './SectionHeader';

interface BrandSectionProps {
  isEditing: boolean;
  brandPromise: string;
  brandChallenge: string;
  editedBrandPromise: string;
  editedBrandChallenge: string;
  onStartEditing: () => void;
  onSaveEdits: () => void;
  onEditBrandPromise: (value: string) => void;
  onEditBrandChallenge: (value: string) => void;
}

export const BrandSection: React.FC<BrandSectionProps> = ({
  isEditing,
  brandPromise,
  brandChallenge,
  editedBrandPromise,
  editedBrandChallenge,
  onStartEditing,
  onSaveEdits,
  onEditBrandPromise,
  onEditBrandChallenge
}) => {
  return (
    <div className="w-full bg-[#FFFFFF] rounded-lg">
      <SectionHeader
        title="Brand"
        isEditing={isEditing}
        onEdit={onStartEditing}
        onSave={onSaveEdits}
      />
      
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <div className="space-y-2">
          <h3 className="font-medium text-black flex items-center text-base">
            <Award className="h-4 w-4 mr-2 text-black" />
            Brand Promise
          </h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={onEditBrandPromise}
            value={editedBrandPromise}
            style={{ backgroundColor: isEditing ? "white" : "#E8E5DE" }}
          >
            {isEditing ? editedBrandPromise : brandPromise}
          </MarkdownBox>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-black flex items-center text-base">
            <Target className="h-4 w-4 mr-2 text-black" />
            Brand Challenge
          </h3>
          <MarkdownBox
            isEditing={isEditing}
            onEdit={onEditBrandChallenge}
            value={editedBrandChallenge}
            style={{ backgroundColor: isEditing ? "white" : "#E8E5DE" }}
          >
            {isEditing ? editedBrandChallenge : brandChallenge}
          </MarkdownBox>
        </div>
      </div>
    </div>
  );
};
