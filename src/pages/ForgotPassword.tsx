
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) {
        setError(resetError.message);
      } else {
        setIsSuccess(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for a password reset link",
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col justify-center items-center py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Reset your password</h2>
            <p className="text-gray-500">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-600 p-4 rounded-md">
                  <p className="font-medium">Reset link sent!</p>
                  <p className="text-sm mt-1">Check your email for instructions to reset your password.</p>
                </div>
                <Link to="/login">
                  <Button variant="outline" className="mt-4 w-full">
                    Return to login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-orrr-blue-600 hover:underline">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
