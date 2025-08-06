import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Eye, Lock, ChevronLeft, Trash, Plus, Edit, Check, X } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Home } from "lucide-react";

type UserRole = 'admin' | 'editor';

interface User {
  id: string;
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
  users: User[];
}

export const WDoc = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [config, setConfig] = useState<Config | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config.json');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Failed to load config", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger la configuration",
          variant: "destructive"
        });
      }
    };

    loadConfig();
  }, []);

  const handleLogin = () => {
    if (!config) return;

    const user = config.users.find(u => u.pin === pin);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.role === 'admin' ? 'Administrateur' : 'Éditeur'}`,
      });
    } else {
      toast({
        title: "Code PIN incorrect",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    try {
      // En production, vous enverriez ça à un serveur
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        toast({
          title: "Configuration sauvegardée",
          description: "Les modifications ont été enregistrées",
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Les modifications n'ont pas pu être sauvegardées",
        variant: "destructive"
      });
    }
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
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <img 
              src="/rachef-uploads/895b9f7a-e550-40cd-ad1b-42bc954e2f3d.png" 
              alt="ACTL Logo" 
              className="mx-auto h-20 mb-4"
            />
            <h2 className="text-2xl font-bold">Administration ACTL</h2>
            <p className="text-gray-600 mt-2">Entrez votre code PIN</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1,2,3,4,5,6,7,8,9,'',0,''].map((num) => (
              <motion.div
                whileTap={{ scale: 0.95 }}
                key={num}
              >
                {num !== '' ? (
                  <button
                    onClick={() => setPin(p => p.length < 4 ? p + num : p)}
                    className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    {num}
                  </button>
                ) : (
                  <div className="w-full h-12"></div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {Array(4).fill(0).map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < pin.length ? 'bg-actl-green' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
            {pin.length > 0 && (
              <button 
                onClick={() => setPin('')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleLogin}
              disabled={pin.length !== 4}
              className="w-full py-3 bg-gradient-to-r from-actl-green to-green-600 hover:from-actl-green/90 hover:to-green-600/90"
            >
              <Lock className="h-5 w-5 mr-2" />
              Se connecter
            </Button>
          </motion.div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Module développé par Fellah Teams © 2025</p>
          </div>
        </motion.div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Boutons flottants */}
      <div className="fixed bottom-6 right-6 flex space-x-3 z-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => navigate('/')}
            className="rounded-full h-14 w-14 shadow-xl bg-white text-actl-green hover:bg-gray-100"
            size="icon"
          >
            <Eye className="h-6 w-6" />
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleSave}
            className="rounded-full h-14 w-14 shadow-xl bg-actl-green hover:bg-actl-green/90"
            size="icon"
          >
            <Save className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => setActiveModule(null)}
            className="flex items-center text-actl-green"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span>Menu</span>
          </button>
          <div className="text-sm font-medium px-3 py-1 bg-actl-light-green text-actl-green rounded-full">
            {currentUser?.role === 'admin' ? 'Administrateur' : 'Éditeur'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!activeModule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'home', icon: Home, title: 'Module Accueil', desc: 'Modifier logo et contenu de la page d\'accueil' },
              { id: 'contact', icon: Mail, title: 'Module Contact', desc: 'Gérer les informations de contact' },
              // ... autres modules
            ].map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ y: -5 }}
              >
                <Card 
                  onClick={() => setActiveModule(module.id)}
                  className="cursor-pointer h-full"
                >
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-actl-light-green text-actl-green mb-4">
                      <module.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {activeModule === 'home' && config && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Édition de l'accueil</h2>
                
                <div>
                  <label className="block mb-2 font-medium">Titre principal</label>
                  <Input
                    value={config.home.title}
                    onChange={(e) => updateConfig('home.title', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Introduction</label>
                  <textarea
                    value={config.home.intro}
                    onChange={(e) => updateConfig('home.intro', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-actl-green focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Image de fond</label>
                  <Input
                    value={config.home.bgImage}
                    onChange={(e) => updateConfig('home.bgImage', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">URL de l'image ou chemin local</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Textes des sections</h3>
                  {Object.entries(config.home.sections).map(([key, value]) => (
                    <div key={key} className="mb-4">
                      <label className="block mb-2 font-medium capitalize">{key}</label>
                      <textarea
                        value={value}
                        onChange={(e) => updateConfig(`home.sections.${key}`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-actl-green focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModule === 'contact' && config && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Édition des contacts</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Téléphone</label>
                    <Input
                      value={config.contact.phone}
                      onChange={(e) => updateConfig('contact.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Email</label>
                    <Input
                      value={config.contact.email}
                      onChange={(e) => updateConfig('contact.email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Adresse</label>
                    <Input
                      value={config.contact.address}
                      onChange={(e) => updateConfig('contact.address', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Heures d'ouverture</label>
                    <Input
                      value={config.contact.hours}
                      onChange={(e) => updateConfig('contact.hours', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Équipe commerciale</h3>
                  {config.contact.team.map((member, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block mb-2 font-medium">Nom</label>
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
                          <label className="block mb-2 font-medium">Téléphone</label>
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
                          <label className="block mb-2 font-medium">Poste</label>
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

                <div>
                  <h3 className="text-lg font-semibold mb-4">Pied de page</h3>
                  <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                      value={config.footer.description}
                      onChange={(e) => updateConfig('footer.description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-actl-green focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 font-medium">Liens rapides</label>
                    {config.footer.quickLinks.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
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
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un lien
                    </Button>
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 font-medium">Copyright</label>
                    <Input
                      value={config.footer.copyright}
                      onChange={(e) => updateConfig('footer.copyright', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};