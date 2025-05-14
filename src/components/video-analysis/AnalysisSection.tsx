
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarkdownBox } from '@/components/client-details/MarkdownBox';

interface AnalysisSectionProps {
  title: string;
  content: string | undefined | null;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, content }) => {
  if (!content) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <MarkdownBox>{content}</MarkdownBox>
      </CardContent>
    </Card>
  );
};

export default AnalysisSection;
