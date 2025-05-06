
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LogoIcon from '@/components/LogoIcon';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Anmeldefehler:', error);
        toast.error(error.message);
      } else if (data.user) {
        toast.success('Erfolgreich angemeldet');
        navigate('/home');
      }
    } catch (error) {
      console.error('Fehler bei der Anmeldung:', error);
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/home',
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Anweisungen zum Zurücksetzen des Passworts wurden gesendet');
      }
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
      toast.error('Ein Fehler ist aufgetreten');
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2">
              <LogoIcon />
              <span className="font-semibold text-xl text-neo-black">NEO AI</span>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                
                <a href="#" onClick={handlePasswordReset} className="text-xs text-neo-red hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-neo-red hover:bg-red-600 text-white"
              disabled={loading}
            >
              {loading ? 'Anmeldung...' : 'Sign In'}
            </Button>
          </form>
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

export default Index;
