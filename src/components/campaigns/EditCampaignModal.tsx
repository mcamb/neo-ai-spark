
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
import { Loader, AlertTriangle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  onSubmit: () => void;
}

const fetchCampaign = async (campaignId: string) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (error) {
    console.error("Error fetching campaign:", error);
    throw new Error(error.message);
  }

  return data;
};

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ 
  isOpen, 
  onClose, 
  campaignId,
  onSubmit 
}) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Campaign status options
  const statusOptions = [
    "Idea",
    "Planned",
    "Running",
    "Finished"
  ];
  
  // Fetch campaign data
  const { 
    data: campaign,
    isLoading: isLoadingCampaign,
    error: campaignError
  } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => fetchCampaign(campaignId),
    enabled: !!campaignId && isOpen,
  });

  // Populate form when campaign data is available
  useEffect(() => {
    if (campaign) {
      setTitle(campaign.titel || '');
      setStatus(campaign.status || '');
    }
  }, [campaign]);

  // Log any errors
  useEffect(() => {
    if (campaignError) {
      toast({
        title: "Error loading campaign",
        description: `${campaignError instanceof Error ? campaignError.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  }, [campaignError, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !status) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the campaign in the database
      const { error } = await supabase
        .from('campaigns')
        .update({
          titel: title,
          status: status
        })
        .eq('id', campaignId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Campaign updated successfully'
      });
      
      // Notify parent component and close
      onSubmit();
      onClose();
      
    } catch (error: any) {
      console.error("Error updating campaign:", error);
      toast({
        title: 'Error',
        description: `Failed to update campaign: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Campaign</SheetTitle>
          <SheetDescription>
            Update campaign information.
          </SheetDescription>
        </SheetHeader>
        
        {isLoadingCampaign ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-neo-red" />
          </div>
        ) : campaignError ? (
          <div className="text-center py-10">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-red-500">Error loading campaign information.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="status">Update status *</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="title">Update title *</Label>
              <Input 
                id="title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter campaign title"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-neo-red hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Updating..." : "Update Campaign"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditCampaignModal;
