
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

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing while we check auth status
  if (isAuthenticated === null) {
    return null;
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
            <Route 
              path="/account" 
              element={isAuthenticated ? <NotFound /> : <Navigate to="/" />} 
            /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
