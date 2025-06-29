import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import TaskGeneration from "./pages/TaskGeneration";
import Dashboard from "./pages/Dashboard";
import Mindspace from "./pages/Mindspace";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/onboarding" element={
        <ProtectedRoute requiresOnboarding={false}>
          <Onboarding />
        </ProtectedRoute>
      } />
      <Route path="/task-generation" element={
        <ProtectedRoute requiresOnboarding={false}>
          <TaskGeneration />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute requiresOnboarding={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/mindspace" element={
        <ProtectedRoute requiresOnboarding={true}>
          <Mindspace />
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute requiresOnboarding={true}>
          <Progress />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute requiresOnboarding={true}>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppProvider>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
