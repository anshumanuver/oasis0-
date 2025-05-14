
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import MessageThread from './MessageThread';

export default function MessagesList() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // Fetch cases for this user
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchCases = async () => {
      try {
        setLoading(true);
        let query;
        
        if (profile?.role === 'neutral') {
          // For mediators, fetch cases they're assigned to
          query = supabase
            .from('cases')
            .select(`
              *,
              parties:case_parties(
                id, party_type,
                profile:profiles(id, first_name, last_name, email)
              ),
              messages(count)
            `)
            .eq('assigned_neutral', user.id)
            .order('updated_at', { ascending: false });
        } else {
          // For parties, fetch cases they're involved in
          query = supabase
            .from('case_parties')
            .select(`
              cases(
                *,
                parties:case_parties(
                  id, party_type,
                  profile:profiles(id, first_name, last_name, email)
                ),
                messages(count)
              )
            `)
            .eq('profile_id', user.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Format the data depending on the role
        let formattedCases = [];
        if (profile?.role === 'neutral') {
          formattedCases = data;
        } else {
          formattedCases = data.map((item: any) => item.cases).filter(Boolean);
        }
        
        setCases(formattedCases);
      } catch (error) {
        console.error('Error fetching cases:', error);
        toast({
          title: 'Error fetching cases',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCases();
  }, [user?.id, profile?.role, toast]);
  
  if (selectedCase) {
    const caseData = cases.find(c => c.id === selectedCase);
    return (
      <MessageThread 
        caseId={selectedCase} 
        onBack={() => setSelectedCase(null)}
      />
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Case Conversations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-500">You don't have any active cases with messages yet.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {cases.map((caseItem) => (
              <li key={caseItem.id} className="hover:bg-gray-50">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 h-auto"
                  onClick={() => setSelectedCase(caseItem.id)}
                >
                  <div className="flex flex-col items-start w-full">
                    <div className="flex justify-between w-full">
                      <h3 className="font-medium truncate">{caseItem.title}</h3>
                      <span className="text-xs text-gray-500">
                        {format(new Date(caseItem.updated_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between w-full mt-1">
                      <span className="text-sm text-gray-500 truncate">
                        {caseItem.messages_count || 0} messages
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        caseItem.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : caseItem.status === 'in_progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {caseItem.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
