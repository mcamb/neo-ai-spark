
import React from 'react';
import { MarkdownBox } from './MarkdownBox';
import { FileText } from 'lucide-react';

interface ScoreRationaleProps {
  platform: string;
  rationale: string;
  isEditing: boolean;
  onRationaleChange: (value: string) => void;
}

export const ScoreRationale: React.FC<ScoreRationaleProps> = ({
  platform,
  rationale,
  isEditing,
  onRationaleChange
}) => {
  if (!rationale) return null;
  
  return (
    <div className="h-full">
      <h3 className="text-base font-medium text-black mb-2 flex items-center">
        <FileText className="h-4 w-4 mr-2 text-black" />
        {platform} Rationale
      </h3>
      <MarkdownBox 
        isEditing={isEditing}
        onEdit={onRationaleChange}
        value={rationale}
        style={{ backgroundColor: isEditing ? "white" : "#E8E5DE", height: "100%", minHeight: "300px" }}
      >
        {rationale}
      </MarkdownBox>
    </div>
  );
};
