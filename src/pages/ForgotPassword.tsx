
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  
  // Check if we have a hash in the URL (for password reset session)
  useEffect(() => {
    // If we have a hash in the URL, this is likely a password reset session
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Extract the token and type
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const tokenType = params.get('type');
      
      if (accessToken && tokenType === 'recovery') {
        console.log('Password reset session detected');
        setStep('password');
      }
    }
  }, []);
  
  const checkEmailExists = async (email: string) => {
    try {
      // Try to sign in with an invalid password to check if the email exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'check_email_exists_only'
      });
      
      // If the error message indicates the user doesn't exist
      if (error && error.message.includes('Email not confirmed')) {
        return true; // Email exists but not confirmed
      } else if (error && error.message.includes('Invalid login credentials')) {
        return true; // Email exists but wrong password
      } else if (error && (error.message.includes('user not found') || error.message.includes('User not found'))) {
        return false; // Email doesn't exist
      }
      
      return true; // Assume email exists if we can't definitively say it doesn't
    } catch (err) {
      console.error('Error checking email:', err);
      return null; // Error checking
    }
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const exists = await checkEmailExists(email);
      setEmailExists(exists);
      
      if (!exists) {
        setError("You don't have an account yet. Talk to Marcus Ambrus.");
        setLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/forgot-password',
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Password reset instructions have been sent to your email');
      }
    } catch (err: any) {
      console.error('Error during password reset:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('An error occurred during password reset');
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
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Password has been reset successfully');
        // Sign the user out and redirect to login
        await supabase.auth.signOut();
        navigate('/');
      }
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('An error occurred while updating your password');
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
            <h1 className="text-2xl font-semibold text-center">Set new password</h1>
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
                {loading ? 'Checking...' : 'Continue'}
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
                {loading ? 'Updating...' : 'Save'}
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
