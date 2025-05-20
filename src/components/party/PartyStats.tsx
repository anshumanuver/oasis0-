
import { useState, useEffect } from 'react';
import { Case } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface PartyStatsProps {
  cases: Case[];
}

export default function PartyStats({ cases }: PartyStatsProps) {
  const [stats, setStats] = useState({
    active: 0,
    resolved: 0,
    urgent: 0,
    pending: 0
  });

  useEffect(() => {
    if (cases.length > 0) {
      const active = cases.filter(c => c.status === 'in_progress').length;
      const resolved = cases.filter(c => c.status === 'resolved').length;
      const pending = cases.filter(c => c.status === 'pending').length;
      
      // Consider cases with upcoming hearings as urgent
      const urgent = cases.filter(c => c.nextHearingDate && new Date(c.nextHearingDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;
      
      setStats({ active, resolved, urgent, pending });
    }
  }, [cases]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-orrr-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Active Cases</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.active}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-100">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">Resolved</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.resolved}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 border-amber-100">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-medium text-gray-900">Pending</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.pending}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-100">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-900">Urgent</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.urgent}</p>
        </CardContent>
      </Card>
    </div>
  );
}
