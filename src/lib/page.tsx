// pages.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Navbar,
  Footer,
  Hero,
  FeaturedFormations,
  GallerySection,
  FacilitiesSection,
  EventsSection,
  ContactCTA
} from "./Acceuil";
import { FileText, Download, AlertCircle, CheckCircle, Truck, Briefcase, Calculator, Users, Scale, Wrench, Calendar, MapPin, Clock, Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import data from '../data.json';
import datap from '../datap.json';

// Configuration ESSENTIELLE du worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/rachef-uploads/pdf.worker.min.js`;

export const CatalogueFormation = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const getPdfUrl = () => {
    const relativePath = data.catalogueFormation.pdfUrl;
    const absolutePath = `${window.location.origin}${data.catalogueFormation.pdfUrl}`;
    const testPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    return [relativePath, absolutePath, testPdf][0];
  };

  const pdfUrl = getPdfUrl();

  useEffect(() => {
    const loadPdf = async () => {
      setStatus('loading');
      setErrorDetails('');
      
      try {
        console.log('Tentative de chargement du PDF:', pdfUrl);
        
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Fichier non trouvé (${response.status}): ${response.statusText}`);
        }
        
        console.log('Fichier PDF trouvé, chargement avec PDF.js...');
        
        const pdf = await pdfjs.getDocument({
          url: pdfUrl,
          disableAutoFetch: true,
          disableStream: true,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.3.93/cmaps/',
          cMapPacked: true,
        }).promise;
        
        console.log('PDF chargé avec succès, nombre de pages:', pdf.numPages);
        setNumPages(pdf.numPages);
        setStatus('success');
      } catch (error) {
        console.error('Échec du chargement:', error);
        setErrorDetails(error instanceof Error ? error.message : 'Erreur inconnue');
        setStatus('error');
      }
    };

    loadPdf();
  }, [pdfUrl]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setContainerWidth(containerWidth * 0.95);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => numPages && setPageNumber(prev => Math.min(prev + 1, numPages));

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <main className="relative z-10">
        <motion.div 
          ref={containerRef}
          className="flex items-center justify-center h-full w-full p-4"
          style={{ minHeight: '70vh' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900/90 to-slate-800/90 backdrop-blur-xl border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="text-white/90 font-medium">
                  {data.catalogueFormation.title} - {data.catalogueFormation.description}
                </div>
              </div>
              
              {status === 'success' && (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <span className="text-white/90 font-medium">
                      Page {pageNumber} / {numPages}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative min-h-[70vh] bg-gradient-to-br from-gray-900/50 to-green-900/30">
              {status === 'error' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full p-12 text-center"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-8 shadow-2xl"
                  >
                    <AlertCircle className="h-12 w-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-white mb-6">{data.catalogueFormation.error.title}</h3>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-lg text-left mb-10 border border-red-300/20">
                    <h4 className="font-bold mb-3 text-red-300">{data.catalogueFormation.error.details}</h4>
                    <p className="text-sm text-red-200 mb-6 font-mono bg-red-900/30 p-3 rounded-lg">{errorDetails}</p>
                    
                    <h4 className="font-bold mb-3 text-white/90">Solutions rapides :</h4>
                    <ol className="list-decimal pl-6 space-y-2 text-white/80 text-sm">
                      {data.catalogueFormation.error.solutions.map((solution, index) => (
                        <li key={index}>{solution}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl px-8 py-4 text-lg rounded-xl"
                        asChild
                      >
                        <a href={pdfUrl} download="ACTL-Catalogue-Formations.pdf">
                          <Download className="h-6 w-6 mr-3" />
                          {data.catalogueFormation.error.downloadText}
                        </a>
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-xl"
                      >
                        <RotateCw className="h-6 w-6 mr-3" />
                        {data.catalogueFormation.error.retryText}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : status === 'loading' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20"
                >
                  <div className="relative mb-8">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.3, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                      }}
                      className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <FileText className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-transparent border-t-emerald-400/40 border-r-green-400/40 rounded-full"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-semibold text-white mb-3">{data.catalogueFormation.loading.title}</p>
                    <p className="text-white/70">{data.catalogueFormation.loading.subtitle}</p>
                  </motion.div>
                  
                  <div className="mt-8 w-80 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    {numPages && numPages > 1 && (
                      <>
                        <motion.button
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: pageNumber > 1 ? 0.9 : 0.4, x: 0 }}
                          whileHover={{ 
                            scale: pageNumber > 1 ? 1.1 : 1, 
                            x: pageNumber > 1 ? -5 : 0
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-6 w-6 text-white" />
                        </motion.button>
                        
                        <motion.button
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: pageNumber < numPages ? 0.9 : 0.4, x: 0 }}
                          whileHover={{ 
                            scale: pageNumber < numPages ? 1.1 : 1, 
                            x: pageNumber < numPages ? 5 : 0
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-6 w-6 text-white" />
                        </motion.button>
                      </>
                    )}
                  </AnimatePresence>

                  <motion.div 
                    ref={containerRef}
                    className="flex items-center justify-center h-full w-full p-4"
                    onPanEnd={(event, info) => {
                      const threshold = 50;
                      if (info.offset.x > threshold && pageNumber > 1) {
                        goToPrevPage();
                      } else if (info.offset.x < -threshold && numPages && pageNumber < numPages) {
                        goToNextPage();
                      }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pageNumber}
                        initial={{ 
                          opacity: 0, 
                          scale: 0.8,
                          x: 100,
                          rotateY: 15
                        }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          x: 0,
                          rotateY: 0
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.8,
                          x: -100,
                          rotateY: -15
                        }}
                        transition={{ 
                          duration: 0.6,
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                        className="relative max-w-full"
                      >
                        <Document
                          file={pdfUrl}
                          loading={
                            <div className="flex items-center justify-center h-96">
                              <div className="text-white/60 text-lg">Préparation du catalogue...</div>
                            </div>
                          }
                          error={<div className="text-red-400 text-center p-8">Erreur d'affichage du PDF</div>}
                          onLoadSuccess={({ numPages }) => {
                            console.log('Document chargé avec succès:', numPages, 'pages');
                            setNumPages(numPages);
                          }}
                          onLoadError={(error) => {
                            console.error('Erreur de chargement du document:', error);
                            setStatus('error');
                            setErrorDetails('Impossible de charger le document PDF');
                          }}
                        >
                          <Page 
                            pageNumber={pageNumber} 
                            width={Math.min(containerRef.current?.offsetWidth || 800, 1200) * 0.9}
                            height={Math.min(containerRef.current?.offsetHeight || 800, 1000) * 0.8}
                            className="shadow-xl rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onLoadSuccess={() => {
                              console.log('Page', pageNumber, 'chargée avec succès');
                            }}
                            onLoadError={(error) => {
                              console.error('Erreur de chargement de la page:', error);
                            }}
                          />
                        </Document>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="pb-16"
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="flex flex-wrap justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl px-10 py-5 text-xl rounded-2xl border border-white/20 backdrop-blur-sm"
                  asChild
                >
                  <a href={pdfUrl} download="ACTL-Catalogue-Formations.pdf">
                    <Download className="h-6 w-6 mr-3" />
                    {data.catalogueFormation.downloadButton}
                  </a>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl rounded-2xl shadow-xl"
                  asChild
                > 
                  <Link to="/contact" className="flex items-center text-black">
                    <Mail className="h-6 w-6 mr-3 text-black" />
                    {data.catalogueFormation.contactButton}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export const CommerceFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.commerceFormation.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.commerceFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.commerceFormation.image} 
                  alt={data.commerceFormation.title} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Détails du programme</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Structure du programme</h3>
                <ul className="space-y-2">
                  {data.commerceFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                <ul className="space-y-2">
                  {data.commerceFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                <ul className="space-y-2">
                  {data.commerceFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.commerceFormation.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.commerceFormation.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.commerceFormation.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const ConduiteFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.conduiteFormation.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.conduiteFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.conduiteFormation.image} 
                  alt={data.conduiteFormation.title} 
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Détails du programme</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Structure du programme</h3>
                <ul className="space-y-2">
                  {data.conduiteFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                <ul className="space-y-2">
                  {data.conduiteFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                <ul className="space-y-2">
                  {data.conduiteFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.conduiteFormation.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.conduiteFormation.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.conduiteFormation.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous vous contacterons bientôt.",
        duration: 5000,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{data.contact.title}</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              {data.contact.description}
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {data.contact.form.name}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Votre nom"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {data.contact.form.email}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {data.contact.form.phone}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Votre numéro de téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {data.contact.form.subject}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Sujet de votre message"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {data.contact.form.message}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Votre message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-actl-green hover:bg-actl-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? data.contact.form.submitting : data.contact.form.submit}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Informations de contact</h2>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-gray-600">{data.contact.contactInfo.address}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Téléphone/Fax</p>
                        <p className="text-gray-600">{data.contact.contactInfo.phone}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{data.contact.contactInfo.email}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Heures d'ouverture</p>
                        <p className="text-gray-600">{data.contact.contactInfo.hours}</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <Building2 className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                    <h3 className="font-medium">Nos centres</h3>
                  </div>
                  <div className="pl-8 grid grid-cols-2 gap-2">
                    {data.contact.centers.map((centre, index) => (
                      <div key={index} className="py-1">
                        <p className="text-gray-700">{centre}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <Users className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                    <h3 className="font-medium">Équipe commerciale</h3>
                  </div>
                  <ul className="space-y-4 pl-8">
                    {data.contact.commercialTeam.map((member, index) => (
                      <li key={index}>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <div className="aspect-w-16 aspect-h-9 h-64 bg-gray-100 rounded-lg overflow-hidden border">
                <a 
                  href="https://www.google.com/maps/place/Academy+Transport+And+Logistics/@36.7539204,3.2119074,17z/data=!3m1!4b1!4m6!3m5!1s0x128e4e30bf56ebff:0x55bc2b233993eeb4!8m2!3d36.7539204!4d3.2093325!16s%2Fg%2F11csbc8mb0?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-actl-green hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="h-8 w-8 mb-3 text-actl-green" />
                  <p className="text-center text-sm font-medium mb-2">
                    Voir sur Google Maps
                  </p>
                  <p className="text-center text-xs text-gray-500 px-4">
                    Academy Transport And Logistics<br />
                    {data.contact.contactInfo.address}
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const DiagnosticFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.diagnosticFormation.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.diagnosticFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.diagnosticFormation.image} 
                  alt={data.diagnosticFormation.title} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Détails du programme</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Structure du programme</h3>
                <ul className="space-y-2">
                  {data.diagnosticFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                <ul className="space-y-2">
                  {data.diagnosticFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                <ul className="space-y-2">
                  {data.diagnosticFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">{data.diagnosticFormation.equipmentTitle}</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              {data.diagnosticFormation.equipmentDescription}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {data.diagnosticFormation.equipmentImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Équipement ${index + 1}`} 
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.diagnosticFormation.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.diagnosticFormation.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.diagnosticFormation.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const Evenements = () => {
  const events = data.events?.items || [];
  const pageContent = data.evenements || {};
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{pageContent.title}</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              {pageContent.description}
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="section-title">Tous les événements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-w-16 aspect-h-9 relative h-56">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-actl-green hover:bg-actl-green/90">Événement phare</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contact">Plus d'informations</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Calendrier des événements</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Consultez notre calendrier pour connaître les dates des prochains événements et formations.
            </p>
            <Card className="p-6">
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 mr-2 text-actl-green" />
                <p className="text-lg font-medium">Événements à venir</p>
              </div>
              <div className="space-y-6">
                {(pageContent.calendar || []).map((event, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <Badge variant="outline" className="border-actl-green text-actl-green">
                        {event.date}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{pageContent.cta?.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {pageContent.cta?.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{pageContent.cta?.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const FinanceFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.financeFormation.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.financeFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.financeFormation.image} 
                  alt={data.financeFormation.title} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Détails du programme</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Durée et structure</h3>
                <ul className="space-y-2">
                  {data.financeFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Méthodes d'enseignement</h3>
                <ul className="space-y-2">
                  {data.financeFormation.teachingMethods.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                <ul className="space-y-2">
                  {data.financeFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Certifications</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Nos formations mènent à des certifications professionnelles reconnues dans l'industrie.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {data.financeFormation.certifications.map((cert, index) => (
                <Card key={index} className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Formation en action</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Découvrez notre approche pratique de la formation professionnelle.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {data.financeFormation.galleryImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Formation ${index + 1}`} 
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.financeFormation.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.financeFormation.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.financeFormation.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const FormationProfessionnelle = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.formationProfessionnelle.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.formationProfessionnelle.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.formationProfessionnelle.image} 
                  alt={data.formationProfessionnelle.title} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Nos domaines de formation</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Nous proposons des formations professionnelles dans plusieurs secteurs d'activité pour répondre aux besoins du marché du travail.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.formationProfessionnelle.trainingDomains.map((domain, index) => {
              const IconComponent = domain.icon === "Briefcase" ? Briefcase :
                                  domain.icon === "Calculator" ? Calculator :
                                  domain.icon === "Truck" ? Truck :
                                  domain.icon === "Users" ? Users :
                                  domain.icon === "Scale" ? Scale : Wrench;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-actl-green" />
                    <h3 className="text-xl font-semibold mb-3">{domain.title}</h3>
                    <p className="text-gray-600">{domain.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Détails du programme</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Durée et structure</h3>
                  <ul className="space-y-2">
                    {data.formationProfessionnelle.programStructure.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Méthodes d'enseignement</h3>
                  <ul className="space-y-2">
                    {data.formationProfessionnelle.teachingMethods.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                  <ul className="space-y-2">
                    {data.formationProfessionnelle.careerOpportunities.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Certifications</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Nos formations mènent à des certifications professionnelles reconnues dans l'industrie.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {data.formationProfessionnelle.certifications.map((cert, index) => (
                <Card key={index} className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Formation en action</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Découvrez notre approche pratique de la formation professionnelle.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {data.formationProfessionnelle.galleryImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Formation ${index + 1}`} 
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.formationProfessionnelle.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.formationProfessionnelle.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.formationProfessionnelle.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const Marches = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{data.marches.title}</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              {data.marches.description}
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="section-title">Marchés et consultations en cours</h2>
          
          <div className="mt-8">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Titre</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Date de publication</TableHead>
                      <TableHead>Date de clôture</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Aucun marché ou consultation en cours actuellement
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">{data.marches.info.title}</h3>
                <p className="text-yellow-700">
                  {data.marches.info.content}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Comment participer ?</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Suivez ces étapes pour participer à nos consultations et marchés publics.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.marches.howToParticipate.map((step, index) => {
                const IconComponent = step.icon === "Download" ? Download :
                                    step.icon === "FileText" ? FileText : Calendar;
                return (
                  <Card key={index} className="text-center p-6 h-full">
                    <div className="h-12 w-12 bg-actl-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-actl-green" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Documents et formulaires</h2>
          <p className="text-gray-600 mb-8">
            Téléchargez les documents nécessaires pour participer à nos consultations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.marches.documents.map((doc, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-actl-light-green rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <FileText className="h-5 w-5 text-actl-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {doc.description}
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Questions fréquentes</h2>
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="space-y-6">
                {data.marches.faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                    {index < data.marches.faqs.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.marches.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.marches.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.marches.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const MecaniqueFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.mecaniqueFormation.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.mecaniqueFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.mecaniqueFormation.image} 
                  alt={data.mecaniqueFormation.title} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Détails du programme</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Structure du programme</h3>
                <ul className="space-y-2">
                  {data.mecaniqueFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                <ul className="space-y-2">
                  {data.mecaniqueFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                <ul className="space-y-2">
                  {data.mecaniqueFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">{data.mecaniqueFormation.workshopTitle}</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              {data.mecaniqueFormation.workshopDescription}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {data.mecaniqueFormation.workshopImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Atelier ${index + 1}`} 
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.mecaniqueFormation.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.mecaniqueFormation.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.mecaniqueFormation.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-actl-green mb-4">{data.notFound.title}</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-6">{data.notFound.subtitle}</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {data.notFound.description}
          </p>
          <Button asChild className="bg-actl-green hover:bg-actl-green/90">
            <Link to="/">{data.notFound.buttonText}</Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const RHFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.rhFormation.title}</h1>
                <p className="text-gray-600 mb-6">
                  {data.rhFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-actl-green hover:bg-actl-green/90">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src={data.rhFormation.image} 
                  alt={data.rhFormation.title} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title">Détails du programme</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Durée et structure</h3>
                <ul className="space-y-2">
                  {data.rhFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                <ul className="space-y-2">
                  {data.rhFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Débouchés professionnels</h3>
                <ul className="space-y-2">
                  {data.rhFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-actl-green text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{data.rhFormation.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {data.rhFormation.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{data.rhFormation.cta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedFormations />
        <GallerySection />
        <FacilitiesSection />
        <EventsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};