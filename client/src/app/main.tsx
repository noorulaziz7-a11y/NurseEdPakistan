import React from "react";
import { createRoot } from "react-dom/client";
// 1. Import QueryClient and QueryClientProvider
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { registerServiceWorker } from "@/lib/offline";

// 2. Use the shared QueryClient with default queryFn

const container = document.getElementById("root");
if (!container) {
  throw new Error(
    '#root element not found. Make sure client/index.html has <div id="root"></div>'
  );
}

// Register service worker for offline support
if (typeof window !== "undefined") {
  registerServiceWorker();
}

createRoot(container).render(
  <React.StrictMode>
    {/* 3. Wrap everything, including AuthProvider, with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);