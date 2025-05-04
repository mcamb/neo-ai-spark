
import React from 'react';

interface CampaignsHeaderProps {
  title: string;
  description: string;
}

const CampaignsHeader: React.FC<CampaignsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold pb-2">{title}</h1>
      <p className="mt-3 text-custom-text">{description}</p>
    </div>
  );
};

export default CampaignsHeader;
