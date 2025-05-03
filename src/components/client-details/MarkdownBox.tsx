
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface MarkdownBoxProps {
  children: React.ReactNode;
  isEditing?: boolean;
  onEdit?: (value: string) => void;
  value?: string;
}

export const MarkdownBox: React.FC<MarkdownBoxProps> = ({ 
  children, 
  isEditing = false, 
  onEdit, 
  value 
}) => {
  if (isEditing && onEdit) {
    return (
      <Textarea 
        className="min-h-[120px] w-full border border-gray-300 rounded-lg focus:border-neo-red" 
        value={value} 
        onChange={(e) => onEdit(e.target.value)}
      />
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg prose prose-slate max-w-none text-black">
      {children}
    </div>
  );
};
