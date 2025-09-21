import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileLayout } from "./components/layout/MobileLayout";
import { QuranHome } from "./pages/QuranHome";
import { SurahDetail } from "./pages/SurahDetail";
import { HaditsHome } from "./pages/HaditsHome";
import { SearchPage } from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<QuranHome />} />
            <Route path="/surah/:surahNumber" element={<SurahDetail />} />
            <Route path="/hadits" element={<HaditsHome />} />
            <Route path="/search" element={<SearchPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
