
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { UserCheck } from 'lucide-react';
import { Case } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CaseAssignmentCardProps {
  assignments: Case[];
}

export default function CaseAssignmentCard({ assignments }: CaseAssignmentCardProps) {
  if (assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-orrr-blue-500" />
            New Case Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <p>No pending assignments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-orrr-blue-500" />
          New Case Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((caseItem) => (
            <div key={caseItem.id} className="pb-3">
              <div className="mb-2">
                <Link 
                  to={`/cases/${caseItem.id}`} 
                  className="font-medium hover:text-orrr-blue-600 hover:underline"
                >
                  {caseItem.title}
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">
                  Filed: {format(new Date(caseItem.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="w-1/2">Accept</Button>
                <Button size="sm" variant="outline" className="w-1/2">Decline</Button>
              </div>
              {assignments.indexOf(caseItem) < assignments.length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
          
          {assignments.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="link" asChild>
                <Link to="/assignments">View all assignments</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
