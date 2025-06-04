
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { createCase } from '@/integrations/supabase/cases';
import { createInvitation } from '@/integrations/supabase/invitations';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disputeType, setDisputeType] = useState<DisputeType>('mediation');
  const [respondentEmail, setRespondentEmail] = useState('');
  const [respondentPhone, setRespondentPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a case",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!respondentEmail) {
      setError("Respondent email is required");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create the case
      const newCase = await createCase({
        title,
        description,
        disputeType,
        createdBy: user.id
      });
      
      // Create invitation for respondent
      await createInvitation({
        caseId: newCase.id,
        email: respondentEmail,
        phone: respondentPhone,
        invitedBy: user.id
      });
      
      toast({
        title: "Case created successfully",
        description: "The respondent has been invited via email to join the case"
      });
      
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
      setError("Failed to create case. Please try again.");
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
          <p className="text-gray-600">Please provide details about your dispute and the respondent</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Respondent Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="respondentEmail">Respondent Email *</Label>
                <Input
                  id="respondentEmail"
                  type="email"
                  value={respondentEmail}
                  onChange={(e) => setRespondentEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
                <p className="text-xs text-gray-500">
                  We'll send a secure invitation link to this email if they don't have an account
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respondentPhone">Respondent Phone (Optional)</Label>
                <Input
                  id="respondentPhone"
                  type="tel"
                  value={respondentPhone}
                  onChange={(e) => setRespondentPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Case..." : "Create Case & Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
