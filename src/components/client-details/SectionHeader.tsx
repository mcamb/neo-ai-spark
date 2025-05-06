
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isEditing,
  onEdit,
  onSave
}) => {
  return (
    <div className="flex items-center justify-between mb-6 w-full">
      <h2 className="text-xl font-semibold text-black relative pb-2">
        {title}
        <span className="absolute bottom-0 left-0 h-1 bg-[#FF4B4F]" style={{ width: '100%' }}></span>
      </h2>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={isEditing ? onSave : onEdit}
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
  );
};
