 // wdoc.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Lock, 
  User, 
  Edit, 
  Image as ImageIcon, 
  Settings, 
  Home, 
  BookOpen, 
  Camera, 
  Calendar, 
  FileText, 
  Mail, 
  Menu,
  Wrench,
  Users,
  ClipboardList,
  Building,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ChevronLeft,
  Plus,
  Trash,
  Edit2,
  Key,
  UserPlus
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type UserRole = 'admin' | 'editor' | 'request-manager';

interface User {
  id: string;
  username: string;
  pin: string;
  role: UserRole;
  createdAt: string;
}

interface Config {
  home: {
    title: string;
    intro: string;
    bgImage: string;
    sections: {
      formations: string;
      services: string;
      gallery: string;
      workshops: string;
      events: string;
      contact: string;
    };
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    team: {
      name: string;
      phone: string;
      position: string;
    }[];
  };
  footer: {
    description: string;
    quickLinks: string[];
    copyright: string;
  };
}

export const WDoc = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [isEditingUser, setIsEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'createdAt'>>({ 
    username: '', 
    pin: '', 
    role: 'editor' 
  });
  const { toast } = useToast();

  // Load users and config from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('wdoc-users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers: User[] = [
        { 
          id: crypto.randomUUID(),
          username: 'admin', 
          pin: '1234', 
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('wdoc-users', JSON.stringify(defaultUsers));
    }

    const savedConfig = localStorage.getItem('wdoc-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      const defaultConfig: Config = {
        home: {
          title: "Centre d'excellence en formation professionnelle",
          intro: "ACTL propose une gamme complète de formations professionnelles dans divers secteurs : automobile, logistique, commerce, finances et ressources humaines, pour préparer les experts de demain.",
          bgImage: "/rachef-uploads/d30e9f68-60af-4517-a13f-dc4c3610eb9a.png",
          sections: {
            formations: "Découvrez nos programmes de formation conçus pour développer vos compétences professionnelles dans divers secteurs.",
            services: "Découvrez les services que nous proposons pour accompagner votre réussite professionnelle.",
            gallery: "Découvrez nos installations modernes et nos sessions de formation qui préparent nos étudiants à exceller dans leurs domaines professionnels.",
            workshops: "Découvrez nos infrastructures modernes conçues pour offrir la meilleure expérience d'apprentissage possible.",
            events: "Restez informé des derniers événements et opportunités chez ACTL.",
            contact: "Prêt à démarrer votre formation professionnelle ? Contactez-nous dès aujourd'hui pour obtenir plus d'informations sur nos programmes ou pour vous inscrire à une formation."
          }
        },
        contact: {
          phone: "+213 23803732",
          email: "s.dg-actl@groupe-logitrans.dz",
          address: "Route de la verte Rive Bordj El Kiffan - Alger",
          hours: "Dimanche au Jeudi, 09h00 à 17h00",
          team: [
            {
              name: "HANIZ LIAS",
              phone: "0770768368",
              position: "DIRECTEUR DE LA FORMATION ET DE LA PEDAGOGIE"
            },
            {
              name: "KHEROUANI ADEL",
              phone: "0780563447",
              position: "DIRECTEUR COMMERCIAL"
            },
            {
              name: "BOUCHENAK AMER",
              phone: "0770289968",
              position: "COMMERCIAL"
            },
            {
              name: "DAMICHZ ZINAB",
              phone: "0780803591",
              position: "COMMERCIAL"
            }
          ]
        },
        footer: {
          description: "École de formation professionnelle spécialisée dans le domaine de l'automobile et de la logistique.",
          quickLinks: ["Accueil", "Formations", "Événements", "Marchés et Consultations", "Contact"],
          copyright: "© 2025 ACTL. Tous droits réservés."
        }
      };
      setConfig(defaultConfig);
      localStorage.setItem('wdoc-config', JSON.stringify(defaultConfig));
    }
  }, []);

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.pin === pin);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.username}`,
      });
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Nom d'utilisateur ou PIN incorrect",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveModule(null);
    setUsername('');
    setPin('');
  };

  const updateConfig = (path: string, value: any) => {
    if (!config) return;
    
    const pathParts = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config));
    
    let current = newConfig;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    
    setConfig(newConfig);
    localStorage.setItem('wdoc-config', JSON.stringify(newConfig));
    toast({
      title: "Configuration mise à jour",
      description: "Les modifications ont été enregistrées",
    });
  };

  const addUser = () => {
    if (!newUser.username || !newUser.pin) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (users.some(u => u.username === newUser.username)) {
      toast({
        title: "Erreur",
        description: "Ce nom d'utilisateur existe déjà",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: crypto.randomUUID(),
      ...newUser,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('wdoc-users', JSON.stringify(updatedUsers));
    
    setNewUser({ username: '', pin: '', role: 'editor' });
    toast({
      title: "Succès",
      description: "Utilisateur ajouté avec succès",
    });
  };

  const updateUser = () => {
    if (!isEditingUser) return;

    const updatedUsers = users.map(u => 
      u.id === isEditingUser.id ? isEditingUser : u
    );

    setUsers(updatedUsers);
    localStorage.setItem('wdoc-users', JSON.stringify(updatedUsers));
    setIsEditingUser(null);
    
    toast({
      title: "Succès",
      description: "Utilisateur mis à jour avec succès",
    });
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas supprimer tous les utilisateurs",
        variant: "destructive"
      });
      return;
    }

    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('wdoc-users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Succès",
      description: "Utilisateur supprimé avec succès",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <img 
                src="/rachef-uploads/d30e9f68-60af-4517-a13f-dc4c3610eb9a.png" 
                alt="ACTL Logo" 
                className="mx-auto h-24 w-auto mb-6"
              />
            </motion.div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Panneau d'administration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Modifier le site web ACTL dynamiquement
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10 space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  Code PIN (4 chiffres)
                </label>
                <div className="relative">
                  <Input
                    id="pin"
                    name="pin"
                    type="password"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="mt-1"
                  />
                  <Key className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleLogin}
                className="w-full flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-actl-green to-green-600 hover:from-actl-green/90 hover:to-green-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-actl-green transition-all duration-300"
              >
                <Lock className="h-5 w-5 mr-2" />
                Accéder
              </Button>
            </motion.div>
          </motion.div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Module créé et développé par Fellah Teams — Since 2025 ^^</p>
          </div>
        </motion.div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/rachef-uploads/d30e9f68-60af-4517-a13f-dc4c3610eb9a.png" 
              alt="ACTL Logo" 
              className="h-10"
            />
            <h1 className="text-xl font-bold text-gray-900">Panneau d'administration</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block px-3 py-1 rounded-full bg-actl-light-green text-actl-green text-sm font-medium">
              {currentUser?.role === 'admin' && 'Administrateur'}
              {currentUser?.role === 'editor' && 'Éditeur'}
              {currentUser?.role === 'request-manager' && 'Gestionnaire'}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm flex items-center"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <Lock className="h-4 w-4 sm:ml-2" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!activeModule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module d'accueil */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('home')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Home className="h-6 w-6" />
                  </div>
                  <CardTitle>Module d'accueil</CardTitle>
                  <CardDescription>
                    Modifier le logo d'accueil et les informations de la page d'accueil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-green-600">Actif</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Formations */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('formations')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>Module Formations</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Nos Services */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('services')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <CardTitle>Module Nos Services</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Galerie */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('gallery')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Camera className="h-6 w-6" />
                  </div>
                  <CardTitle>Module Galerie</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Ateliers */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('workshops')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Building className="h-6 w-6" />
                  </div>
                  <CardTitle>Nos Ateliers</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Événements */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('events')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <CardTitle>Événements et Actualités</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Marchés */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('markets')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <CardTitle>Marchés et Consultations</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Contact */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('contact')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <CardTitle>Contactez-nous</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Navigation */}
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => setActiveModule('navigation')}
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                    <Menu className="h-6 w-6" />
                  </div>
                  <CardTitle>La navigation bare</CardTitle>
                  <CardDescription>
                    En cours de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Statut:</span>
                    <span className="text-yellow-600">En développement</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div>
            <motion.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => setActiveModule(null)}
                variant="outline"
                className="mb-6 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour au menu
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeModule === 'home' && config && (
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Édition de la page d'accueil</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Image de fond</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/2">
                            <img 
                              src={config.home.bgImage} 
                              alt="Background" 
                              className="rounded-lg shadow-md w-full h-auto max-h-64 object-cover"
                            />
                          </div>
                          <div className="w-full md:w-1/2 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de l'image
                              </label>
                              <Input
                                value={config.home.bgImage}
                                onChange={(e) => updateConfig('home.bgImage', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                            <div className="text-sm text-gray-500">
                              <p>Conseil : Utilisez une image haute résolution (minimum 1920x1080)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Titre principal</h3>
                        <Input
                          value={config.home.title}
                          onChange={(e) => updateConfig('home.title', e.target.value)}
                          className="text-xl font-bold"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Introduction</h3>
                        <textarea
                          value={config.home.intro}
                          onChange={(e) => updateConfig('home.intro', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[120px]"
                          rows={5}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Sections</h3>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description Formations
                            </label>
                            <textarea
                              value={config.home.sections.formations}
                              onChange={(e) => updateConfig('home.sections.formations', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description Services
                            </label>
                            <textarea
                              value={config.home.sections.services}
                              onChange={(e) => updateConfig('home.sections.services', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description Galerie
                            </label>
                            <textarea
                              value={config.home.sections.gallery}
                              onChange={(e) => updateConfig('home.sections.gallery', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description Ateliers
                            </label>
                            <textarea
                              value={config.home.sections.workshops}
                              onChange={(e) => updateConfig('home.sections.workshops', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description Événements
                            </label>
                            <textarea
                              value={config.home.sections.events}
                              onChange={(e) => updateConfig('home.sections.events', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description Contact
                            </label>
                            <textarea
                              value={config.home.sections.contact}
                              onChange={(e) => updateConfig('home.sections.contact', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'contact' && config && (
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Édition des informations de contact</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Informations de base</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Téléphone
                            </label>
                            <Input
                              value={config.contact.phone}
                              onChange={(e) => updateConfig('contact.phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <Input
                              value={config.contact.email}
                              onChange={(e) => updateConfig('contact.email', e.target.value)}
                              type="email"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Adresse
                            </label>
                            <Input
                              value={config.contact.address}
                              onChange={(e) => updateConfig('contact.address', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Heures d'ouverture
                            </label>
                            <Input
                              value={config.contact.hours}
                              onChange={(e) => updateConfig('contact.hours', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Équipe commerciale</h3>
                        <div className="space-y-4">
                          {config.contact.team.map((member, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom
                                  </label>
                                  <Input
                                    value={member.name}
                                    onChange={(e) => {
                                      const newTeam = [...config.contact.team];
                                      newTeam[index].name = e.target.value;
                                      updateConfig('contact.team', newTeam);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Téléphone
                                  </label>
                                  <Input
                                    value={member.phone}
                                    onChange={(e) => {
                                      const newTeam = [...config.contact.team];
                                      newTeam[index].phone = e.target.value;
                                      updateConfig('contact.team', newTeam);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Poste
                                  </label>
                                  <Input
                                    value={member.position}
                                    onChange={(e) => {
                                      const newTeam = [...config.contact.team];
                                      newTeam[index].position = e.target.value;
                                      updateConfig('contact.team', newTeam);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const newTeam = config.contact.team.filter((_, i) => i !== index);
                                    updateConfig('contact.team', newTeam);
                                  }}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            onClick={() => {
                              const newTeam = [...config.contact.team, {
                                name: '',
                                phone: '',
                                position: ''
                              }];
                              updateConfig('contact.team', newTeam);
                            }}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un membre
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Pied de page</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={config.footer.description}
                              onChange={(e) => updateConfig('footer.description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-actl-green focus:border-actl-green sm:text-sm min-h-[80px]"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Liens rapides
                            </label>
                            <div className="space-y-2">
                              {config.footer.quickLinks.map((link, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    value={link}
                                    onChange={(e) => {
                                      const newLinks = [...config.footer.quickLinks];
                                      newLinks[index] = e.target.value;
                                      updateConfig('footer.quickLinks', newLinks);
                                    }}
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const newLinks = config.footer.quickLinks.filter((_, i) => i !== index);
                                      updateConfig('footer.quickLinks', newLinks);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                onClick={() => {
                                  const newLinks = [...config.footer.quickLinks, ''];
                                  updateConfig('footer.quickLinks', newLinks);
                                }}
                                size="sm"
                                variant="outline"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter un lien
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Copyright
                            </label>
                            <Input
                              value={config.footer.copyright}
                              onChange={(e) => updateConfig('footer.copyright', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(activeModule === 'formations' || 
                  activeModule === 'services' || 
                  activeModule === 'gallery' || 
                  activeModule === 'workshops' || 
                  activeModule === 'events' || 
                  activeModule === 'markets' || 
                  activeModule === 'navigation') && (
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      {activeModule === 'formations' && 'Module Formations'}
                      {activeModule === 'services' && 'Module Nos Services'}
                      {activeModule === 'gallery' && 'Module Galerie'}
                      {activeModule === 'workshops' && 'Module Ateliers'}
                      {activeModule === 'events' && 'Module Événements'}
                      {activeModule === 'markets' && 'Module Marchés'}
                      {activeModule === 'navigation' && 'Module Navigation'}
                    </h2>
                    <div className="text-center py-12">
                      <div className="mx-auto h-24 w-24 bg-actl-light-green rounded-full flex items-center justify-center mb-6">
                        <Settings className="h-12 w-12 text-actl-green" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">En cours de développement</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Cette fonctionnalité est actuellement en développement et sera disponible prochainement.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {currentUser?.role === 'admin' && !activeModule && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Administration des utilisateurs</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Ajouter un nouvel utilisateur</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom d'utilisateur
                    </label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code PIN (4 chiffres)
                    </label>
                    <Input
                      value={newUser.pin}
                      onChange={(e) => setNewUser({...newUser, pin: e.target.value.replace(/\D/g, '')})}
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="admin">Administrateur</option>
                      <option value="editor">Éditeur</option>
                      <option value="request-manager">Gestionnaire</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={addUser}
                      className="w-full"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Liste des utilisateurs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom d'utilisateur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Créé le
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {user.username}
                              {user.id === currentUser.id && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Vous
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.role === 'admin' && 'Administrateur'}
                              {user.role === 'editor' && 'Éditeur'}
                              {user.role === 'request-manager' && 'Gestionnaire'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.id !== currentUser.id ? (
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsEditingUser(user)}
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Modifier
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Supprimer
                                </Button>
                              </div>
                            ) : (
                              <span className="text-gray-400">Non modifiable</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-bold mb-4">Modifier l'utilisateur</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'utilisateur
                  </label>
                  <Input
                    value={isEditingUser.username}
                    onChange={(e) => setIsEditingUser({...isEditingUser, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code PIN (4 chiffres)
                  </label>
                  <Input
                    value={isEditingUser.pin}
                    onChange={(e) => setIsEditingUser({...isEditingUser, pin: e.target.value.replace(/\D/g, '')})}
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    value={isEditingUser.role}
                    onChange={(e) => setIsEditingUser({...isEditingUser, role: e.target.value as UserRole})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="editor">Éditeur</option>
                    <option value="request-manager">Gestionnaire</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingUser(null)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={updateUser}
                >
                  Enregistrer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};    