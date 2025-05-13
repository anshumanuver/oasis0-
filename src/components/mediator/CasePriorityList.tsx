
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isAfter, subDays } from 'date-fns';
import { AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Case } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CasePriorityListProps {
  cases: Case[];
}

export default function CasePriorityList({ cases }: CasePriorityListProps) {
  // Filter and sort cases by priority
  const priorityCases = cases
    .filter(c => c.status !== 'resolved')
    .sort((a, b) => {
      // Cases with upcoming hearings first
      const aHasUpcoming = a.hearings?.some(h => 
        isAfter(new Date(h.scheduledAt), new Date())
      ) || false;
      const bHasUpcoming = b.hearings?.some(h => 
        isAfter(new Date(h.scheduledAt), new Date())
      ) || false;
      
      if (aHasUpcoming && !bHasUpcoming) return -1;
      if (!aHasUpcoming && bHasUpcoming) return 1;
      
      // Then sort by last update (most recent first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 5);

  const getPriorityLevel = (caseItem: Case): 'high' | 'medium' | 'low' => {
    // Logic to determine case priority
    const hasUpcomingHearing = caseItem.hearings?.some(h => 
      isAfter(new Date(h.scheduledAt), new Date()) && 
      isAfter(new Date(h.scheduledAt), subDays(new Date(), 7))
    );
    
    const isStale = isAfter(new Date(), subDays(new Date(caseItem.updatedAt), 14));
    
    if (hasUpcomingHearing) return 'high';
    if (isStale) return 'medium';
    return 'low';
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low Priority</Badge>;
    }
  };

  if (priorityCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <p className="text-lg font-medium">No priority cases at the moment</p>
        <p className="text-sm">All your cases are on track</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {priorityCases.map((caseItem) => {
        const priority = getPriorityLevel(caseItem);
        const nextHearing = caseItem.hearings?.find(h => 
          isAfter(new Date(h.scheduledAt), new Date())
        );
        
        return (
          <div key={caseItem.id} className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link to={`/cases/${caseItem.id}`} className="text-lg font-medium hover:text-orrr-blue-600 hover:underline">
                  {caseItem.title}
                </Link>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="capitalize mr-3">
                    {caseItem.disputeType.replace('_', ' ')}
                  </span>
                  {getPriorityBadge(priority)}
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to={`/cases/${caseItem.id}`}>
                  Review
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              {nextHearing && (
                <div className="flex items-center text-orrr-teal-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Hearing on {format(new Date(nextHearing.scheduledAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Last activity: {format(new Date(caseItem.updatedAt), 'MMM d')}
                </span>
              </div>
            </div>
            
            <Separator className="mt-4" />
          </div>
        );
      })}
      
      {cases.filter(c => c.status !== 'resolved').length > 5 && (
        <div className="text-center pt-2">
          <Button variant="link" asChild>
            <Link to="/cases">View all cases</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
