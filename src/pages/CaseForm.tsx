
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotification } from '@/hooks/use-notification';
import { createCase } from '@/integrations/supabase/cases';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DisputeType } from '@/types';

export default function CaseForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendNotification } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disputeType, setDisputeType] = useState<DisputeType>('mediation');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a case",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const newCase = await createCase({
        title,
        description,
        disputeType,
        createdBy: user.id
      });
      
      toast({
        title: "Case created",
        description: "Your case has been successfully submitted"
      });
      
      // Send notification to the user about the case creation
      await sendNotification({
        title: "New Case Created",
        content: `You've successfully created a new case: ${title}`,
        relatedToCaseId: newCase.id
      });
      
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
      toast({
        title: "Error",
        description: "Failed to create case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">File a New Case</h1>
          <p className="text-gray-600">Please provide details about your dispute</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Case Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title describing your case"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="disputeType">Dispute Type</Label>
            <Select 
              value={disputeType} 
              onValueChange={(value: DisputeType) => setDisputeType(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dispute type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="mediation">Mediation</SelectItem>
                <SelectItem value="arbitration">Arbitration</SelectItem>
                <SelectItem value="conciliation">Conciliation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your case"
              rows={6}
              required
            />
          </div>
          
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Case"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
