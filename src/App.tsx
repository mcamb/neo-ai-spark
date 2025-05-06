
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import Lab from "./pages/Lab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session ? "Active" : "None");
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth session:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? "Active" : "None");
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while we check auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neo-red"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Index />} />
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
            />
            <Route 
              path="/clients" 
              element={isAuthenticated ? <Clients /> : <Navigate to="/" />} 
            />
            <Route 
              path="/clients/:clientId" 
              element={isAuthenticated ? <ClientDetails /> : <Navigate to="/" />} 
            />
            <Route 
              path="/campaigns" 
              element={isAuthenticated ? <Campaigns /> : <Navigate to="/" />} 
            />
            <Route 
              path="/campaigns/:campaignId" 
              element={isAuthenticated ? <CampaignDetails /> : <Navigate to="/" />} 
            />
            <Route 
              path="/lab" 
              element={isAuthenticated ? <Lab /> : <Navigate to="/" />} 
            /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
