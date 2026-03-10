import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AddChildPage = lazy(() => import("./pages/AddChildPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const FarmPage = lazy(() => import("./pages/FarmPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const ParentPage = lazy(() => import("./pages/ParentPage"));
const TimeUpPage = lazy(() => import("./pages/TimeUpPage"));
const PremiumPage = lazy(() => import("./pages/PremiumPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <span className="text-6xl float-medium inline-block">✨</span>
      <p className="text-lg font-bold font-baloo text-muted-foreground mt-4">Carregando...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/add-child" element={<AddChildPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/activity/:category" element={<ActivityPage />} />
              <Route path="/farm" element={<FarmPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/parent" element={<ParentPage />} />
              <Route path="/time-up" element={<TimeUpPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
