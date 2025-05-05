
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ClientStatusBadge from '../clients/ClientStatusBadge';

export interface Campaign {
  id: string;
  title: string;
  clientName: string;
  country: string;
  status: 'active' | 'draft' | 'completed' | 'Idea' | 'Planned' | 'Running' | 'Finished';
  logo?: string;
  agent_status?: string;
  created_at?: string; // Making this optional
}

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDelete, onEdit }) => {
  const isDisabled = campaign.agent_status === 'in_progress';
  
  return (
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="flex items-center flex-1">
            <Avatar className="w-10 h-10 flex-shrink-0">
              {campaign.logo ? (
                <AvatarImage 
                  src={campaign.logo} 
                  alt={campaign.clientName}
                  className="object-cover"
                  style={{
                    objectFit: campaign.logo.includes('kitkat') ? 'contain' : 'cover',
                    padding: campaign.logo.includes('kitkat') ? '1.5px' : '0',
                  }}
                />
              ) : (
                <AvatarFallback>
                  {campaign.clientName.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="ml-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-lg">{campaign.title}</h3>
                <CampaignStatusBadge status={campaign.status} />
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                {campaign.clientName} - {campaign.country}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {campaign.agent_status && (
              <ClientStatusBadge status={campaign.agent_status as 'ready' | 'in_progress'} />
            )}
            
            <div className="flex items-center gap-2">
              <Link to={`/campaigns/${campaign.id}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`hover:bg-gray-100 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isDisabled}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`hover:bg-gray-100 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onEdit(campaign.id)}
                disabled={isDisabled}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`hover:bg-gray-100 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onDelete(campaign.id)}
                disabled={isDisabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
