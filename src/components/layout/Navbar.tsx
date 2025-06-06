
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import ProfileMenu from './ProfileMenu';
import AppNavigationMenu from './NavigationMenu';

export default function Navbar() {
  const { user, userRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (userRole === 'neutral') {
      return '/mediator-dashboard';
    } else if (userRole === 'client') {
      return '/party-dashboard';
    }
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orrr-blue-700">orrr</span>
              <span className="ml-2 text-xs bg-orrr-teal-500 text-white px-2 py-0.5 rounded uppercase">
                ODR Platform
              </span>
            </Link>
            
            {/* Desktop Navigation Menu */}
            <div className="hidden md:ml-6 md:flex md:items-center">
              {user && <AppNavigationMenu />}
            </div>
          </div>

          {/* Desktop quick links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!user && (
              <>
                <Link to="/about" className="nav-link">
                  About
                </Link>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link to="/cases/new" className="nav-link">
                  File Case
                </Link>
                
                {/* Add NotificationCenter here */}
                <NotificationCenter />
                
                {/* Profile Menu */}
                <ProfileMenu />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/cases"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cases
                </Link>
                {userRole === 'neutral' && (
                  <Link
                    to="/hearings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hearings
                  </Link>
                )}
                {userRole === 'client' && (
                  <>
                    <Link
                      to="/messages"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link
                      to="/cases/new"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      File Case
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* Add mobile notifications link */}
                <Link
                  to="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    // Mobile notifications handling would go here
                  }}
                >
                  Notifications
                </Link>
                
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
