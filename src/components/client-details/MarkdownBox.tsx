
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
  darkMode?: boolean;
}

export const MarkdownBox: React.FC<MarkdownBoxProps> = ({ 
  children, 
  isEditing = false, 
  onEdit, 
  value,
  style,
  className,
  darkMode = false
}) => {
  if (isEditing && onEdit) {
    return (
      <div className="relative h-full">
        <Textarea 
          className={`min-h-[120px] w-full h-full border border-gray-300 rounded-lg focus:border-[#FF4B4F] bg-white text-black text-left ${className || ''}`}
          value={value} 
          onChange={(e) => onEdit(e.target.value)}
          style={{...style, backgroundColor: "#FFFFFF", height: '100%', textAlign: 'left'}}
        />
        <div className="text-xs text-black mt-2">
          Supports Markdown: **bold**, *italic*, - bullets, 1. numbered lists
        </div>
      </div>
    );
  }

  const boxStyle = darkMode && !isEditing
    ? { 
        backgroundColor: "#363636",
        color: "#000000",
        textAlign: 'left',
        ...style
      }
    : {
        textAlign: 'left',
        ...style
      };

  const boxClassName = `p-5 border border-gray-200 rounded-lg prose max-w-none text-left ${darkMode && !isEditing ? 'prose-invert bg-[#363636] text-black' : 'bg-white prose-black'} ${className || ''}`;

  return (
    <div 
      className={boxClassName}
      style={boxStyle}
    >
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="font-bold text-black text-left" {...props} />,
          h2: ({node, ...props}) => <h2 className="font-bold text-black text-left" {...props} />,
          h3: ({node, ...props}) => <h3 className="font-bold text-black text-left" {...props} />,
          h4: ({node, ...props}) => <h4 className="font-bold text-black text-left" {...props} />,
          h5: ({node, ...props}) => <h5 className="font-bold text-black text-left" {...props} />,
          h6: ({node, ...props}) => <h6 className="font-bold text-black text-left" {...props} />,
          p: ({node, ...props}) => <p className="text-black text-left" {...props} />,
          ul: ({node, ...props}) => <ul className="text-black list-disc pl-6 text-left" {...props} />,
          ol: ({node, ...props}) => <ol className="text-black list-decimal pl-6 text-left" {...props} />,
          li: ({node, ...props}) => <li className="text-black text-left" {...props} />,
          strong: ({node, ...props}) => <strong className="text-black font-bold text-left" {...props} />,
          em: ({node, ...props}) => <em className="text-black italic text-left" {...props} />
        }}
      >
        {typeof children === 'string' ? children : ''}
      </ReactMarkdown>
    </div>
  );
};
