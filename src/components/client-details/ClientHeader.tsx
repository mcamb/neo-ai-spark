
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

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
    <div className="w-full">
      {/* Navigation */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate('/clients')} className="pl-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 pb-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            {logo ? (
              <AvatarImage 
                src={logo} 
                alt={name}
                className="object-cover"
                style={{
                  objectFit: logo.includes('kitkat') ? 'contain' : 'cover',
                  padding: logo.includes('kitkat') ? '2px' : '0',
                }}
              />
            ) : (
              <AvatarFallback className="text-gray-700 text-xl">
                {name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-black">{name}</h1>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-md text-black">{country}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-neo-red" />
              <a 
                href={domain.startsWith('http') ? domain : `https://${domain}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neo-red hover:underline flex items-center"
              >
                {domain}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="pb-6">
        <p className="text-black">{description}</p>
      </div>
    </div>
  );
};
