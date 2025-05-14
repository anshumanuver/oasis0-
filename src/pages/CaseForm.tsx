import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createCase } from '@/integrations/supabase/cases';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  disputeType: z.enum(['negotiation', 'mediation', 'arbitration', 'conciliation'], {
    required_error: "You need to select a dispute type.",
  }),
});

export default function CaseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      disputeType: "mediation",
    },
  });

  const { mutate: createNewCase } = useMutation(createCase, {
    onSuccess: () => {
      toast({
        title: "Case created",
        description: "Your case has been successfully submitted.",
      });
      setIsSubmitting(false);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: "Failed to create case. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (values) => {
    setIsSubmitting(true);
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to submit a case.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    createNewCase({
      ...values,
      createdBy: user.id,
    });
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <DashboardHeader title="File a New Case" description="Submit details for your dispute resolution case" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the details of your case"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disputeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Dispute</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dispute type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="mediation">Mediation</SelectItem>
                      <SelectItem value="arbitration">Arbitration</SelectItem>
                      <SelectItem value="conciliation">Conciliation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Case"}
            </Button>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
