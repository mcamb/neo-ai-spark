
import React from 'react';

interface ClientsHeaderProps {
  title: string;
  description: string;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold pb-2">{title}</h1>
      <p className="mt-3 text-custom-text">{description}</p>
    </div>
  );
};

export default ClientsHeader;
