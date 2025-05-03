
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { countryNames } from '@/utils/clientDataUtils';

interface ClientHeaderProps {
  name: string;
  country: string;
  domain: string;
  logo?: string;
  description: string;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  name,
  country,
  domain,
  logo,
  description
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Navigation */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 pb-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 bg-gray-100">
            {logo ? (
              <AvatarImage src={logo} alt={name} />
            ) : (
              <AvatarFallback className="text-gray-700 text-xl">
                {name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-black">{name}</h1>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-md text-black">{countryNames[country]}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-neo-red" />
              <a 
                href={`https://${domain}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neo-red hover:underline"
              >
                {domain}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="pb-6">
        <p className="text-black">{description}</p>
      </div>
    </>
  );
};
