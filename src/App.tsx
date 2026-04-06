import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VendorPortal from "./components/vendor/VendorPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Admin panel */}
            <Route path="/" element={<Index />} />

            {/* Vendor portal */}
            <Route path="/vendor" element={<VendorPortal />} />
            <Route path="/vendor/stripe" element={<VendorPortal />} />
            <Route path="/vendor/stripe-return" element={<VendorPortal />} />
            <Route path="/vendor/stripe-refresh" element={<VendorPortal />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;