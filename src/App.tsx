import { Suspense, useEffect, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import InstallPrompt from "@/components/PWA/InstallPrompt";
import OfflineIndicator from "@/components/PWA/OfflineIndicator";
import { registerPwa } from "@/utils/pwa";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import ErrorBoundary from "@/components/ErrorBoundary";

const FormPage = lazy(() => import("./pages/FormPage"));
const SpinnerPage = lazy(() => import("./pages/SpinnerPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
import { runAllTests } from "@/utils/testHelpers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        console.error("Query failed:", error);
        return failureCount < 2; // Retry up to 2 times
      },
    },
  },
});

// Loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    // Performance monitoring
    console.log("🚀 Spinner App initialized at:", new Date().toISOString());
    
    // Run comprehensive tests in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        runAllTests();
      }, 1000);
    }
    
    // Initialize app state validation
    try {
      const totalSpins = localStorage.getItem("totalSpins");
      const offerDistribution = localStorage.getItem("offerDistribution");
      
      if (totalSpins && isNaN(parseInt(totalSpins))) {
        console.warn("⚠️ Invalid totalSpins data, resetting...");
        localStorage.removeItem("totalSpins");
      }
      
      if (offerDistribution) {
        const parsed = JSON.parse(offerDistribution);
        if (!Array.isArray(parsed) || parsed.length !== 8) {
          console.warn("⚠️ Invalid offerDistribution data, resetting...");
          localStorage.removeItem("offerDistribution");
        }
      }
    } catch (error) {
      console.error("❌ Error validating app state:", error);
    }
  }, []);

  return (
    <main>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Index />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/spinner" element={<SpinnerPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </main>
  );
};

const App = () => {
  useEffect(() => {
    registerPwa();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <OfflineIndicator />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
