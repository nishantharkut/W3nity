import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import FreelancePage from "./pages/FreelancePage";
import EventsPage from "./pages/EventsPage";
import CommunityPage from "./pages/CommunityPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import GigDetailsPage from "./pages/GigDetailsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateGigPage from "./pages/CreateGigPage";
import CreateEventPage from "./pages/CreateEventPage";
import ProposalPage from "./pages/ProposalPage";
import ChatInterface from "./pages/ChatInterface";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import Breadcrumbs from "./components/BreadCrumbs";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Main app routes with navbar/footer */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <div className="container mx-auto px-4 py-6">
                      <Breadcrumbs />
                      <Routes>
                      <Route path="/" element={<Index />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/freelance" element={<FreelancePage />} />
                        <Route
                          path="/freelance/create"
                          element={<CreateGigPage />}
                        />
                        <Route path="/gig/:id" element={<GigDetailsPage />} />
                        <Route
                          path="/gig/:id/proposal"
                          element={<ProposalPage />}
                        />
                        <Route path="/events" element={<EventsPage />} />
                        <Route
                          path="/events/create"
                          element={<CreateEventPage />}
                        />
                        <Route
                          path="/event/:id"
                          element={<EventDetailsPage />}
                        />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community/:id" element={<ChatInterface />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                          path="/notifications"
                          element={<NotificationsPage />}
                        />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/payment/:type/:id" element={<PaymentPage/>}/>
                        <Route path="/payment/success" element={<PaymentSuccessPage/>}/>
                        <Route path="/payment/cancel" element={<PaymentCancelPage/>}/>

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>

                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
