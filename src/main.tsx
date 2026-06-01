import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

// Versioning for automatic cache cleaning
const APP_VERSION = "1.0.1";
const storedVersion = localStorage.getItem("app_version");

if (storedVersion !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem("app_version", APP_VERSION);
  // Optional: Force reload to clear service worker cache if any
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="system" storageKey="fitcouple-theme">
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);

