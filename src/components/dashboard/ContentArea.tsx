import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { OverviewSection } from '../sections/OverviewSection';
import { HeroSection } from '../sections/HeroSection';
import { FormationsSection } from '../sections/FormationsSection';
import { EventsSection } from '../sections/EventsSection';
import { MarketsSection } from '../sections/MarketsSection';
import { GallerySection } from '../sections/GallerySection';
import { ServicesSection } from '../sections/ServicesSection';
import { FacilitiesSection } from '../sections/FacilitiesSection';
import { ContactSection } from '../sections/ContactSection';
import { FooterSection } from '../sections/FooterSection';
import { NavigationSection } from '../sections/NavigationSection';
import { PagesSection } from '../sections/PagesSection';
import { UserContactSection } from '../sections/UserContactSection';
import { FileManagerSection } from '../sections/FileManagerSection';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const sectionComponents: Record<string, React.ComponentType> = {
  overview: OverviewSection,
  hero: HeroSection,
  formations: FormationsSection,
  events: EventsSection,
  markets: MarketsSection,
  gallery: GallerySection,
  services: ServicesSection,
  facilities: FacilitiesSection,
  contact: ContactSection,
  navigation: FooterSection,
  navbar: NavigationSection,
  pages: PagesSection,
  'user-contact': UserContactSection,
  'file-manager': FileManagerSection
};

// Mapping des sections vers leurs permissions requises
const sectionPermissions: Record<string, string> = {
  overview: 'edit_overview',
  hero: 'edit_hero',
  formations: 'edit_formations',
  events: 'edit_events',
  markets: 'manage_markets', // Gestionnaires peuvent accéder aux inscriptions
  gallery: 'edit_gallery',
  services: 'edit_services',
  facilities: 'edit_facilities',
  contact: 'edit_contact',
  navigation: 'edit_pages',
  navbar: 'edit_pages',
  pages: 'edit_pages',
  'user-contact': 'manage_contacts',
  'file-manager': 'file_manager' // Administrateurs uniquement
};

// Mapping des titres des sections
const sectionTitles: Record<string, string> = {
  overview: 'Vue d\'ensemble',
  hero: 'Section Héro',
  formations: 'Formations',
  events: 'Événements',
  markets: 'Marchés',
  gallery: 'Galerie',
  services: 'Services',
  facilities: 'Ateliers',
  contact: 'Contact',
  navigation: 'Footer',
  navbar: 'Navigation',
  pages: 'Pages du site',
  'user-contact': 'Page Contact Utilisateur',
  'file-manager': 'Gestionnaire de Fichiers'
};

// Composant d'accès refusé
const AccessDeniedComponent: React.FC<{ sectionName: string; permission: string }> = ({ sectionName, permission }) => {
  const { currentAdmin } = useAuthStore();
  
  return (
    <div className="flex items-center justify-center min-h-96 p-8">
      <Card className="w-full max-w-md">
        <CardContent className="text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Accès Restreint
          </h3>
          
          <div className="space-y-3 text-gray-600">
            <p>
              Vous n'avez pas les permissions pour accéder à la section <strong>"{sectionName}"</strong>.
            </p>
            
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center justify-center space-x-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Permission requise : {permission}</span>
              </div>
            </div>
            
            {currentAdmin?.role === 'gestionnaire' && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
                <p className="text-blue-700 text-sm">
                  <strong>Compte Gestionnaire :</strong> Vous avez accès aux sections "Marchés" et "Page Contact Utilisateur" uniquement.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-4">
              Contactez un administrateur pour obtenir l'accès à cette section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ContentArea: React.FC = () => {
  const { activeSection } = useDashboardStore();
  const { hasPermission } = useAuthStore();
  
  const ActiveComponent = sectionComponents[activeSection] || OverviewSection;
  const requiredPermission = sectionPermissions[activeSection];
  const sectionTitle = sectionTitles[activeSection] || activeSection;
  
  // Vérifier si l'utilisateur a la permission pour cette section
  const canAccess = requiredPermission ? hasPermission(requiredPermission) : true;

  return (
    <div className="flex-1 overflow-hidden bg-slate-50 h-full">
      <div className="h-full max-h-full overflow-y-auto pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-full"
          >
            {canAccess ? (
              <ActiveComponent />
            ) : (
              <AccessDeniedComponent 
                sectionName={sectionTitle} 
                permission={requiredPermission || 'Non définie'} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentArea;
