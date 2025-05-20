
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function NotFound() {
  const { user, profile } = useAuth();
  
  const getDashboardLink = () => {
    if (profile?.role === 'neutral') {
      return '/mediator-dashboard';
    } else if (profile?.role === 'client') {
      return '/party-dashboard';
    }
    return '/dashboard';
  };
  
  return (
    <MainLayout showNotifications={false}>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page not found</h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
              <Link to="/">Go back home</Link>
            </Button>
            {user && (
              <Button variant="outline" asChild>
                <Link to={getDashboardLink()}>Return to dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
