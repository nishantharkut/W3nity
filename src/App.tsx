
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import Layout from "@/components/layout/Layout";
import Home from "./pages/Home";
import Freelance from "./pages/Freelance";
import Events from "./pages/Events";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreateGigForm from "@/components/freelance/CreateGigForm";
import CreateEventForm from "@/components/events/CreateEventForm";
import UserDashboard from "@/components/dashboard/UserDashboard";
import GigDetail from "@/components/freelance/GigDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/freelance" element={<Freelance />} />
              <Route path="/freelance/create" element={<CreateGigForm />} />
              <Route path="/freelance/gig/:id" element={<GigDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/create" element={<CreateEventForm />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
