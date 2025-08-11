import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import ContentArea from './ContentArea';
import LoginScreen from '../auth/LoginScreen';
import AdminManagement from '../auth/AdminManagement';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ className }) => {
  const { loadData, isLoading, setActiveSection } = useDashboardStore();
  const { isAuthenticated, loadAdminsFromFile } = useAuthStore();
  const [showAdminManagement, setShowAdminManagement] = useState(false);

  useEffect(() => {
    // Charger les données d'authentification au démarrage
    loadAdminsFromFile();
  }, [loadAdminsFromFile]);

  useEffect(() => {
    // Charger les données seulement si authentifié
    if (isAuthenticated) {
      loadData();
    }
  }, [loadData, isAuthenticated]);

  const handleShowFileManager = () => {
    setActiveSection('file-manager');
  };

  // Afficher l'écran de login si pas authentifié
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Chargement du dashboard...</h2>
          <p className="text-slate-500 mt-2">Préparation de l'interface d'administration</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-slate-100", className)}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <Sidebar 
            onShowAdminManagement={() => setShowAdminManagement(true)} 
            onShowFileManager={handleShowFileManager}
          />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          >
            <Header />
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="flex-1 overflow-hidden"
          >
            <ContentArea />
          </motion.div>
        </div>
      </div>

      {/* Admin Management Modal */}
      {showAdminManagement && (
        <AdminManagement onClose={() => setShowAdminManagement(false)} />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

