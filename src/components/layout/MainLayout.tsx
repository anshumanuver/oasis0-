
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import { NotificationsPanel } from '../notifications/NotificationsPanel';

interface MainLayoutProps {
  children: ReactNode;
  withFooter?: boolean;
  requireAuth?: boolean;
  showNotifications?: boolean;
}

export default function MainLayout({ 
  children, 
  withFooter = true, 
  requireAuth = false,
  showNotifications = true
}: MainLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoading, user, requireAuth, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {showNotifications && user && (
        <div className="fixed top-16 right-4 z-50">
          <NotificationsPanel />
        </div>
      )}
      <main className="flex-grow pt-16">
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
}
