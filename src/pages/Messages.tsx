
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MessagesList from '@/components/messaging/MessagesList';

export default function Messages() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (!user) return null; // Don't render anything while checking authentication

  return (
    <MainLayout withFooter={false}>
      <div className="container py-8">
        <DashboardHeader 
          title="Messages" 
          description="Communication center for all your cases"
        />
        
        <div className="mt-6">
          <MessagesList />
        </div>
      </div>
    </MainLayout>
  );
}
