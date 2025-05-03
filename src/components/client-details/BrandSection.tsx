
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save } from 'lucide-react';
import { MarkdownBox } from './MarkdownBox';

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
    <div className="space-y-6 p-6 rounded-lg bg-[#FFFFFF]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black relative pb-2">
          Brand
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
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-medium text-black">Brand Promise</h3>
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
          <h3 className="font-medium text-black">Brand Challenge</h3>
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
