import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Settings,
  FileText,
  Image,
  Calendar,
  ShoppingCart,
  GraduationCap,
  Users,
  Mail,
  BarChart3,
  Palette,
  Globe,
  Shield,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  permission?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    title: 'Vue d\'ensemble',
    icon: Home,
    description: 'Tableau de bord principal',
    permission: 'edit_overview'
  },
  {
    id: 'hero',
    title: 'Section Héro',
    icon: Palette,
    description: 'Bannière principale',
    permission: 'edit_hero'
  },
  {
    id: 'formations',
    title: 'Formations',
    icon: GraduationCap,
    description: 'Gestion des formations',
    permission: 'edit_formations'
  },
  {
    id: 'events',
    title: 'Événements',
    icon: Calendar,
    description: 'Gestion des événements',
    permission: 'edit_events'
  },
  {
    id: 'markets',
    title: 'Marchés',
    icon: ShoppingCart,
    description: 'Marchés et consultations',
    permission: 'manage_markets'
  },
  {
    id: 'gallery',
    title: 'Galerie',
    icon: Image,
    description: 'Gestion des images',
    permission: 'edit_gallery'
  },
  {
    id: 'services',
    title: 'Services',
    icon: Settings,
    description: 'Services proposés',
    permission: 'edit_services'
  },
  {
    id: 'facilities',
    title: 'Ateliers',
    icon: Settings,
    description: 'Nos installations',
    permission: 'edit_facilities'
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: Mail,
    description: 'Informations de contact',
    permission: 'edit_contact'
  },
  {
    id: 'navigation',
    title: 'Footer',
    icon: Globe,
    description: 'Footer et liens',
    permission: 'edit_pages'
  },
  {
    id: 'navbar',
    title: 'Navigation Bar',
    icon: FileText,
    description: 'Menu de navigation',
    permission: 'edit_pages'
  },
  {
    id: 'user-contact',
    title: 'Page de Contact utilisateur',
    icon: BarChart3,
    description: 'Page contact publique',
    permission: 'manage_contacts'
  }
];

interface SidebarProps {
  onShowAdminManagement?: () => void;
  onShowFileManager?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onShowAdminManagement, onShowFileManager }) => {
  const { activeSection, setActiveSection } = useDashboardStore();
  const { currentAdmin, logout, hasPermission } = useAuthStore();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      toast.success('Déconnexion réussie');
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500">ACTL Administration</p>
          </div>
        </motion.div>

        {/* Info Utilisateur connecté (si système auth activé) */}
        {currentAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-800 truncate">
                  {currentAdmin.name || 'Administrateur'}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-emerald-600">
                    {currentAdmin.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
                  </p>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                  <p className="text-xs text-emerald-600">Connecté</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const canAccess = item.permission ? hasPermission(item.permission) : true;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (canAccess) {
                    setActiveSection(item.id);
                  } else {
                    toast.error(`Accès non autorisé à "${item.title}"`);
                  }
                }}
                disabled={!canAccess}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                  isActive && canAccess
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : canAccess
                    ? "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    : "text-slate-400 hover:bg-red-50 cursor-not-allowed opacity-60"
                )}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive && canAccess 
                        ? "text-emerald-600" 
                        : canAccess
                        ? "text-slate-400 group-hover:text-slate-600"
                        : "text-slate-300"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{item.title}</span>
                      {item.badge && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs truncate mt-0.5",
                      canAccess ? "text-slate-500" : "text-slate-400"
                    )}>
                      {canAccess ? item.description : "Accès restreint"}
                    </p>
                  </div>
                </div>
                
                {!canAccess && (
                  <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Message d'info pour gestionnaires */}
        {currentAdmin?.role === 'gestionnaire' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-4 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Compte Gestionnaire</h4>
                <p className="text-xs text-blue-600 mt-1">
                  Accès limité aux marchés et contacts. Pour l'édition complète du site, contactez un administrateur.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer avec authentification */}
      {currentAdmin && (
        <div className="p-4 border-t border-slate-200 space-y-3">
          {/* Boutons d'administration (seulement si admin principal) */}
          <div className="space-y-2">
            {hasPermission && hasPermission('manage_admins') && onShowAdminManagement && (
              <Button
                onClick={onShowAdminManagement}
                variant="outline"
                className="w-full justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                Gérer les Admins
              </Button>
            )}

            {currentAdmin?.role === 'admin' && onShowFileManager && (
              <Button
                onClick={onShowFileManager}
                variant="outline"
                className="w-full justify-start bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                File Manager
              </Button>
            )}

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

