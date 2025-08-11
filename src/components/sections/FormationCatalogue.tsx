import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Clock, Users, MapPin, Download, FileText, RotateCw, AlertCircle, Truck, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDashboardStore } from '../../stores/dashboardStore';
import { usePdfLoader, getPdfJsConfig, detectDownloadManager } from '../../lib/pdfUtils';

// Configuration du worker PDF
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/rachef-uploads/pdf.worker.min.js`;

interface FormationCatalogueProps {
  title?: string;
  description?: string;
}
const FormationCatalogue: React.FC<FormationCatalogueProps> = ({
  title = "Catalogue de Formations",
  description = "Découvrez nos programmes de formation conçus pour développer vos compétences professionnelles"
}) => {
  const { datapJson } = useDashboardStore();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1.4);
  const [isMobile, setIsMobile] = useState(false);

  const originalPdfUrl = datapJson?.catalogueFormation?.pdfUrl || '/rachef-uploads/cata.pdf';
  const catalogueTitle = datapJson?.catalogueFormation?.title || title;
  const catalogueDescription = datapJson?.catalogueFormation?.description || description;
  
  // Debug: vérifier l'URL PDF
  console.log('🔍 FormationCatalogue - URL PDF originale:', originalPdfUrl);
  console.log('🔍 FormationCatalogue - datapJson:', datapJson?.catalogueFormation);
  
  // Utiliser notre loader PDF compatible IDM
  const { pdfUrl, isLoading: isPdfLoading, error: pdfError, reload } = usePdfLoader(originalPdfUrl);
  
  // Debug: vérifier l'URL finale
  console.log('🔍 FormationCatalogue - URL PDF finale:', pdfUrl);
  console.log('🔍 FormationCatalogue - isPdfLoading:', isPdfLoading);
  console.log('🔍 FormationCatalogue - pdfError:', pdfError);
  
  // Vérifier l'accessibilité du fichier PDF
  useEffect(() => {
    const checkPdfAccessibility = async () => {
      const testUrl = pdfUrl || originalPdfUrl;
      if (testUrl && testUrl !== '/rachef-uploads/cata.pdf') {
        try {
          console.log('🔍 Test d\'accessibilité du PDF:', testUrl);
          const response = await fetch(testUrl);
          console.log('🔍 Réponse du serveur:', response.status, response.statusText);
          
          if (!response.ok) {
            console.error('❌ PDF inaccessible:', response.status, response.statusText);
          } else {
            console.log('✅ PDF accessible');
          }
        } catch (error) {
          console.error('❌ Erreur lors du test d\'accessibilité:', error);
        }
      }
    };
    
    checkPdfAccessibility();
  }, [pdfUrl, originalPdfUrl]);

  // Détecter si on est sur mobile/tablette
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation par flèches clavier, tactile et souris
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPageNumber((p) => Math.max(1, p - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale(prev => Math.min(prev + 0.1, 2));
      } else if (e.key === '-') {
        e.preventDefault();
        setScale(prev => Math.max(prev - 0.1, 0.5));
      }
    };

    // Gestion du swipe tactile et drag souris
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isTouch = false;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      isDragging = true;
      isTouch = 'touches' in e;
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      
      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Vérifier si c'est un mouvement horizontal
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (isTouch) {
          e.preventDefault();
        }
        if (diffX > 0) {
          setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));
        } else {
          setPageNumber((p) => Math.max(1, p - 1));
        }
        isDragging = false;
      }
    };

    const handleEnd = () => {
      isDragging = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [numPages]);

  const handlePrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const handleNext = () => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'ACTL-Catalogue-Formations.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setPageNumber(1);
  };

  return (
    <section id="catalogue-section" className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 pt-8 pb-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            id="catalogue-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6"
            whileInView={{ 
              scale: [1, 1.05, 1],
              textShadow: [
                "0 0 0px rgba(34, 197, 94, 0)",
                "0 0 20px rgba(34, 197, 94, 0.5)",
                "0 0 0px rgba(34, 197, 94, 0)"
              ]
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut",
              repeat: 1,
              repeatDelay: 2
            }}
          >
            {catalogueTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {catalogueDescription}
          </motion.p>
        </div>

        {/* PDF Viewer */}
        <div className="relative max-w-6xl mx-auto">
          <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">Catalogue de Formations ACTL</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="relative min-h-[70vh] bg-gray-50">
                {error ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
                    <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {datapJson?.catalogueFormation?.error?.title || "Erreur de chargement"}
                    </h3>
                    <p className="text-gray-600 mb-6 text-center max-w-md">
                      {datapJson?.catalogueFormation?.error?.details || "Impossible de charger le catalogue PDF"}
                    </p>
                    <div className="flex gap-4">
                      <Button onClick={handleRetry} variant="outline">
                        <RotateCw className="h-4 w-4 mr-2" />
                        {datapJson?.catalogueFormation?.error?.retryText || "Réessayer"}
                      </Button>
                      <Button onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        {datapJson?.catalogueFormation?.error?.downloadText || "Télécharger"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Navigation Controls */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handlePrev}
                          disabled={pageNumber <= 1}
                          variant="outline"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleNext}
                          disabled={!numPages || pageNumber >= numPages}
                          variant="outline"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                          variant="outline"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          -
                        </Button>
                      </motion.div>
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">
                        {Math.round(scale * 100)}%
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
                          variant="outline"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          +
                        </Button>
                      </motion.div>
                    </div>

                    {/* Page Info */}
                    {numPages && (
                      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">
                        Page {pageNumber} sur {numPages}
                      </div>
                    )}

                    {/* PDF Document */}
                    {pdfUrl || originalPdfUrl ? (
                      <div className="flex justify-center p-8">
                        <Document
                          file={pdfUrl || originalPdfUrl}
                          {...getPdfJsConfig(pdfUrl || originalPdfUrl)}
                          loading={
                          <div className="flex flex-col items-center justify-center min-h-[60vh]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                            <p className="text-gray-600">
                              {isPdfLoading ? "Optimisation pour gestionnaires de téléchargement..." : (datapJson?.catalogueFormation?.loading?.title || "Chargement du catalogue...")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {detectDownloadManager() ? "Mode compatibilité IDM activé" : (datapJson?.catalogueFormation?.loading?.subtitle || "Préparation de votre catalogue")}
                            </p>
                          </div>
                        }
                        error={
                          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                            <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Problème de chargement</h3>
                            <p className="text-gray-600 mb-4">
                              {pdfError || "Le catalogue PDF ne peut pas être affiché."}
                            </p>
                            {detectDownloadManager() && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-blue-800">
                                  <strong>IDM/Gestionnaire de téléchargement détecté :</strong><br/>
                                  Certains gestionnaires interfèrent avec l'affichage des PDFs.
                                </p>
                              </div>
                            )}
                            <div className="flex gap-4">
                              <Button onClick={reload} variant="outline" className="flex items-center gap-2">
                                <RotateCw className="w-4 h-4" />
                                Réessayer
                              </Button>
                              <Button onClick={() => window.open(originalPdfUrl, '_blank')} className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Télécharger le PDF
                              </Button>
                            </div>
                          </div>
                        }
                        onLoadSuccess={({ numPages }) => {
                          console.log('✅ PDF chargé avec succès:', numPages, 'pages');
                          setNumPages(numPages);
                          setError(null);
                          setIsLoading(false);
                        }}
                        onLoadError={(err) => {
                          console.error('❌ Erreur chargement PDF:', err);
                          setError(err.message || 'Erreur inconnue');
                          setIsLoading(false);
                        }}
                        className="w-full flex flex-col items-center"
                      >
                        <motion.div
                          key={pageNumber}
                          initial={{ opacity: 0, x: 20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.95 }}
                          transition={{ 
                            duration: 0.4, 
                            ease: "easeInOut",
                            type: "spring",
                            stiffness: 100
                          }}
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={isMobile ? 350 : 700}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-xl rounded-xl overflow-hidden border-2 border-green-200 hover:border-green-300 transition-all duration-300"
                          />
                        </motion.div>
                      </Document>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                        <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun PDF disponible</h3>
                        <p className="text-gray-600 mb-4">
                          Aucun fichier PDF n'est configuré pour le catalogue de formations.
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>URL attendue: {originalPdfUrl}</p>
                          <p>Vérifiez la configuration dans le dashboard.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 text-gray-500"
          >
            <p className="text-sm">
              {isMobile ? 
                "Glissez pour naviguer • Utilisez les flèches pour naviguer" :
                "Glissez avec la souris pour naviguer • Utilisez les flèches du clavier • +/- pour zoomer • Téléchargez le catalogue"
              }
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FormationCatalogue; 