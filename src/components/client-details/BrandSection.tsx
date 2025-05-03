
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
    <div className="space-y-6 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">Brand</h2>
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
        <div className="space-y-2">
          <h3 className="font-medium text-black">Brand Promise</h3>
          <MarkdownBox 
            isEditing={isEditing}
            onEdit={onEditBrandPromise}
            value={editedBrandPromise}
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
          >
            {isEditing ? editedBrandChallenge : brandChallenge}
          </MarkdownBox>
        </div>
      </div>
    </div>
  );
};
