
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
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
                <div className="text-left">
                  <a href="#" className="text-xs text-neo-red hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-neo-red hover:bg-red-600 text-white">
              Sign In
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
