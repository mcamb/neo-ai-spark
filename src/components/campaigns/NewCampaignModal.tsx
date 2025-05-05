
import React, { useState, useEffect } from 'react';
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface Client {
  id: string;
  brand: string;
  country: string;
}

interface Objective {
  id: string;
  objective: string;
}

interface Channel {
  id: string;
  channel: string;
}

const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [objectiveId, setObjectiveId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [status, setStatus] = useState('');
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingObjectives, setIsLoadingObjectives] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  
  // Data
  const [clients, setClients] = useState<Client[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  
  // Target audience options
  const targetAudienceOptions = [
    "Primary B2C",
    "Secondary B2C",
    "Primary B2B",
    "Secondary B2B"
  ];
  
  // Campaign status options
  const statusOptions = [
    "Idea",
    "Planned",
    "Running",
    "Finished"
  ];
  
  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      if (!isOpen) return;
      
      setIsLoadingClients(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, brand, country')
          .order('brand', { ascending: true });
        
        if (error) throw error;
        
        setClients(data || []);
      } catch (error: any) {
        console.error('Error fetching clients:', error);
        toast({
          title: 'Error',
          description: `Failed to load clients: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingClients(false);
      }
    };
    
    fetchClients();
  }, [isOpen, toast]);
  
  // Fetch objectives
  useEffect(() => {
    const fetchObjectives = async () => {
      if (!isOpen) return;
      
      setIsLoadingObjectives(true);
      try {
        const { data, error } = await supabase
          .from('objectives')
          .select('id, objective');
        
        if (error) throw error;
        
        setObjectives(data || []);
      } catch (error: any) {
        console.error('Error fetching objectives:', error);
        toast({
          title: 'Error',
          description: `Failed to load objectives: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingObjectives(false);
      }
    };
    
    fetchObjectives();
  }, [isOpen, toast]);
  
  // Fetch channels
  useEffect(() => {
    const fetchChannels = async () => {
      if (!isOpen) return;
      
      setIsLoadingChannels(true);
      try {
        const { data, error } = await supabase
          .from('channels')
          .select('id, channel')
          .order('channel', { ascending: true });
        
        if (error) throw error;
        
        setChannels(data || []);
      } catch (error: any) {
        console.error('Error fetching channels:', error);
        toast({
          title: 'Error',
          description: `Failed to load channels: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingChannels(false);
      }
    };
    
    fetchChannels();
  }, [isOpen, toast]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setClientId('');
      setTargetAudience('');
      setObjectiveId('');
      setChannelId('');
      setStatus('');
    }
  }, [isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !clientId || !targetAudience || !objectiveId || !channelId || !status) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new campaign in Supabase
      const { error } = await supabase
        .from('campaigns')
        .insert([
          { 
            titel: title, 
            client_id: clientId,
            target_audience: targetAudience,
            objective_id: objectiveId,
            channel_id: channelId,
            status: status
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Campaign created successfully'
      });
      
      // Notify parent component and close
      onSubmit();
      onClose();
      
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: `Failed to create campaign: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isLoadingClients || isLoadingObjectives || isLoadingChannels;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>New Campaign</SheetTitle>
          <SheetDescription>
            Please follow the instructions.
          </SheetDescription>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-neo-red" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={clientId} 
                onValueChange={setClientId}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {`${client.brand} - ${client.country}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Campaign title *</Label>
              <Input 
                id="title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter campaign title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Select 
                value={targetAudience} 
                onValueChange={setTargetAudience}
              >
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudienceOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objective">Objective *</Label>
              <Select 
                value={objectiveId} 
                onValueChange={setObjectiveId}
              >
                <SelectTrigger id="objective">
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map(objective => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.objective}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="channel">Channel *</Label>
              <Select 
                value={channelId} 
                onValueChange={setChannelId}
              >
                <SelectTrigger id="channel">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map(channel => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Campaign Status *</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-neo-red hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewCampaignModal;
