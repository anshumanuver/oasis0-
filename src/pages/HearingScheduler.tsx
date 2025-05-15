
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { HearingCreateDTO, createHearing } from '@/integrations/supabase/hearings';
import { setupNotificationsForHearing } from '@/integrations/supabase/notifications';
import { mockCases } from '@/data/mockData';

interface HearingFormValues {
  title: string;
  date: Date;
  time: string;
  duration: number;
  meetingType: string;
  meetingLink?: string;
  description?: string;
}

export default function HearingScheduler() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, we would fetch the case data from the database
    // For now, we'll use the mock data
    if (caseId) {
      const foundCase = mockCases.find(c => c.id === caseId);
      setCaseData(foundCase);
    }
  }, [caseId]);

  const form = useForm<HearingFormValues>({
    defaultValues: {
      title: '',
      date: new Date(),
      time: '09:00',
      duration: 60,
      meetingType: 'virtual',
      description: '',
    },
  });

  const meetingType = form.watch('meetingType');

  const onSubmit = async (data: HearingFormValues) => {
    if (!user || !caseId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Combine date and time for API
      const [hours, minutes] = data.time.split(':').map(Number);
      const scheduledAt = new Date(data.date);
      scheduledAt.setHours(hours, minutes);

      const hearingData: HearingCreateDTO = {
        caseId,
        title: data.title,
        scheduledAt: scheduledAt.toISOString(),
        duration: data.duration,
        description: data.description || '',
        meetingLink: data.meetingType === 'virtual' ? (data.meetingLink || 'https://zoom.us/meeting') : undefined,
        scheduledBy: user.id,
      };

      // Create the hearing in the database
      const newHearing = await createHearing(hearingData);

      // Get party IDs from the case data to send notifications
      const partyIds: string[] = [];
      if (caseData && caseData.parties) {
        caseData.parties.forEach((party: any) => {
          if (party.id !== user.id) { // Don't notify the scheduler
            partyIds.push(party.id);
          }
        });
      }

      // Create notifications for all case participants
      await setupNotificationsForHearing(
        newHearing.id, 
        caseId, 
        partyIds,
        caseData?.neutralId // Notify the neutral (mediator/arbitrator) if there is one
      );

      toast({
        title: "Hearing scheduled",
        description: "All participants have been notified",
      });

      // Navigate back to case detail
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.error("Error scheduling hearing:", error);
      toast({
        title: "Error",
        description: "Failed to schedule hearing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Schedule a Hearing</h1>
          <p className="text-gray-600">Select a date and time for the hearing</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hearing Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Initial Case Review" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="time"
                          {...field}
                          className="w-full"
                        />
                        <Clock className="ml-2 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meeting type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="virtual">Virtual (Online)</SelectItem>
                        <SelectItem value="physical">Physical (In-person)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {meetingType === 'virtual' && (
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. https://zoom.us/j/123456789"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the Zoom, Google Meet, or Microsoft Teams link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about this hearing"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Scheduling..." : "Schedule Hearing"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
