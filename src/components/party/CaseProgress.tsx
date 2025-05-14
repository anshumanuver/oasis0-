
import { Case } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface CaseProgressProps {
  caseData: Case;
}

export default function CaseProgress({ caseData }: CaseProgressProps) {
  // Calculate progress percentage based on status
  const getProgressPercentage = () => {
    switch (caseData.status) {
      case 'pending':
        return 25;
      case 'in_progress':
        return 60;
      case 'resolved':
        return 100;
      default:
        return 0;
    }
  };
  
  // Get status badge color
  const getStatusColor = () => {
    switch (caseData.status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get next steps based on status
  const getNextSteps = () => {
    switch (caseData.status) {
      case 'pending':
        return 'Awaiting mediator assignment';
      case 'in_progress':
        return caseData.nextHearingDate 
          ? `Upcoming hearing on ${new Date(caseData.nextHearingDate).toLocaleDateString()}` 
          : 'Mediator is reviewing your case';
      case 'resolved':
        return 'Case has been resolved';
      default:
        return 'Status unknown';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-lg">{caseData.title}</h3>
          <p className="text-sm text-gray-500">
            {caseData.disputeType.charAt(0).toUpperCase() + caseData.disputeType.slice(1)}
          </p>
        </div>
        <Badge className={getStatusColor()}>
          {caseData.status.replace('_', ' ').charAt(0).toUpperCase() + caseData.status.replace('_', ' ').slice(1)}
        </Badge>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span>Case Progress</span>
          <span>{getProgressPercentage()}%</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
        <h4 className="font-medium mb-1">Next Steps</h4>
        <p className="text-sm">{getNextSteps()}</p>
      </div>
      
      <div className="mt-6 text-sm">
        <div className="flex justify-between mb-2">
          <span>Case ID:</span>
          <span className="font-mono">{caseData.id.slice(0, 8)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Filed on:</span>
          <span>{new Date(caseData.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Documents:</span>
          <span>{caseData.documents.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Parties:</span>
          <span>{caseData.parties.length}</span>
        </div>
      </div>
    </div>
  );
}
