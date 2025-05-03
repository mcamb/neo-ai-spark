
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from 'react-markdown';

interface MarkdownBoxProps {
  children: React.ReactNode;
  isEditing?: boolean;
  onEdit?: (value: string) => void;
  value?: string;
  style?: React.CSSProperties;
}

export const MarkdownBox: React.FC<MarkdownBoxProps> = ({ 
  children, 
  isEditing = false, 
  onEdit, 
  value,
  style 
}) => {
  if (isEditing && onEdit) {
    return (
      <div className="relative">
        <Textarea 
          className="min-h-[120px] w-full border border-gray-300 rounded-lg focus:border-neo-red text-black" 
          value={value} 
          onChange={(e) => onEdit(e.target.value)}
          style={style}
        />
        <div className="text-xs text-black mt-1">
          Supports Markdown: **bold**, *italic*, - bullets, 1. numbered lists
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg prose prose-black max-w-none" style={style}>
      <ReactMarkdown>
        {typeof children === 'string' ? children : ''}
      </ReactMarkdown>
    </div>
  );
};
