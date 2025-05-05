
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
  
  return <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 sign-up">
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
            
            <Button type="submit" className="w-full bg-neo-red hover:bg-red-600 text-white">
              Sign In
            </Button>
          </form>
        </div>
      </div>
      
      {/* Right side - Background image only */}
      <div className="hidden lg:block lg:w-1/2">
        <img 
          src="/lovable-uploads/c2b59a15-d563-4996-958a-b801b324638d.png" 
          alt="Background" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>;
};

export default Index;
