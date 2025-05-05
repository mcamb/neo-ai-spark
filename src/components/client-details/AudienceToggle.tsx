
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface AudienceToggleProps {
  audienceType: 'b2c' | 'b2b';
  onSetAudienceType: (value: 'b2c' | 'b2b') => void;
}

export const AudienceToggle: React.FC<AudienceToggleProps> = ({
  audienceType,
  onSetAudienceType
}) => {
  return (
    <div className="flex items-center space-x-2 mb-8">
      <span className={`font-medium ${audienceType === 'b2c' ? 'text-black' : 'text-gray-400'}`}>B2C</span>
      <Switch 
        checked={audienceType === 'b2b'}
        onCheckedChange={(checked) => onSetAudienceType(checked ? 'b2b' : 'b2c')}
        className="data-[state=checked]:bg-[#FF4B4F]"
      />
      <span className={`font-medium ${audienceType === 'b2b' ? 'text-black' : 'text-gray-400'}`}>B2B</span>
    </div>
  );
};
