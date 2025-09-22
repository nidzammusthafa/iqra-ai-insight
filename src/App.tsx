import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FocusModeProvider from "@/hooks/FocusModeProvider";
import { MobileLayout } from "./components/layout/MobileLayout";
import { QuranHome } from "./pages/QuranHome";
import { SurahDetail } from "./pages/SurahDetail";
import { HaditsHome } from "./pages/HaditsHome";
import { HadithList } from "./pages/HadithList";
import { HadithDetail } from "./pages/HadithDetail";
import { SearchPage } from "./pages/SearchPage";
import { QiblaPage } from "./pages/QiblaPage";
import { PrayerTimesPage } from "./pages/PrayerTimesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FocusModeProvider>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<QuranHome />} />
              <Route path="/surah/:surahNumber" element={<SurahDetail />} />
              <Route path="/hadits" element={<HaditsHome />} />
              <Route path="/hadits/:rawi" element={<HadithList />} />
              <Route path="/hadits/:rawi/:haditsNumber" element={<HadithDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/qibla" element={<QiblaPage />} />
              <Route path="/prayer-times" element={<PrayerTimesPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MobileLayout>
        </FocusModeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
