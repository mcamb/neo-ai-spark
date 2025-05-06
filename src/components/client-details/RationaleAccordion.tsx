
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MarkdownBox } from './MarkdownBox';

interface SocialMediaScore {
  platform: string;
  score: number;
  rationale: string;
}

interface RationaleAccordionProps {
  socialMediaScores: SocialMediaScore[];
}

export const RationaleAccordion: React.FC<RationaleAccordionProps> = ({ socialMediaScores }) => {
  return (
    <div className="space-y-6 p-6 rounded-lg w-full">
      <div className="flex items-center justify-between mb-2 w-full">
        <h2 className="text-xl font-semibold text-black">Relevance Score Rationale</h2>
      </div>
      
      <Accordion type="single" defaultValue="item-0" collapsible className="w-full">
        {socialMediaScores.sort((a, b) => b.score - a.score).map((item, index) => (
          <AccordionItem key={item.platform} value={`item-${index}`} className="border-b border-gray-200">
            <AccordionTrigger className="hover:no-underline text-black">
              <span className="font-medium">{item.platform} ({item.score})</span>
            </AccordionTrigger>
            <AccordionContent>
              <MarkdownBox>
                {item.rationale}
              </MarkdownBox>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
