
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'password'>('email');
  
  // Check for password reset token in URL
  useEffect(() => {
    const handlePasswordResetToken = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      if (accessToken && type === 'recovery') {
        // Set to password reset step but don't automatically log the user in
        setStep('password');
        
        // Clear the URL hash to avoid token leakage in browser history
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    handlePasswordResetToken();
  }, [location]);
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Send reset password email
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/forgot-password`, // This URL should be set in Supabase
        }
      );
      
      if (error) {
        throw error;
      }
      
      toast.success('Check your email for the password reset link');
      
    } catch (err: any) {
      console.error('Error sending reset password email:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update user's password using the token from URL
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password has been updated successfully');
      
      // Sign out the user after password reset to force them to log in with new password
      await supabase.auth.signOut();
      
      // Redirect to login page
      navigate('/');
      
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-semibold text-center">
              {step === 'email' ? 'Reset your password' : 'Set new password'}
            </h1>
          </div>
          
          {step === 'email' ? (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neo-red hover:bg-red-600 text-white"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className="text-sm text-gray-600 hover:text-neo-red flex items-center justify-center w-full"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back to login
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handlePasswordReset}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neo-red hover:bg-red-600 text-white"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
      
      {/* Right side - Background image */}
      <div className="hidden lg:block lg:w-1/2" style={{ overflow: 'hidden' }}>
        <img 
          src="https://images.squarespace-cdn.com/content/v1/62bc0bb4f9bc3f2927ad3f04/40e41f11-d3fc-4fd9-9857-3af4643ab40f/serviceplan-23.jpg" 
          alt="Modern office interior" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
