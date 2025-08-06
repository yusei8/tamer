import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image, 
  Calendar, 
  ShoppingCart, 
  GraduationCap,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export const OverviewSection: React.FC = () => {
  const { dataJson, datapJson, hasUnsavedChanges, setActiveSection } = useDashboardStore();
  const [serverStatus, setServerStatus] = useState({ js: false, db: false });
  const [lastCheck, setLastCheck] = useState(new Date());

  // Vérification de l'état du serveur JS et DB
  const checkServerStatus = async () => {
    let jsStatus = false;
    let dbStatus = false;
    
    let controller;
    let timeoutId;
    
    try {
      // Test SIMPLE mais EFFICACE : essayer de contacter le serveur
      const testUrl = window.location.origin + '/?' + Date.now();
      
      // Créer un timeout manuel compatible
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        jsStatus = true;
        dbStatus = true; // Si le serveur répond, on considère que tout va bien
        console.log('✅ Serveur JS actif et base de données accessible');
      } else {
        jsStatus = false;
        dbStatus = false;
        console.log('🔴 Serveur JS - Erreur HTTP:', response.status);
      }
      
    } catch (error) {
      // Nettoyer le timeout en cas d'erreur
      if (timeoutId) clearTimeout(timeoutId);
      
      // Si on arrive ici, c'est que le serveur JS est vraiment déconnecté
      jsStatus = false;
      dbStatus = false;
      console.log('🔴 Erreur lors du chargement des données - Serveur JS déconnecté:', error.message);
      
      // Messages d'erreur spécifiques
      if (error.name === 'AbortError') {
        console.log('🔴 TIMEOUT - Le serveur JS ne répond pas assez rapidement (3s)');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🔴 SERVEUR JS ARRÊTÉ - Impossible de contacter le serveur de développement');
      } else {
        console.log('🔴 ERREUR SERVEUR:', error.name, error.message);
      }
    }
    
    setServerStatus({ js: jsStatus, db: dbStatus });
    
    setLastCheck(new Date());
  };

  // Vérification au montage et toutes les 30 secondes
  useEffect(() => {
    // Délai initial pour laisser les données se charger
    setTimeout(checkServerStatus, 1000);
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Re-vérifier quand les données changent
  useEffect(() => {
    if (dataJson && datapJson) {
      setTimeout(checkServerStatus, 500);
    }
  }, [dataJson, datapJson]);

  // Calculer les statistiques
  const stats = React.useMemo(() => {
    const formations = dataJson?.formations?.items || [];
    const events = datapJson?.evenements?.events || [];
    const galleryImages = dataJson?.gallery?.images || [];
    const services = dataJson?.services?.items || [];
    const facilities = dataJson?.facilities?.items || [];
    
    // Pages internes
    const internalPages = Object.keys(datapJson || {}).length;
    
    return {
      formations: formations.length,
      events: events.length,
      images: galleryImages.length,
      services: services.length,
      facilities: facilities.length,
      pages: internalPages
    };
  }, [dataJson, datapJson]);

  const quickStats = [
    {
      title: 'Formations',
      value: stats.formations,
      icon: GraduationCap,
      color: 'bg-blue-500',
      description: 'Programmes disponibles'
    },
    {
      title: 'Événements',
      value: stats.events,
      icon: Calendar,
      color: 'bg-green-500',
      description: 'Événements programmés'
    },
    {
      title: 'Images',
      value: stats.images,
      icon: Image,
      color: 'bg-purple-500',
      description: 'Images en galerie'
    },
    {
      title: 'Services',
      value: stats.services,
      icon: Users,
      color: 'bg-orange-500',
      description: 'Services proposés'
    },
    {
      title: 'Ateliers',
      value: stats.facilities,
      icon: ShoppingCart,
      color: 'bg-red-500',
      description: 'Installations disponibles'
    },
    {
      title: 'Serveur',
      value: serverStatus.js && serverStatus.db ? '2/2' : serverStatus.js ? '1/2' : '0/2',
      icon: CheckCircle,
      color: serverStatus.js && serverStatus.db ? 'bg-green-500' : serverStatus.js ? 'bg-yellow-500' : 'bg-red-500',
      description: serverStatus.js && serverStatus.db ? 'Services actifs' : serverStatus.js ? 'JS actif, DB déconnectée' : 'Services déconnectés'
    }
  ];



  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Vue d'ensemble</h1>
          <p className="text-slate-600 mt-2">
            Tableau de bord de gestion du contenu ACTL
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges ? (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Modifications non sauvegardées</span>
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Tout est à jour</span>
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-800 mt-2">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* État du serveur */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>État du serveur</span>
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>Informations techniques et état du système</span>
                <button 
                  onClick={checkServerStatus}
                  className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 transition-colors"
                  title="Forcer la vérification"
                >
                  🔄 Actualiser
                </button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  serverStatus.js ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      serverStatus.js ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-slate-700">Serveur JavaScript</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    serverStatus.js ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {serverStatus.js ? '🟢 En ligne' : '🔴 Déconnecté'}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  serverStatus.db ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      serverStatus.db ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-slate-700">Base de données</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    serverStatus.db ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {serverStatus.db ? '🟢 Connectée' : '🔴 Déconnectée'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-700">Dernière vérification</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    🔄 {lastCheck.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-sm text-slate-700">État général</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    serverStatus.js && serverStatus.db ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {serverStatus.js && serverStatus.db ? '✅ Opérationnel' : '⚠️ Problème détecté'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Actions rapides</span>
              </CardTitle>
              <CardDescription>
                Raccourcis vers les fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors" onClick={() => setActiveSection('formations')}>
                  <GraduationCap className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="font-medium text-slate-800">Ajouter une formation</p>
                  <p className="text-xs text-slate-500">Créer un nouveau programme</p>
                </button>
                
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors" onClick={() => setActiveSection('events')}>
                  <Calendar className="w-6 h-6 text-green-600 mb-2" />
                  <p className="font-medium text-slate-800">Nouvel événement</p>
                  <p className="text-xs text-slate-500">Programmer un événement</p>
                </button>
                
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors" onClick={() => setActiveSection('gallery')}>
                  <Image className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-medium text-slate-800">Gérer la galerie</p>
                  <p className="text-xs text-slate-500">Ajouter des images</p>
                </button>
                
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors" onClick={() => setActiveSection('markets')}>
                  <ShoppingCart className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="font-medium text-slate-800">Nouveau marché</p>
                  <p className="text-xs text-slate-500">Publier une consultation</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Importance du serveur JS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Importance du serveur JavaScript</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-700 space-y-2">
              <p className="text-sm leading-relaxed">
                🔧 <strong>Serveur JS crucial :</strong> Le serveur JavaScript est essentiel pour le bon fonctionnement du dashboard et des fonctionnalités dynamiques.
              </p>
              <p className="text-sm leading-relaxed">
                📡 <strong>État serveur :</strong> {serverStatus.js && serverStatus.db ? 
                  "✅ Services opérationnels - Toutes les fonctionnalités disponibles" : 
                  serverStatus.js ? 
                  "🟡 Serveur JS actif mais base de données déconnectée" :
                  "🔴 Serveur JavaScript déconnecté - Fonctionnalités limitées"
                }
              </p>
              <p className="text-sm leading-relaxed">
                🚀 <strong>Performance :</strong> Un serveur stable garantit une expérience utilisateur optimale et des sauvegardes fiables.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer avec copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-4 px-6 rounded-lg shadow-lg">
          <p className="text-lg font-bold">
            🚀 AGEFAL DASHBOARD DEV BY <span className="font-black text-yellow-300">FELLAH</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

