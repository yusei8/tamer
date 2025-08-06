// pages.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import FormationCatalogue from "@/components/sections/FormationCatalogue";
import { FileText, Download, AlertCircle, CheckCircle, Truck, Briefcase, Calculator, Users, Scale, Wrench, Calendar, MapPin, Clock, Building2, ExternalLink, Mail, Phone, ArrowRight, Settings, Wallet, Upload, Search, Shield, AlertTriangle, Award, Video, Play } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import toast from 'react-hot-toast';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDashboardStore } from '@/stores/dashboardStore';
import dataJson from './data.json';
import datapJson from './datap.json';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Configuration ESSENTIELLE du worker P
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/rachef-uploads/pdf.worker.min.js`;

// Fonction utilitaire pour nettoyer le HTML (supprime <font> et attributs color)
function cleanHtml(html: string): string {
  if (!html) return '';
  html = html.replace(/<font[^>]*>/gi, '');
  html = html.replace(/<\/font>/gi, '');
  html = html.replace(/ color=["'][^"']*["']/gi, '');
  return html;
}

export const CatalogueFormation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <Navbar />
      <FormationCatalogue 
        title="Catalogue de Formations ACTL"
        description="Découvrez notre gamme complète de formations professionnelles conçues pour développer vos compétences et accélérer votre carrière."
      />
      <Footer />
    </div>
  );
};

export const CommerceFormation = () => {
  const { datapJson } = useDashboardStore();

  // Protection contre les données non chargées
  if (!datapJson || !datapJson.commerceFormation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const formation = datapJson.commerceFormation;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                  <Briefcase className="h-4 w-4 mr-2 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">Formation Professionnelle</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {formation.title}
                  </span>
                </h1>
                
                <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                  {formation.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                    <Link to="/contact" className="flex items-center">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={formation.image}
                    alt={formation.title}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Détails du programme
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Un programme complet conçu pour vous donner toutes les compétences nécessaires dans le domaine du commerce.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Structure du programme
                </h3>
                <ul className="space-y-3">
                  {formation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Contenu du cours
                </h3>
                <ul className="space-y-3">
                  {formation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Opportunités de carrière
                </h3>
                <ul className="space-y-3">
                  {formation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {formation.cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              {formation.cta.description}
            </p>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/contact">{formation.cta.buttonText}</Link>
            </Button>
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                  <Truck className="h-4 w-4 mr-2 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">Formation Professionnelle</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {datapJson.conduiteFormation.title}
                  </span>
                </h1>
                <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                  {datapJson.conduiteFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                    <Link to="/contact" className="flex items-center">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={datapJson.conduiteFormation.image}
                    alt={datapJson.conduiteFormation.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Détails du programme
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Un programme complet pour devenir un professionnel de la conduite.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Structure du programme
                </h3>
                <ul className="space-y-3">
                  {datapJson.conduiteFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Contenu du cours
                </h3>
                <ul className="space-y-3">
                  {datapJson.conduiteFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Débouchés professionnels
                </h3>
                <ul className="space-y-3">
                  {datapJson.conduiteFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {datapJson.conduiteFormation.cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              {datapJson.conduiteFormation.cta.description}
            </p>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/contact">{datapJson.conduiteFormation.cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/save-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message envoyé avec succès",
          description: "Nous vous contacterons dans les plus brefs délais.",
          duration: 5000,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section Amélioré */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
              <Mail className="h-4 w-4 mr-2 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">Contactez-nous</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                {dataJson.contact.title}
              </span>
            </h1>
            <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
              {dataJson.contact.description}
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-emerald-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais</p>
                </div>
              
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {dataJson.contact.form.name}
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
                      {dataJson.contact.form.email}
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
                    {dataJson.contact.form.phone}
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
                    {dataJson.contact.form.subject}
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
                    {dataJson.contact.form.message}
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
                
                {/* Checkbox conformité loi 18-07 Algérie */}
                <div className="flex items-start space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="privacy-consent"
                    required
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded transition-colors duration-200"
                  />
                                      <label htmlFor="privacy-consent" className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-emerald-700">{(dataJson.contact as any)?.privacyConsent?.title || "J'accepte la loi 18-07 en Algérie"}</span> {(dataJson.contact as any)?.privacyConsent?.description || "concernant la protection des données personnelles. Mes données sont sécurisées sur un serveur 100% algérien qui respecte la réglementation nationale. Mes informations ne seront jamais divulguées et restent entièrement confidentielles."}
                    </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? dataJson.contact.form.submitting : dataJson.contact.form.submit}
                </Button>
                              </form>
              </div>
            </div>
            
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Informations de contact
                </h2>
                <p className="text-gray-600">Toutes les façons de nous joindre</p>
              </div>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-gray-600">{dataJson.contact.contactInfo.address}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Téléphone/Fax</p>
                        <p className="text-gray-600">{dataJson.contact.contactInfo.phone}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{dataJson.contact.contactInfo.email}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-actl-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Heures d'ouverture</p>
                        <p className="text-gray-600">{dataJson.contact.contactInfo.hours}</p>
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
                    {dataJson.contact.centers.map((centre, index) => (
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
                    <h3 className="font-medium">{datapJson?.contactTeamTitle || "Équipe commerciale"}</h3>
                  </div>
                  <ul className="space-y-4 pl-8">
                    {dataJson.contact.commercialTeam.map((member, index) => (
                      <li key={index}>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* MAP DE OUF ! 🗺️ */}
              <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Header de la map */}
                    <div className="p-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 animate-bounce" />
                        <div>
                          <h3 className="font-bold text-lg">Voir sur Google Maps</h3>
                          <p className="text-emerald-100">Academy Transport And Logistics</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Map iframe ZOOMÉE ! */}
                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-blue-100 relative overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.5749077649287!2d3.2119074!3d36.7539204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e4e30bf56ebff%3A0x55bc2b233993eeb4!2sAcademy%20Transport%20And%20Logistics!5e0!3m2!1sfr!2s!4v1673000000000!5m2!1sfr!2s&z=18"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                        title="ACTL Location"
                      />
                      
                      {/* Overlay avec bouton d'action */}
                      <div className="absolute bottom-4 right-4">
                        <a 
                          href="https://www.google.com/maps/place/Academy+Transport+And+Logistics/@36.7539204,3.2119074,17z/data=!3m1!4b1!4m6!3m5!1s0x128e4e30bf56ebff:0x55bc2b233993eeb4!8m2!3d36.7539204!4d3.2093325!16s%2Fg%2F11csbc8mb0?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ouvrir dans Maps
                        </a>
                      </div>
                    </div>
                    
                    {/* Footer de la map */}
                    <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span className="opacity-90">{dataJson.contact.contactInfo.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                  <Settings className="h-4 w-4 mr-2 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">Formation Professionnelle</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {datapJson.diagnosticFormation.title}
                  </span>
                </h1>
                <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                  {datapJson.diagnosticFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                    <Link to="/contact" className="flex items-center">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={datapJson.diagnosticFormation.image}
                    alt={datapJson.diagnosticFormation.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Détails du programme
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Maîtrisez le diagnostic automobile avec des outils et méthodes modernes.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Structure du programme
                </h3>
                <ul className="space-y-3">
                  {datapJson.diagnosticFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Contenu du cours
                </h3>
                <ul className="space-y-3">
                  {datapJson.diagnosticFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Débouchés professionnels
                </h3>
                <ul className="space-y-3">
                  {datapJson.diagnosticFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Equipment Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">{datapJson.diagnosticFormation.equipmentTitle}</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              {datapJson.diagnosticFormation.equipmentDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {datapJson.diagnosticFormation.equipmentImages.map((image, index) => (
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
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {datapJson.diagnosticFormation.cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              {datapJson.diagnosticFormation.cta.description}
            </p>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/contact">{datapJson.diagnosticFormation.cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const Events = () => {
  // Ajouter du CSS pour améliorer les animations de scroll
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: auto; /* Désactivé pour nos animations custom */
      }
      * {
        will-change: scroll-position; /* Optimisation GPU */
      }
      [data-section] {
        scroll-margin-top: 80px;
        transition: all 0.2s ease-out;
        transform-origin: center center;
      }
      [data-section]:target {
        animation: highlightSection 0.6s ease-out;
      }
      @keyframes highlightSection {
        0% { 
          transform: scale(1) translateY(5px); 
          opacity: 0.95;
        }
        50% { 
          transform: scale(1.005) translateY(0px); 
          opacity: 1;
        }
        100% { 
          transform: scale(1) translateY(0px); 
          opacity: 1;
        }
      }
      /* Optimisations pour performance */
      body {
        overflow-anchor: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!datapJson.evenements) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 mx-auto mb-3"></div>
          <p className="text-white text-lg font-medium">Chargement des événements...</p>
        </div>
      </div>
    );
  }
  const events = datapJson.evenements.events || [];
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section Redesigné */}
        <div className="relative min-h-[60vh] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden">
          {/* Animations de fond */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in-up">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20">
                  🎉 {events.length} Événements disponibles
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 animate-fade-in-up delay-200">
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  {datapJson.evenements.title}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-400">
                {datapJson.evenements.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-600">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    const calendarSection = document.querySelector('[data-section="calendar"]');
                    if (calendarSection) {
                      // Animation rapide et fluide
                      const startY = window.pageYOffset;
                      const targetY = calendarSection.offsetTop - 80; // Offset pour un meilleur positionnement
                      const distance = targetY - startY;
                      const duration = Math.min(800, Math.max(400, Math.abs(distance) * 0.8)); // 0.4-0.8 secondes
                      
                      let startTime = null;
                      
                      // Fonction d'easing plus fluide et rapide
                      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
                      
                      const animateScroll = (currentTime) => {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);
                        const ease = easeOutQuart(progress);
                        
                        window.scrollTo(0, startY + distance * ease);
                        
                        if (progress < 1) {
                          requestAnimationFrame(animateScroll);
                        }
                      };
                      
                      requestAnimationFrame(animateScroll);
                    }
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Voir le calendrier
                </Button>
                                 <Button 
                   size="lg" 
                   variant="outline" 
                   className="border-white/30 text-black hover:bg-white hover:text-black backdrop-blur-md px-6 py-3 rounded-full transition-all duration-300"
                   onClick={() => {
                                           const eventsSection = document.querySelector('[data-section="events"]');
                      if (eventsSection) {
                        // Animation rapide et fluide
                        const startY = window.pageYOffset;
                        const targetY = eventsSection.offsetTop - 80; // Offset pour un meilleur positionnement
                        const distance = targetY - startY;
                        const duration = Math.min(800, Math.max(400, Math.abs(distance) * 0.8)); // 0.4-0.8 secondes
                        
                        let startTime = null;
                        
                        // Fonction d'easing plus fluide et rapide
                        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
                        
                        const animateScroll = (currentTime) => {
                          if (startTime === null) startTime = currentTime;
                          const timeElapsed = currentTime - startTime;
                          const progress = Math.min(timeElapsed / duration, 1);
                          const ease = easeOutQuart(progress);
                          
                          window.scrollTo(0, startY + distance * ease);
                          
                          if (progress < 1) {
                            requestAnimationFrame(animateScroll);
                          }
                        };
                        
                        requestAnimationFrame(animateScroll);
                      }
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Nos événements
                </Button>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/50 rounded-full mt-1 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Événement Phare - Design Moderne */}
        {events[0] && (
          <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mb-3">
                  ⭐ Événement Phare
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Ne manquez pas notre
                  <span className="text-transparent bg-gradient-to-r from-green-600 to-green-800 bg-clip-text"> événement principal</span>
                </h2>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <div className="mb-4">
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-1 text-xs font-medium">
                        🏆 Événement Premium
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                      {events[0]?.title}
                    </h3>
                    
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      {events[0]?.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm font-semibold text-gray-800">{events[0]?.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs text-gray-500 font-medium">Lieu</p>
                          <p className="text-sm font-semibold text-gray-800">{events[0]?.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <span className="mr-2">🎯</span>
                      S'inscrire maintenant
                    </Button>
                  </div>
                  
                  <div className="relative h-48 lg:h-full min-h-[300px] overflow-hidden">
                    <img 
                      src={events[0]?.image} 
                      alt={events[0]?.title} 
                      className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tous les Événements - Grille Moderne */}
        <div className="py-16 bg-white" data-section="events">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Tous nos
                <span className="text-transparent bg-gradient-to-r from-green-600 to-green-800 bg-clip-text"> événements</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez notre sélection complète d'événements conçus pour enrichir vos compétences et élargir votre réseau professionnel.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div key={event.id} className="group bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    
                    {event.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-2 py-1 text-xs">
                          ⭐ Phare
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center space-x-2 text-white text-xs">
                        <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                      {event.description}
                    </p>
                    <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-lg py-2 font-medium transition-all duration-300 text-sm" asChild>
                      <Link to="/contact">
                        <span className="mr-2">📋</span>
                        Plus d'informations
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendrier - Timeline Interactive */}
        <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100" data-section="calendar">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Calendrier des
                <span className="text-transparent bg-gradient-to-r from-green-600 to-green-800 bg-clip-text"> événements</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Planifiez votre participation à nos événements et ne manquez aucune opportunité de développement.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center bg-gradient-to-r from-green-100 to-green-200 rounded-xl px-4 py-2">
                  <Clock className="h-6 w-6 mr-2 text-green-600" />
                  <p className="text-lg font-bold text-gray-800">Événements à venir</p>
                </div>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-green-600"></div>
                
                <div className="space-y-6">
                  {datapJson.evenements.calendar.map((event, index) => (
                    <div key={index} className="relative flex items-start group">
                      {/* Timeline dot */}
                      <div className="absolute left-5 w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-3 border-white shadow-md group-hover:scale-125 transition-transform duration-300"></div>
                      
                      {/* Content */}
                      <div className="ml-12 bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01] w-full">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                              {event.description}
                            </p>
                          </div>
                          <div className="mt-3 lg:mt-0 lg:ml-4">
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 text-xs font-medium rounded-lg shadow-md">
                              📅 {event.date}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Final - Design Impactant */}
        <div className="relative py-16 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20">
                  🚀 Rejoignez-nous
                </span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {datapJson.evenements.cta.title}
              </h2>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {datapJson.evenements.cta.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold" asChild>
                  <Link to="/contact">
                    <span className="mr-2">📞</span>
                    {datapJson.evenements.cta.buttonText}
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-black hover:bg-white hover:text-black backdrop-blur-md px-8 py-3 rounded-full font-bold transition-all duration-300"
                  onClick={() => {
                    const eventsSection = document.querySelector('[data-section="events"]');
                    if (eventsSection) {
                      // Animation rapide et fluide
                      const startY = window.pageYOffset;
                      const targetY = eventsSection.offsetTop - 80; // Offset pour un meilleur positionnement
                      const distance = targetY - startY;
                      const duration = Math.min(800, Math.max(400, Math.abs(distance) * 0.8)); // 0.4-0.8 secondes
                      
                      let startTime = null;
                      
                      // Fonction d'easing plus fluide et rapide
                      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
                      
                      const animateScroll = (currentTime) => {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);
                        const ease = easeOutQuart(progress);
                        
                        window.scrollTo(0, startY + distance * ease);
                        
                        if (progress < 1) {
                          requestAnimationFrame(animateScroll);
                        }
                      };
                      
                      requestAnimationFrame(animateScroll);
                    }
                  }}
                >
                  <span className="mr-2">📧</span>
                  Recevoir les actualités
                </Button>
              </div>
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                  <Wallet className="h-4 w-4 mr-2 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">Formation Professionnelle</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {datapJson.financeFormation.title}
                  </span>
                </h1>
                <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                  {datapJson.financeFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                    <Link to="/contact" className="flex items-center">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={datapJson.financeFormation.image}
                    alt={datapJson.financeFormation.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Détails du programme
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Maîtrisez la finance et la comptabilité avec une formation complète et pratique.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Durée et structure
                </h3>
                <ul className="space-y-3">
                  {datapJson.financeFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Méthodes d'enseignement
                </h3>
                <ul className="space-y-3">
                  {datapJson.financeFormation.teachingMethods.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Débouchés professionnels
                </h3>
                <ul className="space-y-3">
                  {datapJson.financeFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Certifications Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Certifications</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Nos formations mènent à des certifications professionnelles reconnues dans l'industrie.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {datapJson.financeFormation.certifications.map((cert, index) => (
                <Card key={index} className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
        {/* Gallery Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">Formation en action</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Découvrez notre approche pratique de la formation professionnelle.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {datapJson.financeFormation.galleryImages.map((image, index) => (
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
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {datapJson.financeFormation.cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              {datapJson.financeFormation.cta.description}
            </p>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/contact">{datapJson.financeFormation.cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const FormationProfessionnelle = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{datapJson.formationProfessionnelle.title}</h1>
                <p className="text-lg text-gray-600 mb-12">
                  {datapJson.formationProfessionnelle.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
                  src={datapJson.formationProfessionnelle.image}
                  alt={datapJson.formationProfessionnelle.title}
                  className="w-full h-64 object-cover rounded-lg"
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
            {datapJson.formationProfessionnelle.trainingDomains.map((domain, index) => {
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
                    {datapJson.formationProfessionnelle.programStructure.map((item, index) => (
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
                    {datapJson.formationProfessionnelle.teachingMethods.map((item, index) => (
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
                    {datapJson.formationProfessionnelle.careerOpportunities.map((item, index) => (
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
              {datapJson.formationProfessionnelle.certifications.map((cert, index) => (
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
              {datapJson.formationProfessionnelle.galleryImages.map((image, index) => (
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
              <h2 className="text-3xl font-bold mb-4">{datapJson.formationProfessionnelle.cta.title}</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {datapJson.formationProfessionnelle.cta.description}
              </p>
              <Button asChild className="bg-white text-actl-green hover:bg-gray-100">
                <Link to="/contact">{datapJson.formationProfessionnelle.cta.buttonText}</Link>
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                  <Wrench className="h-4 w-4 mr-2 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">Formation Professionnelle</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {datapJson.mecaniqueFormation.title}
                  </span>
                </h1>
                <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                  {datapJson.mecaniqueFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                    <Link to="/contact" className="flex items-center">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={datapJson.mecaniqueFormation.image}
                    alt={datapJson.mecaniqueFormation.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Détails du programme
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Maîtrisez la mécanique automobile avec une formation complète et pratique.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Structure du programme
                </h3>
                <ul className="space-y-3">
                  {datapJson.mecaniqueFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Contenu du cours
                </h3>
                <ul className="space-y-3">
                  {datapJson.mecaniqueFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Débouchés professionnels
                </h3>
                <ul className="space-y-3">
                  {datapJson.mecaniqueFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Workshop Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mx-auto">{datapJson.mecaniqueFormation.workshopTitle}</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              {datapJson.mecaniqueFormation.workshopDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {datapJson.mecaniqueFormation.workshopImages.map((image, index) => (
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
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {datapJson.mecaniqueFormation.cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              {datapJson.mecaniqueFormation.cta.description}
            </p>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/contact">{datapJson.mecaniqueFormation.cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const Marches = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showInscriptionForm, setShowInscriptionForm] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    entreprise: '',
    email: '',
    telephone: '',
    adresse: '',
    nif: '',
    nis: '',
    rc: '',
    proposition: null
  });
  const [inscriptionResult, setInscriptionResult] = useState(null);
  const [userData, setUserData] = useState(null);

  if (!datapJson.marches) return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>;

  // Marchés disponibles (simulés - synchronisés avec le dashboard)
  const availableMarkets = [
    {
      id: 'market-001',
      title: 'Fourniture d\'équipements de formation automobile',
      description: 'Appel d\'offres pour la fourniture d\'équipements modernes de diagnostic automobile pour nos ateliers de formation.',
      deadline: '2025-03-15',
      budget: '1 500 000 DZD',
      cahierCharges: 'cahier-des-charges-equipements.pdf',
      status: 'open'
    },
    {
      id: 'market-002', 
      title: 'Services de maintenance des véhicules de formation',
      description: 'Consultation pour les services de maintenance préventive et corrective des véhicules utilisés pour la formation pratique.',
      deadline: '2025-02-28',
      budget: '800 000 DZD',
      cahierCharges: 'cahier-des-charges-maintenance.pdf',
      status: 'closed'
    }
  ].filter(market => market.status === 'open'); // Afficher seulement les marchés ouverts

  const generateUserCode = () => {
    return 'ACTL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const handleMarketSelection = (market) => {
    setSelectedMarket(market);
    setShowInscriptionForm(true);
  };

  const handleInscription = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.proposition) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const code = generateUserCode();
    const inscriptionData = {
      code,
      market: selectedMarket,
      userData: formData,
      status: 'pas encore vue',
      submittedAt: new Date().toISOString()
    };

    try {
      // Simuler l'enregistrement chiffré dans market.json
      console.log('💾 Enregistrement dans market.json:', inscriptionData);
      
      setInscriptionResult({
        success: true,
        code,
        message: 'Inscription enregistrée avec succès !'
      });
      
      setShowInscriptionForm(false);
      toast.success(`Inscription réussie ! Votre code: ${code}`);
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    }
  };

    const handleCodeSubmit = async () => {
    if (!userCode.trim()) {
      toast.error('Veuillez entrer votre code d\'inscription');
      return;
    }

    try {
      // Charger les données réelles de market.json
      const response = await fetch('/market.json');
      if (!response.ok) {
        throw new Error('Impossible de charger les données');
      }
      
      const marketData = await response.json();
      
      // Chercher le code dans les registrations réelles
      const foundRegistration = marketData.registrations.find(
        (reg: any) => reg.code === userCode.trim()
      );
      
      if (!foundRegistration) {
        toast.error(`❌ Code "${userCode}" non trouvé. Vérifiez votre code d'inscription.`);
        setUserData(null);
        return;
      }
      
      // Récupérer les détails du marché correspondant
      const marketDetails = marketData.markets.find(
        (market: any) => market.id === foundRegistration.market.id
      );
      
      // Construire les données utilisateur avec les vraies informations
      const realUserData = {
        code: foundRegistration.code,
        market: {
          title: foundRegistration.market.title,
          id: foundRegistration.market.id,
          status: marketDetails?.status || 'unknown',
          cahierCharges: marketDetails?.cahierCharges || 'document.pdf'
        },
        userData: foundRegistration.userData,
        status: foundRegistration.status,
        submittedAt: foundRegistration.submittedAt,
        documents: foundRegistration.documents,
        notes: foundRegistration.notes
      };

      setUserData(realUserData);
      toast.success(`✅ Candidature trouvée pour ${foundRegistration.userData.entreprise} !`);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('❌ Erreur lors de la vérification du code. Réessayez plus tard.');
      setUserData(null);
    }
  };

  // Fonction pour télécharger les fichiers
  const downloadFile = (filename: string, content: string, type: string = 'application/pdf') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Fonction pour générer et télécharger le cahier des charges
  const downloadCahierDesCharges = (market: any) => {
    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 400 >>
stream
BT
/F1 16 Tf
50 750 Td
(CAHIER DES CHARGES) Tj
0 -30 Td
/F1 12 Tf
(${market.title}) Tj
0 -25 Td
(Budget: ${market.budget}) Tj
0 -25 Td
(Echeance: ${new Date(market.deadline).toLocaleDateString('fr-FR')}) Tj
0 -30 Td
(Description:) Tj
0 -20 Td
(${market.description}) Tj
0 -30 Td
(Document officiel ACTL) Tj
0 -20 Td
(Telechargement: ${new Date().toLocaleDateString('fr-FR')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000120 00000 n
0000000250 00000 n
0000000330 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
780
%%EOF`;
    
    downloadFile(`cahier_des_charges_${market.id}.pdf`, pdfContent);
    toast.success(`📄 Cahier des charges téléchargé : ${market.title}`);
  };

  // Fonction pour télécharger les informations utilisateur
  const downloadUserInfo = (userData: any) => {
    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 500 >>
stream
BT
/F1 16 Tf
50 750 Td
(INFORMATIONS CANDIDATURE) Tj
0 -30 Td
/F1 12 Tf
(Code: ${userData.code}) Tj
0 -20 Td
(Nom: ${userData.userData.nom} ${userData.userData.prenom}) Tj
0 -20 Td
(Entreprise: ${userData.userData.entreprise}) Tj
0 -20 Td
(Email: ${userData.userData.email}) Tj
0 -20 Td
(Telephone: ${userData.userData.telephone || 'Non renseigne'}) Tj
0 -20 Td
(NIF: ${userData.userData.nif || 'Non renseigne'}) Tj
0 -20 Td
(NIS: ${userData.userData.nis || 'Non renseigne'}) Tj
0 -20 Td
(RC: ${userData.userData.rc || 'Non renseigne'}) Tj
0 -20 Td
(Statut: ${userData.status}) Tj
0 -20 Td
(Date soumission: ${new Date(userData.submittedAt).toLocaleDateString('fr-FR')}) Tj
0 -30 Td
(Document genere le: ${new Date().toLocaleDateString('fr-FR')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000120 00000 n
0000000250 00000 n
0000000330 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
880
%%EOF`;
    
    downloadFile(`candidature_${userData.code}.pdf`, pdfContent);
    toast.success(`📋 Informations téléchargées : Candidature ${userData.code}`);
  };

  // Fonction pour télécharger la proposition soumise
  const downloadUserProposition = (userData: any) => {
    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 300 >>
stream
BT
/F1 16 Tf
50 750 Td
(PROPOSITION TECHNIQUE) Tj
0 -30 Td
/F1 12 Tf
(Candidat: ${userData.userData.nom} ${userData.userData.prenom}) Tj
0 -20 Td
(Entreprise: ${userData.userData.entreprise}) Tj
0 -20 Td
(Code candidature: ${userData.code}) Tj
0 -30 Td
(Marche: ${userData.market.title}) Tj
0 -30 Td
(Proposition soumise le: ${new Date(userData.submittedAt).toLocaleDateString('fr-FR')}) Tj
0 -30 Td
(Statut actuel: ${userData.status}) Tj
0 -30 Td
(Document recupere le: ${new Date().toLocaleDateString('fr-FR')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000120 00000 n
0000000250 00000 n
0000000330 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
680
%%EOF`;
    
    downloadFile(`proposition_${userData.code}.pdf`, pdfContent);
    toast.success(`📄 Proposition téléchargée : ${userData.userData.entreprise}`);
  };

  const handlePropositionUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({...formData, proposition: file});
      toast.success('Proposition téléchargée');
    } else {
      toast.error('Veuillez sélectionner un fichier PDF');
    }
  };

  const statusBadges = {
    'pas encore vue': <Badge className="bg-gray-100 text-gray-800">📋 Pas encore vue</Badge>,
    'vue': <Badge className="bg-blue-100 text-blue-800">👁️ Vue</Badge>,
    'dossier en traitement': <Badge className="bg-yellow-100 text-yellow-800">⚙️ En traitement</Badge>,
    'dossier en charge': <Badge className="bg-orange-100 text-orange-800">📂 En charge</Badge>,
    'refuser': <Badge className="bg-red-100 text-red-800">❌ Refusé</Badge>,
    'accepter contact dans les plus bref delais': <Badge className="bg-green-100 text-green-800">✅ Accepté - Contact imminent</Badge>,
    'accepter': <Badge className="bg-green-100 text-green-800">🎉 Accepté</Badge>
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">{datapJson.marches.title}</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Découvrez nos opportunités de partenariat et soumettez vos propositions en ligne de manière sécurisée
              </p>
            </motion.div>
          </div>
        </div>

        {/* Marchés disponibles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Consultations et Marchés Ouverts
            </h2>
            
            {availableMarkets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {availableMarkets.map((market, index) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 ${
                    market.status === 'open' ? 'border-green-200 hover:border-green-400' : 
                    market.status === 'closed' ? 'border-red-200 hover:border-red-400' : 
                    'border-gray-200 hover:border-gray-400'
                  }`}>
                    <CardHeader className={`${
                      market.status === 'open' ? 'bg-gradient-to-r from-green-50 to-green-100' : 
                      market.status === 'closed' ? 'bg-gradient-to-r from-red-50 to-red-100' : 
                      'bg-gradient-to-r from-gray-50 to-gray-100'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className={`text-xl mb-2 ${
                            market.status === 'open' ? 'text-green-800' : 
                            market.status === 'closed' ? 'text-red-800' : 
                            'text-gray-800'
                          }`}>
                            {market.title}
                          </CardTitle>
                          <div className={`flex items-center space-x-4 text-sm ${
                            market.status === 'open' ? 'text-green-600' : 
                            market.status === 'closed' ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Échéance: {new Date(market.deadline).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center">
                              <Wallet className="w-4 h-4 mr-1" />
                              <span>{market.budget}</span>
                            </div>
                          </div>
                        </div>
                        {market.status === 'open' && <Badge className="bg-green-200 text-green-800 font-semibold">🔓 Ouvert</Badge>}
                        {market.status === 'closed' && <Badge className="bg-red-200 text-red-800 font-semibold">🔒 Fermé</Badge>}
                        {market.status === 'draft' && <Badge className="bg-gray-200 text-gray-800 font-semibold">📝 Brouillon</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {market.description}
                      </p>
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className={`w-full ${
                            market.status === 'open' ? 'border-green-200 text-green-700 hover:bg-green-50' :
                            market.status === 'closed' ? 'border-red-200 text-red-700 hover:bg-red-50' :
                            'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => downloadCahierDesCharges(market)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger le cahier des charges
                        </Button>
                        {market.status === 'open' ? (
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarketSelection(market)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Postuler à cette consultation
                          </Button>
                        ) : (
                          <Button 
                            disabled
                            className="w-full bg-gray-400 cursor-not-allowed"
                            title="Cette consultation est fermée"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Consultation fermée
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                              ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-12"
              >
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-8">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Aucune consultation ouverte
                    </h3>
                    <p className="text-gray-500">
                      Il n'y a actuellement aucun marché ou consultation ouvert. 
                      Consultez cette page régulièrement pour ne manquer aucune opportunité.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Suivi avec code */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {datapJson?.marches?.suiviTitle || 'Suivi de votre dossier'}
              </h2>
              <p className="text-gray-600 mb-8">
                {datapJson?.marches?.suiviDescription || 'Entrez votre code unique pour consulter l\'état de votre candidature et télécharger vos documents'}
              </p>
              
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder={datapJson?.marches?.suiviPlaceholder || "Entrez votre code (ex: ACTL-XYZ123-ABC4)"}
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="text-center font-mono"
                      />
                    </div>
                    <Button 
                      onClick={handleCodeSubmit}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {datapJson?.marches?.suiviButtonText || 'Consulter mon dossier'}
                    </Button>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <Dialog open={showInscriptionForm} onOpenChange={setShowInscriptionForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-green-800">
                Inscription à la consultation
              </DialogTitle>
              <DialogDescription>
                <strong>{selectedMarket?.title}</strong>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Rappel sécurité - Loi 18-7 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      🔒 Sécurité et Confidentialité
                    </h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Conformément à la <strong>Loi 18-07 relative à la protection des données personnelles</strong>, 
                      vos informations sont chiffrées et sécurisées. Elles ne seront utilisées que dans le cadre 
                      de cette consultation et ne seront pas partagées avec des tiers sans votre consentement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulaire d'informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    placeholder="Votre nom"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    placeholder="Votre prénom"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="entreprise">Entreprise *</Label>
                  <Input
                    id="entreprise"
                    value={formData.entreprise}
                    onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                    placeholder="Nom de votre entreprise"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre.email@exemple.dz"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nif">NIF (Numéro d'Identification Fiscale)</Label>
                  <Input
                    id="nif"
                    value={formData.nif}
                    onChange={(e) => setFormData({...formData, nif: e.target.value})}
                    placeholder="Ex: 099012345678901"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nis">NIS (Numéro d'Identification Statistique)</Label>
                  <Input
                    id="nis"
                    value={formData.nis}
                    onChange={(e) => setFormData({...formData, nis: e.target.value})}
                    placeholder="Ex: 123456789012345"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rc">RC (Registre de Commerce)</Label>
                  <Input
                    id="rc"
                    value={formData.rc}
                    onChange={(e) => setFormData({...formData, rc: e.target.value})}
                    placeholder="Ex: 16/00-1234567B25"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    placeholder="Ex: 05 12 34 56 78"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="adresse">Adresse complète</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  placeholder="Adresse complète de votre entreprise"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Upload proposition */}
              <div>
                <Label htmlFor="proposition">Votre proposition (PDF) *</Label>
                <div className="mt-2 border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="proposition"
                    accept=".pdf"
                    onChange={handlePropositionUpload}
                    className="hidden"
                  />
                  <label htmlFor="proposition" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {formData.proposition ? 
                        `✅ ${formData.proposition.name}` : 
                        'Cliquez pour télécharger votre proposition (PDF uniquement)'
                      }
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowInscriptionForm(false)}>
                  Annuler
                </Button>
                <Button onClick={handleInscription} className="bg-green-600 hover:bg-green-700">
                  Soumettre ma candidature
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Résultat d'inscription */}
        <Dialog open={!!inscriptionResult} onOpenChange={() => setInscriptionResult(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-800">
                🎉 Inscription réussie !
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold mb-2">Votre code d'inscription :</p>
                <p className="text-2xl font-mono font-bold text-green-700">
                  {inscriptionResult?.code}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Conservez précieusement ce code pour suivre votre dossier
                </p>
              </div>
              <Button 
                onClick={() => setInscriptionResult(null)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Compris
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Données utilisateur */}
        <Dialog open={!!userData} onOpenChange={() => setUserData(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-green-800">
                📋 Mon dossier de candidature
              </DialogTitle>
              <DialogDescription>
                Code: <span className="font-mono font-bold">{userData?.code}</span>
              </DialogDescription>
            </DialogHeader>
            
            {userData && (
              <div className="space-y-6">
                {/* État du dossier */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">État de votre dossier</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Statut actuel :</p>
                      {statusBadges[userData.status]}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Soumis le</p>
                      <p className="font-medium">
                        {new Date(userData.submittedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Marché */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Consultation</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="font-medium text-green-800">{userData.market.title}</p>
                      <p className="text-sm text-gray-500">Référence: {userData.market.id}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Informations personnelles */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Vos informations</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Candidat</p>
                        <p className="font-medium">{userData.userData.nom} {userData.userData.prenom}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Entreprise</p>
                        <p className="font-medium">{userData.userData.entreprise}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Documents</h3>
                                     <div className="space-y-2">
                     <Button 
                       variant="outline" 
                       className="w-full justify-start"
                       onClick={() => downloadUserInfo(userData)}
                     >
                       <Download className="mr-2 h-4 w-4" />
                       Télécharger mes informations complètes (PDF)
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full justify-start"
                       onClick={() => downloadCahierDesCharges(userData.market)}
                     >
                       <FileText className="mr-2 h-4 w-4" />
                       Cahier des charges - {userData.market.cahierCharges}
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full justify-start"
                       onClick={() => downloadUserProposition(userData)}
                     >
                       <Upload className="mr-2 h-4 w-4" />
                       Ma proposition soumise
                     </Button>
                     {userData.market.status === 'closed' && (
                       <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                         <div className="flex items-center space-x-2 text-red-800">
                           <AlertTriangle className="w-4 h-4" />
                           <span className="text-sm font-medium">Consultation fermée</span>
                         </div>
                         <p className="text-red-600 text-xs mt-1">
                           Cette consultation a été fermée. Aucune nouvelle candidature n'est acceptée.
                         </p>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
                      <h1 className="text-6xl font-bold text-actl-green mb-4">{datapJson.notFound.title}</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-6">{datapJson.notFound.subtitle}</p>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {datapJson.notFound.description}
            </p>
            <Button asChild className="bg-actl-green hover:bg-actl-green/90">
              <Link to="/">{datapJson.notFound.buttonText}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const RHFormation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                  <Users className="h-4 w-4 mr-2 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">Formation Professionnelle</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {datapJson.rhFormation.title}
                  </span>
                </h1>
                <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                  {datapJson.rhFormation.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                    <Link to="/contact" className="flex items-center">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
                    <Link to="/contact">Demander des informations</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={datapJson.rhFormation.image} 
                    alt={datapJson.rhFormation.title} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Détails du programme
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez la gestion des ressources humaines avec une formation complète et pratique.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Structure du programme
                </h3>
                <ul className="space-y-3">
                  {datapJson.rhFormation.programStructure.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Contenu du cours
                </h3>
                <ul className="space-y-3">
                  {datapJson.rhFormation.courseContent.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Débouchés professionnels
                </h3>
                <ul className="space-y-3">
                  {datapJson.rhFormation.careerOpportunities.map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {datapJson.rhFormation.cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              {datapJson.rhFormation.cta.description}
            </p>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/contact">{datapJson.rhFormation.cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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

export const FormationPage = () => {
  const { id } = useParams();
  let formation = datapJson[id];
  if (!formation && id) {
    formation = datapJson[`${id}Formation`];
  }
  if (!formation) {
    return <NotFound />;
  }

  // Render des sections modulaires
  const renderFormationSection = (sectionId: string, data: any) => {
    if (!data || !data.enabled) return null;

    switch (sectionId) {
      case 'programDetails':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                01
              </div>
              <h2 className="text-2xl font-bold">Détails du programme</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700">{data.mainTitle}</p>
              {data.structure && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Structure du programme</h3>
                  <p className="text-gray-700">{data.structure}</p>
                </div>
              )}
              {data.content && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Contenu du cours</h3>
                  <p className="text-gray-700">{data.content}</p>
                </div>
              )}
              {data.opportunities && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Débouchés professionnels</h3>
                  <p className="text-gray-700">{data.opportunities}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'imageGallery':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                02
              </div>
              <h2 className="text-2xl font-bold">{data.title || 'Galerie d\'images'}</h2>
            </div>
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg">{data.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(data.images || []).map((image: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <img
                    src={image.url || '/placeholder.svg'}
                    alt={image.description}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-3">
                    <p className="text-gray-700">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                03
              </div>
              <h2 className="text-2xl font-bold">Certifications</h2>
            </div>
            <p className="text-lg text-gray-700 text-center mb-8">
              {data.description || 'Nos formations mènent à des certifications professionnelles reconnues dans l\'industrie.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.items || []).map((cert: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Award className="w-8 h-8 text-emerald-600 mr-3" />
                    <h4 className="text-xl font-semibold">{cert.title}</h4>
                  </div>
                  <p className="text-gray-700">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'additionalContent':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                04
              </div>
              <h2 className="text-2xl font-bold">Contenu supplémentaire</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.files || []).map((file: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-emerald-600 mr-3">
                      {file.type === 'video' ? <Video className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                    </div>
                    <h4 className="text-xl font-semibold">{file.title}</h4>
                  </div>
                  <p className="text-gray-700 mb-4">{file.description}</p>
                  <Button variant="outline" className="flex items-center space-x-2">
                    {file.type === 'video' ? <Play className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span>{file.type === 'video' ? 'Regarder' : 'Télécharger'}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ctaFinal':
        return (
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 rounded-lg text-white shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center font-bold mr-4">
                05
              </div>
              <h2 className="text-2xl font-bold">Appel à l'action final</h2>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                {data.title || 'Devenez un professionnel de la conduite'}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {data.description || 'Inscrivez-vous dès maintenant à notre formation de conduite professionnelle et obtenez votre brevet professionnel.'}
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                {data.buttonText || "S'inscrire maintenant"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section identique au site */}
      <Hero />

      {/* Contenu principal de la formation */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* En-tête de la formation */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {formation.hero?.title || formation.title}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {formation.hero?.description || formation.description}
          </p>
        </div>

        {/* Sections modulaires créées dans l'éditeur */}
        {formation.sections && Object.entries(formation.sections).map(([sectionId, sectionData]) => 
          renderFormationSection(sectionId, sectionData)
        )}

        {/* Fallback - ancien contenu si pas de sections modulaires */}
        {(!formation.sections || Object.keys(formation.sections).length === 0) && (
          <>
            {formation.programStructure && formation.programStructure.length > 0 && (
              <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Structure du programme</h2>
                <ul className="list-disc pl-5">
                  {formation.programStructure.map((item: string, index: number) => (
                    <li key={index} className="text-lg mb-2">{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {formation.courseContent && formation.courseContent.length > 0 && (
              <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Contenu du cours</h2>
                <ul className="list-disc pl-5">
                  {formation.courseContent.map((item: string, index: number) => (
                    <li key={index} className="text-lg mb-2">{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {formation.careerOpportunities && formation.careerOpportunities.length > 0 && (
              <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Opportunités de carrière</h2>
                <ul className="list-disc pl-5">
                  {formation.careerOpportunities.map((item: string, index: number) => (
                    <li key={index} className="text-lg mb-2">{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {formation.cta && (
              <section className="text-center py-8 bg-gray-100 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">{formation.cta.title}</h2>
                <p className="text-lg mb-6">{formation.cta.description}</p>
                <Button asChild>
                  <Link to="/contact">{formation.cta.buttonText}</Link>
                </Button>
              </section>
            )}
          </>
        )}
      </main>

      {/* Contact Section identique au site */}
      <ContactCTA />

      {/* Footer identique au site */}
      <Footer />
    </div>
  );
};

