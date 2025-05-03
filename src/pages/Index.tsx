
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LogoIcon from '@/components/LogoIcon';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center">
            <LogoIcon className="mb-4" />
            <h2 className="text-center text-2xl font-bold text-gray-900">
              NEO AI
            </h2>
            <p className="text-center text-sm text-gray-600">
              Your Social Media Automation Partner
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-neo-red hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-neo-red hover:bg-red-600 text-white"
            >
              Sign In
            </Button>
          </form>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-neo-red hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
      
      {/* Right side - Background image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')" 
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center p-6 backdrop-blur-sm bg-black/30 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-2">Smart AI Dashboard</h2>
            <p>Automate your social media presence with powerful AI tools</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
