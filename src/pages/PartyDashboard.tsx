
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PartyDashboardContent from '@/components/party/PartyDashboardContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function PartyDashboard() {
  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <DashboardHeader 
            title="Client Dashboard" 
            description="Manage your dispute resolution cases"
          />
          <Button asChild>
            <Link to="/cases/new">
              <Plus className="h-4 w-4 mr-2" />
              File New Case
            </Link>
          </Button>
        </div>
        
        <PartyDashboardContent />
      </div>
    </MainLayout>
  );
}
