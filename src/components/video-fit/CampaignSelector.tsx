
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Define proper types based on the database schema
type Campaign = {
  id: string;
  titel: string;
  client_id: string;
};

type CampaignSelectorProps = {
  selectedClientId: string;
  selectedCampaignId: string;
  setSelectedCampaignId: (id: string) => void;
  disabled?: boolean;
  required?: boolean;
};

const CampaignSelector: React.FC<CampaignSelectorProps> = ({ 
  selectedClientId, 
  selectedCampaignId, 
  setSelectedCampaignId,
  disabled = false,
  required = false
}) => {
  // Fetch campaigns based on selected client - using 'titel' instead of 'name'
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns', selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, titel, client_id')  // Select titel instead of name
        .eq('client_id', selectedClientId)
        .order('titel');                 // Order by titel
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedClientId
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="campaign">
        Campaign
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select 
        value={selectedCampaignId} 
        onValueChange={setSelectedCampaignId}
        disabled={!selectedClientId || campaigns.length === 0 || disabled}
        required={required}
      >
        <SelectTrigger id="campaign">
          <SelectValue placeholder={
            !selectedClientId 
              ? "Select a client first" 
              : campaigns.length === 0 
                ? "No campaigns available" 
                : "Select a campaign"
          } />
        </SelectTrigger>
        <SelectContent>
          {campaigns.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id}>
              {campaign.titel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CampaignSelector;
