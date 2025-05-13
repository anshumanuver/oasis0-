
import { BarChart4, Clock, CheckCircle } from 'lucide-react';
import { MediatorStats } from '@/types';
import { Progress } from '@/components/ui/progress';

interface MediatorPerformanceProps {
  stats: MediatorStats;
}

export default function MediatorPerformance({ stats }: MediatorPerformanceProps) {
  const timeToResolution = 14; // Mock average days to resolution
  const feedbackScore = 4.7; // Mock feedback score
  
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Resolution Rate</span>
          <span className="text-sm font-medium">{stats.resolutionRate}%</span>
        </div>
        <Progress value={stats.resolutionRate} className="h-2" />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Satisfaction Score</span>
          <span className="text-sm font-medium">{feedbackScore}/5</span>
        </div>
        <Progress value={(feedbackScore / 5) * 100} className="h-2" />
      </div>
      
      <div className="pt-2">
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-orrr-blue-500" />
          <span className="text-gray-700">
            Avg. Time to Resolution: {timeToResolution} days
          </span>
        </div>
        
        <div className="flex items-center text-sm mt-2">
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          <span className="text-gray-700">
            {stats.resolvedCases} cases resolved this year
          </span>
        </div>
        
        <div className="flex items-center text-sm mt-2">
          <BarChart4 className="h-4 w-4 mr-2 text-purple-500" />
          <span className="text-gray-700">
            {Math.round(stats.casesThisMonth * 1.2)} avg. cases per month
          </span>
        </div>
      </div>
    </div>
  );
}
