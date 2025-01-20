import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import YearlyPlanner from "./pages/YearlyPlanner";
import MonthPlanner from "./pages/MonthPlanner";
import Subscriptions from "./pages/Subscriptions";
import CurrentPlans from "./pages/CurrentPlans";
import Transactions from "./pages/Transactions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planner" element={<YearlyPlanner />} />
            <Route path="/planner/:monthId" element={<MonthPlanner />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/current-plans" element={<CurrentPlans />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;