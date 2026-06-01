import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

// Versioning for automatic cache cleaning
const APP_VERSION = "1.0.5";
const VERSION_KEY = "app_version";
const RELOAD_KEY = "app_reload_after_update";
const storedVersion = localStorage.getItem(VERSION_KEY);

if (storedVersion !== APP_VERSION) {
  console.log(`Versão antiga detectada (${storedVersion}). Limpando cache para v${APP_VERSION}...`);
  localStorage.setItem(VERSION_KEY, APP_VERSION);

  const clearAppCache = async () => {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  };

  if (sessionStorage.getItem(RELOAD_KEY) !== APP_VERSION) {
    sessionStorage.setItem(RELOAD_KEY, APP_VERSION);
    clearAppCache().finally(() => window.location.reload());
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

