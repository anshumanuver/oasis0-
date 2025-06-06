
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import CasesTable from '@/components/dashboard/CasesTable';
import { fetchUserCases } from '@/integrations/supabase/cases';
import { mockCases } from '@/data/mockData';
import { Case } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Cases() {
  const { user, userRole } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCases() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // If user is admin, show all cases (mock data for now since we need to implement the admin fetch properly)
        if (userRole === 'admin') {
          setCases(mockCases);
        } else {
          // For regular users, fetch their specific cases
          const userCases = await fetchUserCases(user.id, userRole);
          setCases(userCases);
        }
      } catch (err) {
        console.error('Error loading cases:', err);
        setError('Failed to load cases. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, [user, userRole]);

  const getPageTitle = () => {
    if (userRole === 'admin') {
      return 'All Cases - Admin View';
    }
    return 'Your Cases';
  };

  const getPageDescription = () => {
    if (userRole === 'admin') {
      return 'Manage all dispute resolution cases across the platform';
    }
    return 'Manage all your dispute resolution cases';
  };

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-gray-600">{getPageDescription()}</p>
            {userRole === 'admin' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Admin Access
                </span>
              </div>
            )}
          </div>
          <Button asChild>
            <Link to="/cases/new">
              <Plus className="h-4 w-4 mr-2" />
              File New Case
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <CasesTable cases={cases} />
            {cases.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {userRole === 'admin' ? 'No cases in the system' : 'No cases found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {userRole === 'admin' 
                    ? 'There are currently no cases in the platform.' 
                    : 'You haven\'t filed any cases yet.'
                  }
                </p>
                <Button asChild>
                  <Link to="/cases/new">Create your first case</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
