import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  FileText, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Users,
  Settings,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  Save,
  MapPin,
  Search,
  Lightbulb,
  Shield
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import toast from 'react-hot-toast';

interface MarketRegistration {
  id: string;
  code: string;
  market: {
    id: string;
    title: string;
  };
  userData: {
    nom: string;
    prenom: string;
    entreprise: string;
    email: string;
    telephone: string;
    adresse: string;
    siret: string;
  };
  status: string;
  submittedAt: string;
  documents: {
    proposition: string;
    infosPdf: string;
  };
  notes: string;
  lastUpdated: string;
}

interface Market {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'open' | 'closed' | 'draft';
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export const MarketsSection: React.FC = () => {
  const { datapJson, updateField, addItem, removeItem, saveData } = useDashboardStore();
  const { hasPermission, currentAdmin } = useAuthStore();
  
  // Vérifications des permissions (doivent être définies avant leur utilisation)
  const canEditContent = hasPermission('edit_markets') && hasPermission('edit_pages');
  const canManageMarkets = hasPermission('manage_markets');
  
  const [activeTab, setActiveTab] = useState(canEditContent ? 'content' : 'registrations');
  const [isEditing, setIsEditing] = useState(false);
  
  // Si aucune permission, afficher message d'accès interdit
  if (!canEditContent && !canManageMarkets) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
          <p className="text-gray-500">Vous n'avez pas les permissions pour accéder à cette section.</p>
        </div>
      </div>
    );
  }
  const [isAddMarketOpen, setIsAddMarketOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [localFields, setLocalFields] = useState({
    title: datapJson?.marches?.title || 'Marchés et Consultations',
    description: datapJson?.marches?.description || 'Consultez les appels d\'offres et consultations en cours.',
    suiviTitle: 'Suivi de votre dossier',
    suiviDescription: 'Entrez votre code unique pour consulter l\'état de votre candidature et télécharger vos documents',
    suiviPlaceholder: 'Entrez votre code (ex: ACTL-XYZ123-ABC4)',
    suiviButtonText: 'Consulter mon dossier'
  });

  const [newMarket, setNewMarket] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
    status: 'draft',
    cahierCharges: null
  });

  // Marchés gérés par l'admin (simulés)
  const [markets, setMarkets] = useState([
    {
      id: 'market-001',
      title: 'Fourniture d\'équipements de formation automobile',
      description: 'Appel d\'offres pour la fourniture d\'équipements modernes de diagnostic automobile pour nos ateliers de formation.',
      deadline: '2025-03-15',
      budget: '1 500 000 DZD',
      status: 'open',
      cahierCharges: 'cahier-des-charges-equipements.pdf',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-20T15:30:00Z'
    },
    {
      id: 'market-002',
      title: 'Services de maintenance des véhicules de formation',
      description: 'Consultation pour les services de maintenance préventive et corrective des véhicules utilisés pour la formation pratique.',
      deadline: '2025-02-28',
      budget: '800 000 DZD',
      status: 'closed',
      cahierCharges: 'cahier-des-charges-maintenance.pdf',
      createdAt: '2025-01-05T14:00:00Z',
      updatedAt: '2025-01-18T10:45:00Z'
    }
  ]);

  // Données simulées des inscriptions
  const [registrations, setRegistrations] = useState<MarketRegistration[]>([
    {
      id: 'reg_001',
      code: 'ACTL-M2K5H9-XR4P',
      market: {
        id: 'market-001',
        title: 'Fourniture d\'équipements de formation automobile'
      },
      userData: {
        nom: 'DUPONT',
        prenom: 'Jean',
        entreprise: 'TechAuto Solutions',
        email: 'j.dupont@techauto.fr',
        telephone: '0612345678',
        adresse: '15 Rue de l\'Innovation, 75001 Paris',
        siret: '12345678901234'
      },
      status: 'dossier en traitement',
      submittedAt: '2025-01-20T10:30:00Z',
      documents: {
        proposition: 'proposition_techauto_001.pdf',
        infosPdf: 'infos_dupont_001.pdf'
      },
      notes: '',
      lastUpdated: '2025-01-21T14:20:00Z'
    },
    {
      id: 'reg_002',
      code: 'ACTL-P7N2K8-FM5T',
      market: {
        id: 'market-002',
        title: 'Services de maintenance des véhicules de formation'
      },
      userData: {
        nom: 'MARTIN',
        prenom: 'Sophie',
        entreprise: 'AutoService Pro',
        email: 's.martin@autoservice.fr',
        telephone: '0687654321',
        adresse: '88 Avenue des Mécaniciens, 13001 Marseille',
        siret: '98765432109876'
      },
      status: 'vue',
      submittedAt: '2025-01-18T16:45:00Z',
      documents: {
        proposition: 'proposition_autoservice_002.pdf',
        infosPdf: 'infos_martin_002.pdf'
      },
      notes: 'Dossier en cours d\'évaluation technique',
      lastUpdated: '2025-01-22T09:15:00Z'
    },
    {
      id: 'reg_003',
      code: 'ACTL-Q9B3L6-VH7R',
      market: {
        id: 'market-001',
        title: 'Fourniture d\'équipements de formation automobile'
      },
      userData: {
        nom: 'BERNARD',
        prenom: 'Pierre',
        entreprise: 'Équipements Formation',
        email: 'p.bernard@equipform.com',
        telephone: '0556789012',
        adresse: '42 Boulevard Technique, 69000 Lyon',
        siret: '11223344556677'
      },
      status: 'accepter contact dans les plus bref delais',
      submittedAt: '2025-01-15T11:20:00Z',
      documents: {
        proposition: 'proposition_equipform_003.pdf',
        infosPdf: 'infos_bernard_003.pdf'
      },
      notes: 'Proposition sélectionnée - Contact immédiat requis',
      lastUpdated: '2025-01-23T08:30:00Z'
    }
  ]);

  const statusOptions = [
    'pas encore vue',
    'vue', 
    'dossier en traitement',
    'dossier en charge',
    'refuser',
    'accepter contact dans les plus bref delais',
    'accepter'
  ];

  const handleChange = (field: string, value: string) => {
    setLocalFields(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateField('datap', 'marches.title', localFields.title);
    updateField('datap', 'marches.description', localFields.description);
    updateField('datap', 'marches.suiviTitle', localFields.suiviTitle);
    updateField('datap', 'marches.suiviDescription', localFields.suiviDescription);
    updateField('datap', 'marches.suiviPlaceholder', localFields.suiviPlaceholder);
    updateField('datap', 'marches.suiviButtonText', localFields.suiviButtonText);
    saveData();
    setIsEditing(false);
    toast.success('Contenu de la page marché sauvegardé !');
  };

  const handleStatusChange = (registrationId: string, newStatus: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId 
          ? { ...reg, status: newStatus, lastUpdated: new Date().toISOString() }
          : reg
      )
    );
    
    // Simuler la sauvegarde dans market.json
    console.log(`💾 Statut mis à jour pour ${registrationId}: ${newStatus}`);
    toast.success(`Statut mis à jour: ${newStatus}`);
  };

  const handleNotesChange = (registrationId: string, notes: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId 
          ? { ...reg, notes, lastUpdated: new Date().toISOString() }
          : reg
      )
    );
  };

  // Fonctions de gestion des marchés
  const handleCahierChargesUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewMarket({...newMarket, cahierCharges: file});
      toast.success('Cahier des charges téléchargé');
    } else {
      toast.error('Veuillez sélectionner un fichier PDF');
    }
  };

  const handleAddMarket = () => {
    if (!newMarket.title || !newMarket.description || !newMarket.deadline || !newMarket.budget) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const market = {
      id: 'market-' + Date.now(),
      title: newMarket.title,
      description: newMarket.description,
      deadline: newMarket.deadline,
      budget: newMarket.budget,
      status: newMarket.status,
      cahierCharges: newMarket.cahierCharges ? newMarket.cahierCharges.name : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMarkets(prev => [...prev, market]);
    setNewMarket({ title: '', description: '', deadline: '', budget: '', status: 'draft', cahierCharges: null });
    setIsAddMarketOpen(false);
    
    console.log('💾 Nouveau marché créé:', market);
    toast.success('Marché créé avec succès !');
  };

  const handleEditMarket = (market) => {
    setEditingMarket(market);
    setNewMarket({
      title: market.title,
      description: market.description,
      deadline: market.deadline,
      budget: market.budget,
      status: market.status,
      cahierCharges: null // Reset file input for editing
    });
  };

  const handleUpdateMarket = () => {
    if (!newMarket.title || !newMarket.description || !newMarket.deadline || !newMarket.budget) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setMarkets(prev => 
      prev.map(market => 
        market.id === editingMarket.id 
          ? { 
              ...market, 
              title: newMarket.title,
              description: newMarket.description,
              deadline: newMarket.deadline,
              budget: newMarket.budget,
              status: newMarket.status,
              cahierCharges: newMarket.cahierCharges ? newMarket.cahierCharges.name : market.cahierCharges,
              updatedAt: new Date().toISOString()
            }
          : market
      )
    );

    setEditingMarket(null);
    setNewMarket({ title: '', description: '', deadline: '', budget: '', status: 'draft', cahierCharges: null });
    
    console.log('💾 Marché mis à jour:', editingMarket.id);
    toast.success('Marché mis à jour avec succès !');
  };

  const handleDeleteMarket = (marketId: string, marketStatus: string) => {
    if (marketStatus !== 'closed') {
      toast.error('Seuls les marchés fermés peuvent être supprimés');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce marché fermé ?')) {
      setMarkets(prev => prev.filter(market => market.id !== marketId));
      console.log('🗑️ Marché supprimé:', marketId);
      toast.success('Marché supprimé avec succès !');
    }
  };

  const handleMarketStatusChange = (marketId: string, newStatus: string) => {
    setMarkets(prev => 
      prev.map(market => 
        market.id === marketId 
          ? { ...market, status: newStatus, updatedAt: new Date().toISOString() }
          : market
      )
    );
    
    console.log(`💾 Statut du marché ${marketId} mis à jour: ${newStatus}`);
    toast.success(`Statut mis à jour: ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pas encore vue': { color: 'bg-gray-100 text-gray-800', icon: '📋' },
      'vue': { color: 'bg-blue-100 text-blue-800', icon: '👁️' },
      'dossier en traitement': { color: 'bg-yellow-100 text-yellow-800', icon: '⚙️' },
      'dossier en charge': { color: 'bg-orange-100 text-orange-800', icon: '📂' },
      'refuser': { color: 'bg-red-100 text-red-800', icon: '❌' },
      'accepter contact dans les plus bref delais': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'accepter': { color: 'bg-green-100 text-green-800', icon: '🎉' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: '📋' };
    
    return (
      <Badge className={config.color}>
        {config.icon} {status}
      </Badge>
    );
  };

  const getStatusStats = () => {
    const stats = registrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header moderne avec breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-slate-200 shadow-sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-emerald-600 font-medium">Marchés & Consultations</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                <Briefcase className="w-8 h-8 mr-3 text-emerald-600" />
                Marchés et Consultations
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Centre de contrôle pour la gestion complète de vos appels d'offres
              </p>
              {currentAdmin?.role === 'gestionnaire' && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-blue-600">
                  <Shield className="w-4 h-4" />
                  <span>Accès gestionnaire : Gestion des inscriptions uniquement</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-medium text-sm">Système actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">

              {/* Navigation moderne avec cartes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('content')}
            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              activeTab === 'content' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                : 'bg-white border border-slate-200 hover:border-emerald-300 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                activeTab === 'content' ? 'bg-white/20' : 'bg-emerald-100'
              }`}>
                <Edit className={`w-5 h-5 ${activeTab === 'content' ? 'text-white' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Édition de la page</h3>
                <p className={`text-sm ${activeTab === 'content' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  Modifiez le contenu public
                </p>
              </div>
            </div>
            {activeTab === 'content' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('registrations')}
            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              activeTab === 'registrations' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white border border-slate-200 hover:border-blue-300 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                activeTab === 'registrations' ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <Users className={`w-5 h-5 ${activeTab === 'registrations' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Inscriptions</h3>
                <p className={`text-sm ${activeTab === 'registrations' ? 'text-blue-100' : 'text-slate-500'}`}>
                  Gérez les candidatures
                </p>
              </div>
            </div>
            {activeTab === 'registrations' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('markets')}
            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              activeTab === 'markets' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                : 'bg-white border border-slate-200 hover:border-purple-300 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                activeTab === 'markets' ? 'bg-white/20' : 'bg-purple-100'
              }`}>
                <Briefcase className={`w-5 h-5 ${activeTab === 'markets' ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Administration</h3>
                <p className={`text-sm ${activeTab === 'markets' ? 'text-purple-100' : 'text-slate-500'}`}>
                  Créez et gérez les marchés
                </p>
              </div>
            </div>
            {activeTab === 'markets' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Contenu des onglets */}
        <Tabs value={canEditContent ? activeTab : "registrations"} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {canEditContent ? (
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Édition de la page</span>
              </TabsTrigger>
            ) : (
              <TabsTrigger 
                value="content" 
                disabled 
                className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
              >
                <Shield className="w-4 h-4" />
                <span>Édition (Accès restreint)</span>
              </TabsTrigger>
            )}
            
            {canManageMarkets ? (
              <TabsTrigger value="registrations" className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span>Gestion des Inscriptions</span>
              </TabsTrigger>
            ) : (
              <TabsTrigger 
                value="registrations" 
                disabled 
                className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
              >
                <Shield className="w-4 h-4" />
                <span>Inscriptions (Accès restreint)</span>
              </TabsTrigger>
            )}
            
            {canEditContent ? (
              <TabsTrigger value="markets" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Gestion des Marchés</span>
              </TabsTrigger>
            ) : (
              <TabsTrigger 
                value="markets" 
                disabled 
                className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
              >
                <Shield className="w-4 h-4" />
                <span>Marchés (Accès restreint)</span>
              </TabsTrigger>
            )}
          </TabsList>

                  {/* Onglet Édition de la page */}
          {canEditContent && (
            <TabsContent value="content" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Header de section avec indicateurs */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Edit className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Édition du contenu public</h2>
                        <p className="text-slate-500">Modifiez les textes qui apparaissent sur la page publique</p>
                      </div>
                    </div>
                    
                    {/* Indicateurs d'état */}
                    <div className="flex items-center space-x-4 mt-4">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                        isEditing ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                        <span>{isEditing ? 'Mode édition' : 'Mode lecture'}</span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Synchronisé</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Button
                          onClick={handleSave}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder les modifications
                        </Button>
                      </motion.div>
                    )}
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "secondary" : "default"}
                      className={`transition-all duration-300 shadow-lg ${
                        isEditing 
                          ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mode édition actif
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Activer l'édition
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenu éditable avec grille moderne */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Section Hero principale */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className={`h-full transition-all duration-500 ${
                    isEditing ? 'border-emerald-400 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50' : 'border-slate-200 shadow-sm'
                  }`}>
                    <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <div className="p-1 bg-white/20 rounded">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span>🏢 Section Hero - En-tête principal</span>
                      </CardTitle>
                      <CardDescription className="text-emerald-100">
                        Le titre et la description qui accueillent les visiteurs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-emerald-700 flex items-center space-x-2">
                          <span>📍</span>
                          <span>Titre principal de la page</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            value={localFields.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="mt-3 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 text-lg font-medium"
                            placeholder="Ex: Marchés et Consultations"
                          />
                        ) : (
                          <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                            <p className="font-semibold text-lg text-slate-800">{localFields.title}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-emerald-700 flex items-center space-x-2">
                          <span>📝</span>
                          <span>Description d'accueil</span>
                        </Label>
                        {isEditing ? (
                          <Textarea
                            value={localFields.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="mt-3 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 min-h-[120px]"
                            placeholder="Description qui apparaît sous le titre principal..."
                            rows={4}
                          />
                        ) : (
                          <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                            <p className="text-slate-700 leading-relaxed">{localFields.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Section Suivi de dossier */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className={`h-full transition-all duration-500 ${
                    isEditing ? 'border-blue-400 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-slate-200 shadow-sm'
                  }`}>
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <div className="p-1 bg-white/20 rounded">
                          <Search className="w-5 h-5" />
                        </div>
                        <span>🔍 Section Suivi de dossier</span>
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Interface pour que les utilisateurs suivent leurs candidatures
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-blue-700 flex items-center space-x-2">
                          <span>🎯</span>
                          <span>Titre de la section</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            value={localFields.suiviTitle}
                            onChange={(e) => handleChange('suiviTitle', e.target.value)}
                            className="mt-3 border-blue-300 focus:border-blue-500 focus:ring-blue-200 font-medium"
                            placeholder="Ex: Suivi de votre dossier"
                          />
                        ) : (
                          <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                            <p className="font-semibold text-slate-800">{localFields.suiviTitle}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-blue-700 flex items-center space-x-2">
                          <span>💬</span>
                          <span>Description explicative</span>
                        </Label>
                        {isEditing ? (
                          <Textarea
                            value={localFields.suiviDescription}
                            onChange={(e) => handleChange('suiviDescription', e.target.value)}
                            className="mt-3 border-blue-300 focus:border-blue-500 focus:ring-blue-200 min-h-[80px]"
                            placeholder="Explication pour les utilisateurs..."
                            rows={3}
                          />
                        ) : (
                          <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                            <p className="text-slate-700">{localFields.suiviDescription}</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-blue-700 flex items-center space-x-2">
                            <span>💡</span>
                            <span>Texte d'exemple dans l'input</span>
                          </Label>
                          {isEditing ? (
                            <Input
                              value={localFields.suiviPlaceholder}
                              onChange={(e) => handleChange('suiviPlaceholder', e.target.value)}
                              className="mt-3 border-blue-300 focus:border-blue-500 focus:ring-blue-200 font-mono text-sm"
                              placeholder="Ex: Entrez votre code (ex: ACTL-XYZ123-ABC4)"
                            />
                          ) : (
                            <div className="mt-3 p-3 bg-gray-100 rounded border font-mono text-sm text-slate-600">
                              {localFields.suiviPlaceholder}
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-semibold text-blue-700 flex items-center space-x-2">
                            <span>🔘</span>
                            <span>Texte du bouton</span>
                          </Label>
                          {isEditing ? (
                            <Input
                              value={localFields.suiviButtonText}
                              onChange={(e) => handleChange('suiviButtonText', e.target.value)}
                              className="mt-3 border-blue-300 focus:border-blue-500 focus:ring-blue-200 font-medium"
                              placeholder="Ex: Consulter mon dossier"
                            />
                          ) : (
                            <div className="mt-3 p-3 bg-blue-100 text-blue-800 rounded border font-medium text-center">
                              {localFields.suiviButtonText}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

                              {/* Aperçu en temps réel */}
                {!isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                  >
                    <Card className="overflow-hidden shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                        <CardTitle className="flex items-center space-x-2">
                          <Eye className="w-5 h-5" />
                          <span>👁️ Aperçu en temps réel</span>
                        </CardTitle>
                        <CardDescription className="text-slate-200">
                          Voici comment la page apparaît aux visiteurs sur le site public
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        {/* Simulation de la page publique */}
                        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-12">
                          <motion.h1 
                            className="text-4xl font-bold mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {localFields.title}
                          </motion.h1>
                          <motion.p 
                            className="text-xl text-green-100 max-w-3xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {localFields.description}
                          </motion.p>
                        </div>
                        
                        {/* Section suivi aperçu */}
                        <div className="bg-gray-50 p-8">
                          <div className="max-w-md mx-auto text-center">
                            <motion.h2 
                              className="text-2xl font-bold text-gray-900 mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {localFields.suiviTitle}
                            </motion.h2>
                            <motion.p 
                              className="text-gray-600 mb-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {localFields.suiviDescription}
                            </motion.p>
                            <div className="space-y-4">
                              <Input
                                placeholder={localFields.suiviPlaceholder}
                                className="text-center font-mono"
                                disabled
                              />
                              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                                <Search className="mr-2 h-4 w-4" />
                                {localFields.suiviButtonText}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Aide contextuelle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                    <CardHeader>
                      <CardTitle className="text-indigo-800 flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5" />
                        <span>💡 Conseils d'édition</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <h4 className="font-semibold text-indigo-700 mb-2">✨ Bonnes pratiques</h4>
                          <ul className="space-y-1 text-indigo-600">
                            <li>• Utilisez des titres clairs et informatifs</li>
                            <li>• Rédigez des descriptions concises mais complètes</li>
                            <li>• Testez l'aperçu avant de sauvegarder</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-indigo-700 mb-2">🔄 Synchronisation</h4>
                          <ul className="space-y-1 text-indigo-600">
                            <li>• Les modifications sont appliquées instantanément</li>
                            <li>• L'aperçu se met à jour en temps réel</li>
                            <li>• Sauvegardez pour publier sur le site</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
            </motion.div>
          </TabsContent>
          )}

          {!canEditContent && (
            <TabsContent value="content">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
                  <p className="text-gray-500">Vous n'avez pas les permissions pour éditer le contenu de la page.</p>
                  <p className="text-gray-400 text-sm mt-2">Contactez un administrateur pour obtenir l'accès.</p>
                </div>
              </div>
            </TabsContent>
          )}

        {/* Onglet Gestion des inscriptions */}
        {canManageMarkets && (
          <TabsContent value="registrations" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total inscriptions</p>
                      <p className="text-2xl font-bold">{registrations.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">En traitement</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {(stats['dossier en traitement'] || 0) + (stats['dossier en charge'] || 0)}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Acceptées</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(stats['accepter'] || 0) + (stats['accepter contact dans les plus bref delais'] || 0)}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Refusées</p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats['refuser'] || 0}
                      </p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des inscriptions */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">📋 Inscriptions aux consultations</h3>
              
              <AnimatePresence>
                {registrations.map((registration, index) => (
                  <motion.div
                    key={registration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center space-x-3 text-lg">
                              <UserCheck className="w-5 h-5 text-blue-600" />
                              <span>{registration.userData.nom} {registration.userData.prenom}</span>
                              <Badge variant="secondary" className="font-mono">
                                {registration.code}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="mt-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <span><strong>Entreprise:</strong> {registration.userData.entreprise}</span>
                                <span><strong>Email:</strong> {registration.userData.email}</span>
                                <span><strong>Consultation:</strong> {registration.market.title}</span>
                                <span><strong>Soumis le:</strong> {new Date(registration.submittedAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </CardDescription>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(registration.status)}
                            <span className="text-xs text-gray-500">
                              Mis à jour: {new Date(registration.lastUpdated).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Gestion du statut */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              🔄 Modifier le statut
                            </Label>
                            <Select
                              value={registration.status}
                              onValueChange={(value) => handleStatusChange(registration.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Notes */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              📝 Notes internes
                            </Label>
                            <Textarea
                              value={registration.notes}
                              onChange={(e) => handleNotesChange(registration.id, e.target.value)}
                              placeholder="Ajouter des notes..."
                              rows={2}
                              className="resize-none"
                            />
                          </div>
                        </div>
                        
                        {/* Documents */}
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium text-slate-700 mb-3">📄 Documents:</p>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              <Download className="w-3 h-3 mr-1" />
                              Proposition: {registration.documents.proposition}
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                              <FileText className="w-3 h-3 mr-1" />
                              Infos: {registration.documents.infosPdf}
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                              <Eye className="w-3 h-3 mr-1" />
                              Voir le profil complet
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {registrations.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Aucune inscription
                  </h3>
                  <p className="text-slate-500">
                    Les inscriptions aux consultations apparaîtront ici
                  </p>
                </CardContent>
              </Card>
                         )}
           </motion.div>
         </TabsContent>
         )}

         {!canManageMarkets && (
           <TabsContent value="registrations">
             <div className="flex items-center justify-center h-64">
               <div className="text-center">
                 <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                 <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
                 <p className="text-gray-500">Vous n'avez pas les permissions pour gérer les inscriptions.</p>
                 <p className="text-gray-400 text-sm mt-2">Contactez un administrateur pour obtenir l'accès.</p>
               </div>
             </div>
           </TabsContent>
         )}

         {/* Onglet Gestion des marchés */}
         {canEditContent && (
           <TabsContent value="markets" className="space-y-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
           >
             {/* En-tête avec bouton d'ajout */}
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h2 className="text-2xl font-bold text-slate-800">Administration des marchés</h2>
                 <p className="text-slate-600 text-sm mt-1">
                   Créez, modifiez et gérez les appels d'offres. Seuls les marchés ouverts sont visibles au public.
                 </p>
               </div>
               <Dialog open={isAddMarketOpen} onOpenChange={setIsAddMarketOpen}>
                 <DialogTrigger asChild>
                   <Button className="bg-emerald-600 hover:bg-emerald-700">
                     <Plus className="w-4 h-4 mr-2" />
                     Nouveau marché
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="max-w-2xl">
                   <DialogHeader>
                     <DialogTitle>
                       {editingMarket ? 'Modifier le marché' : 'Créer un nouveau marché'}
                     </DialogTitle>
                     <DialogDescription>
                       {editingMarket ? 'Modifiez les informations du marché' : 'Ajoutez un nouvel appel d\'offres ou consultation'}
                     </DialogDescription>
                   </DialogHeader>
                   <div className="space-y-4">
                     <div>
                       <Label htmlFor="market-title">Titre du marché *</Label>
                       <Input
                         id="market-title"
                         value={newMarket.title}
                         onChange={(e) => setNewMarket({...newMarket, title: e.target.value})}
                         placeholder="Ex: Fourniture d'équipements..."
                         className="mt-1"
                       />
                     </div>
                     
                     <div>
                       <Label htmlFor="market-description">Description *</Label>
                       <Textarea
                         id="market-description"
                         value={newMarket.description}
                         onChange={(e) => setNewMarket({...newMarket, description: e.target.value})}
                         placeholder="Description détaillée du marché..."
                         rows={4}
                         className="mt-1"
                       />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="market-deadline">Date limite *</Label>
                         <Input
                           id="market-deadline"
                           type="date"
                           value={newMarket.deadline}
                           onChange={(e) => setNewMarket({...newMarket, deadline: e.target.value})}
                           className="mt-1"
                         />
                       </div>
                       
                       <div>
                         <Label htmlFor="market-budget">Budget *</Label>
                         <Input
                           id="market-budget"
                           value={newMarket.budget}
                           onChange={(e) => setNewMarket({...newMarket, budget: e.target.value})}
                           placeholder="Ex: 1 500 000 DZD"
                           className="mt-1"
                         />
                       </div>
                     </div>
                     
                     <div>
                       <Label htmlFor="market-status">Statut</Label>
                       <Select
                         value={newMarket.status}
                         onValueChange={(value) => setNewMarket({...newMarket, status: value})}
                       >
                         <SelectTrigger className="mt-1">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="draft">📝 Brouillon</SelectItem>
                           <SelectItem value="open">🔓 Ouvert</SelectItem>
                           <SelectItem value="closed">🔒 Fermé</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     
                     {/* Upload Cahier des charges */}
                     <div>
                       <Label htmlFor="cahier-charges">Cahier des charges (PDF)</Label>
                       <div className="mt-2 border-2 border-dashed border-emerald-300 rounded-lg p-4 text-center">
                         <input
                           type="file"
                           id="cahier-charges"
                           accept=".pdf"
                           onChange={handleCahierChargesUpload}
                           className="hidden"
                         />
                         <label htmlFor="cahier-charges" className="cursor-pointer">
                           <FileText className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                           <p className="text-gray-600 text-sm">
                             {newMarket.cahierCharges ? 
                               `✅ ${newMarket.cahierCharges.name}` : 
                               'Cliquez pour télécharger le cahier des charges (PDF)'
                             }
                           </p>
                         </label>
                       </div>
                     </div>
                     
                     <div className="flex justify-end space-x-3 pt-4">
                                                <Button 
                           variant="outline" 
                           onClick={() => {
                             setIsAddMarketOpen(false);
                             setEditingMarket(null);
                             setNewMarket({ title: '', description: '', deadline: '', budget: '', status: 'draft', cahierCharges: null });
                           }}
                         >
                         Annuler
                       </Button>
                       <Button 
                         onClick={editingMarket ? handleUpdateMarket : handleAddMarket}
                         className="bg-emerald-600 hover:bg-emerald-700"
                       >
                         {editingMarket ? 'Mettre à jour' : 'Créer le marché'}
                       </Button>
                     </div>
                   </div>
                 </DialogContent>
               </Dialog>
             </div>

             {/* Statistiques des marchés */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
               <Card>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-slate-600">Total marchés</p>
                       <p className="text-2xl font-bold">{markets.length}</p>
                     </div>
                     <Briefcase className="w-8 h-8 text-blue-500" />
                   </div>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-slate-600">Ouverts</p>
                       <p className="text-2xl font-bold text-green-600">
                         {markets.filter(m => m.status === 'open').length}
                       </p>
                     </div>
                     <CheckCircle className="w-8 h-8 text-green-500" />
                   </div>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-slate-600">Fermés</p>
                       <p className="text-2xl font-bold text-red-600">
                         {markets.filter(m => m.status === 'closed').length}
                       </p>
                     </div>
                     <XCircle className="w-8 h-8 text-red-500" />
                   </div>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-slate-600">Brouillons</p>
                       <p className="text-2xl font-bold text-gray-600">
                         {markets.filter(m => m.status === 'draft').length}
                       </p>
                     </div>
                     <Clock className="w-8 h-8 text-gray-500" />
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Aide et règles */}
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
               <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Règles de gestion</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                 <div>
                   <strong>🔓 Marchés ouverts:</strong> Visibles au public, acceptent les candidatures
                 </div>
                 <div>
                   <strong>🔒 Marchés fermés:</strong> Non visibles au public, peuvent être supprimés
                 </div>
                 <div>
                   <strong>📝 Brouillons:</strong> Non visibles au public, en cours de préparation
                 </div>
               </div>
             </div>

             {/* Liste des marchés */}
             <div className="space-y-4">
               <h3 className="text-xl font-bold text-slate-800">📋 Marchés et consultations</h3>
               
               <AnimatePresence>
                 {markets.map((market, index) => (
                   <motion.div
                     key={market.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ delay: index * 0.05 }}
                   >
                     <Card className={`hover:shadow-lg transition-shadow ${
                       market.status === 'closed' ? 'border-red-200 bg-red-50' : 
                       market.status === 'open' ? 'border-green-200 bg-green-50' : 
                       'border-gray-200 bg-gray-50'
                     }`}>
                       <CardHeader className={
                         market.status === 'closed' ? 'bg-red-100' : 
                         market.status === 'open' ? 'bg-green-100' : 
                         'bg-gray-100'
                       }>
                         <div className="flex items-start justify-between">
                           <div className="flex-1">
                             <CardTitle className={`flex items-center space-x-3 text-lg ${
                               market.status === 'closed' ? 'text-red-800' : 
                               market.status === 'open' ? 'text-green-800' : 
                               'text-gray-800'
                             }`}>
                               <ShoppingCart className={`w-5 h-5 ${
                                 market.status === 'closed' ? 'text-red-600' : 
                                 market.status === 'open' ? 'text-green-600' : 
                                 'text-gray-600'
                               }`} />
                               <span>{market.title}</span>
                               {market.status === 'open' && <Badge className="bg-green-200 text-green-800 font-semibold">🔓 Ouvert</Badge>}
                               {market.status === 'closed' && <Badge className="bg-red-200 text-red-800 font-semibold">🔒 Fermé</Badge>}
                               {market.status === 'draft' && <Badge className="bg-gray-200 text-gray-800 font-semibold">📝 Brouillon</Badge>}
                             </CardTitle>
                             <CardDescription className="mt-2">
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                 <span><strong>Budget:</strong> {market.budget}</span>
                                 <span><strong>Échéance:</strong> {new Date(market.deadline).toLocaleDateString('fr-FR')}</span>
                                 <span><strong>Créé le:</strong> {new Date(market.createdAt).toLocaleDateString('fr-FR')}</span>
                               </div>
                               <p className="mt-2 text-slate-600">{market.description}</p>
                               {market.cahierCharges && (
                                 <div className="mt-2 flex items-center space-x-2 text-sm">
                                   <FileText className="w-4 h-4 text-emerald-600" />
                                   <span className="text-emerald-700 font-medium">
                                     Cahier des charges: {market.cahierCharges}
                                   </span>
                                 </div>
                               )}
                             </CardDescription>
                           </div>
                           
                           <div className="flex items-center space-x-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => {
                                 handleEditMarket(market);
                                 setIsAddMarketOpen(true);
                               }}
                               className="hover:bg-blue-100"
                             >
                               <Edit className="w-4 h-4 text-blue-600" />
                             </Button>
                             {market.status === 'closed' ? (
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 onClick={() => handleDeleteMarket(market.id, market.status)}
                                 className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                 title="Supprimer ce marché fermé"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             ) : (
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 disabled
                                 className="text-gray-400 cursor-not-allowed"
                                 title="Seuls les marchés fermés peuvent être supprimés"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             )}
                           </div>
                         </div>
                       </CardHeader>
                       
                       <CardContent>
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                             <div className="text-sm text-slate-600">
                               Mis à jour: {new Date(market.updatedAt).toLocaleDateString('fr-FR')}
                             </div>
                           </div>
                           
                           <div className="flex items-center space-x-3">
                             <Label className="text-sm font-medium text-slate-700">Statut:</Label>
                             <Select
                               value={market.status}
                               onValueChange={(value) => handleMarketStatusChange(market.id, value)}
                             >
                               <SelectTrigger className={`w-36 h-8 ${
                                 market.status === 'closed' ? 'border-red-300 bg-red-50 text-red-800' : 
                                 market.status === 'open' ? 'border-green-300 bg-green-50 text-green-800' : 
                                 'border-gray-300 bg-gray-50 text-gray-800'
                               }`}>
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="draft">📝 Brouillon</SelectItem>
                                 <SelectItem value="open">🔓 Ouvert</SelectItem>
                                 <SelectItem value="closed">🔒 Fermé</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>

             {markets.length === 0 && (
               <Card>
                 <CardContent className="text-center py-12">
                   <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-slate-600 mb-2">
                     Aucun marché créé
                   </h3>
                   <p className="text-slate-500 mb-6">
                     Commencez par créer votre premier appel d'offres
                   </p>
                   <Button onClick={() => setIsAddMarketOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                     <Plus className="w-4 h-4 mr-2" />
                     Créer un marché
                   </Button>
                 </CardContent>
               </Card>
             )}
                     </motion.div>
        </TabsContent>
        )}

        {!canEditContent && (
          <TabsContent value="markets">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
                <p className="text-gray-500">Vous n'avez pas les permissions pour gérer les marchés.</p>
                <p className="text-gray-400 text-sm mt-2">Contactez un administrateur pour obtenir l'accès.</p>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
       </div>
     </div>
   );
 };

