
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import MediatorDashboard from "./pages/MediatorDashboard";
import PartyDashboard from "./pages/PartyDashboard";
import Cases from "./pages/Cases";
import CaseForm from "./pages/CaseForm";
import CaseDetail from "./pages/CaseDetail";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import HearingsList from "./pages/HearingsList";
import HearingScheduler from "./pages/HearingScheduler";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

// Role-based route component
const RoleRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles: string[] 
}) => {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  
  const userRole = profile?.role || 'client';
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { profile } = useAuth();
  
  // Redirect based on user role
  const handleDashboardRedirect = () => {
    if (profile?.role === 'neutral') {
      return <Navigate to="/mediator-dashboard" />;
    } else if (profile?.role === 'client') {
      return <Navigate to="/party-dashboard" />;
    }
    return <Navigate to="/dashboard" />;
  };
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Profile and Settings pages */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Role-specific dashboard routes */}
      <Route path="/dashboard-redirect" element={
        <ProtectedRoute>
          {handleDashboardRedirect()}
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/mediator-dashboard" element={
        <RoleRoute allowedRoles={['neutral', 'admin']}>
          <MediatorDashboard />
        </RoleRoute>
      } />

      <Route path="/party-dashboard" element={
        <RoleRoute allowedRoles={['client']}>
          <PartyDashboard />
        </RoleRoute>
      } />
      
      {/* Case routes */}
      <Route path="/cases" element={
        <ProtectedRoute>
          <Cases />
        </ProtectedRoute>
      } />
      
      <Route path="/cases/new" element={
        <ProtectedRoute>
          <CaseForm />
        </ProtectedRoute>
      } />
      
      <Route path="/cases/:caseId" element={
        <ProtectedRoute>
          <CaseDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      
      {/* Hearings routes */}
      <Route path="/hearings" element={
        <ProtectedRoute>
          <HearingsList />
        </ProtectedRoute>
      } />
      
      <Route path="/hearings/new" element={
        <ProtectedRoute>
          <HearingScheduler />
        </ProtectedRoute>
      } />
      
      <Route path="/cases/:caseId/schedule-hearing" element={
        <ProtectedRoute>
          <HearingScheduler />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
