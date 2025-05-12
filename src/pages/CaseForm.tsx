
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { DisputeType } from '@/types';

export default function CaseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    disputeType: '' as DisputeType,
    otherPartyName: '',
    otherPartyEmail: '',
    preferredNeutralId: '',
    documents: null as File[] | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormValues((prev) => ({ ...prev, documents: Array.from(e.target.files || []) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formValues.title || !formValues.description || !formValues.disputeType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to create case
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your case has been successfully filed",
      });
      navigate('/dashboard');
    }, 1500);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <DashboardHeader 
          title="File a New Case" 
          description="Provide the details of your dispute to get started"
        />

        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormItem>
              <FormLabel>Case Title</FormLabel>
              <FormControl>
                <Input
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  placeholder="e.g., Breach of Contract with ABC Company"
                  required
                />
              </FormControl>
              <FormDescription>
                Provide a clear title that summarizes your dispute
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Describe the nature of your dispute in detail..."
                  className="min-h-[150px]"
                  required
                />
              </FormControl>
              <FormDescription>
                Include relevant details such as dates, amounts, and specific issues
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormLabel>Dispute Type</FormLabel>
              <Select
                value={formValues.disputeType}
                onValueChange={(value) => handleSelectChange('disputeType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type of dispute resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="mediation">Mediation</SelectItem>
                  <SelectItem value="arbitration">Arbitration</SelectItem>
                  <SelectItem value="conciliation">Conciliation</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of dispute resolution method you prefer
              </FormDescription>
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Other Party Name</FormLabel>
                <FormControl>
                  <Input
                    name="otherPartyName"
                    value={formValues.otherPartyName}
                    onChange={handleChange}
                    placeholder="Name of the opposing party"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Other Party Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    name="otherPartyEmail"
                    value={formValues.otherPartyEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </FormControl>
                <FormDescription>
                  We'll invite them to join the dispute resolution process
                </FormDescription>
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Preferred Neutral (Optional)</FormLabel>
              <Select
                value={formValues.preferredNeutralId}
                onValueChange={(value) => handleSelectChange('preferredNeutralId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a mediator or arbitrator (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No preference</SelectItem>
                  <SelectItem value="2">Neutral Smith</SelectItem>
                  <SelectItem value="4">Neutral Davis</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You may select a preferred neutral or leave it unassigned
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormLabel>Upload Documents (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="cursor-pointer"
                />
              </FormControl>
              <FormDescription>
                Upload relevant documents such as contracts, communications, etc.
              </FormDescription>
            </FormItem>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Filing Case...' : 'File Case'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
