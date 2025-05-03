
import React from 'react';

interface ClientsHeaderProps {
  title: string;
  description: string;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold relative pb-2">{title}</h1>
      <span className="absolute bottom-0 left-0 w-16 h-1 bg-neo-red"></span>
      <p className="mt-3 text-custom-text">{description}</p>
    </div>
  );
};

export default ClientsHeader;
