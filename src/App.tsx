import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { 
  Index,
  Contact,
  MecaniqueFormation,
  DiagnosticFormation,
  ConduiteFormation,
  CommerceFormation,
  RHFormation,
  FinanceFormation,
  FormationProfessionnelle,
  CatalogueFormation,
  Events,
  Marches,
  NotFound,
  FormationPage
} from "./page"; // Import toutes les pages du site depuis page.tsx

import { Dashboard } from "./Dashboard"; // Import du dashboard d'administration
import { useDashboardStore } from "./stores/dashboardStore";


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  }, [pathname]);

  return null;
};


const queryClient = new QueryClient();

const App = () => {
  const loadData = useDashboardStore((s) => s.loadData);
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop /> 
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/formations/mecanique" element={<MecaniqueFormation />} />
            <Route path="/formations/diagnostic" element={<DiagnosticFormation />} />
            <Route path="/formations/conduite" element={<ConduiteFormation />} />
            <Route path="/formations/commerce" element={<CommerceFormation />} />
            <Route path="/formations/rh" element={<RHFormation />} />
            <Route path="/formations/finance" element={<FinanceFormation />} />
            <Route path="/formations/professionnelle" element={<FormationProfessionnelle />} />
            <Route path="/formations/catalogue" element={<CatalogueFormation />} />
            <Route path="/formations/:id" element={<FormationPage />} />
            <Route path="/evenements" element={<Events />} />
            <Route path="/marches" element={<Marches />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;