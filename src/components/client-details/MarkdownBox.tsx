
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from 'react-markdown';

interface MarkdownBoxProps {
  children: React.ReactNode;
  isEditing?: boolean;
  onEdit?: (value: string) => void;
  value?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const MarkdownBox: React.FC<MarkdownBoxProps> = ({ 
  children, 
  isEditing = false, 
  onEdit, 
  value,
  style,
  className
}) => {
  if (isEditing && onEdit) {
    return (
      <div className="relative h-full">
        <Textarea 
          className={`min-h-[120px] w-full h-full border border-gray-300 rounded-lg focus:border-[#FF4B4F] bg-white text-black ${className || ''}`}
          value={value} 
          onChange={(e) => onEdit(e.target.value)}
          style={{...style, backgroundColor: "#FFFFFF", height: '100%'}}
        />
        <div className="text-xs text-black mt-2">
          Supports Markdown: **bold**, *italic*, - bullets, 1. numbered lists
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`p-5 bg-white border border-gray-200 rounded-lg prose prose-black max-w-none ${className || ''}`} 
      style={style}
    >
      <ReactMarkdown>
        {typeof children === 'string' ? children : ''}
      </ReactMarkdown>
    </div>
  );
};
