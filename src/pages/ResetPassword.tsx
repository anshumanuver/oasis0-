
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in a valid reset password session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setValidSession(true);
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) {
        setError(updateError.message);
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been successfully reset",
        });
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!validSession) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center py-12">
          <div className="mx-auto w-full max-w-md">
            <div className="bg-white shadow-md rounded-lg p-6 w-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Reset Link</h2>
                <p className="text-gray-500 mb-4">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/forgot-password')}
                >
                  Request New Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col justify-center items-center py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create new password</h2>
            <p className="text-gray-500">
              Enter a new password for your account
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
