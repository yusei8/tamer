import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Upload, ArrowRight, Save, Edit3, Plus, X,
  CheckCircle, FileText, Target, Wrench, Briefcase, 
  CarFront, Wallet, Users, GraduationCap, Settings
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Navbar, Footer } from '../../Acceuil';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Map des icônes pour chaque formation
const FORMATION_ICONS = {
  finance: Wallet,
  mecanique: Wrench,
  commerce: Briefcase,
  diagnostic: Settings,
  conduite: CarFront,
  rh: Users
};

// Configuration des vraies pages avec leur structure exacte
const REAL_PAGE_STRUCTURES = {
  finance: {
    id: 'finance',
    name: 'Formation Finance',
    dataKey: 'financeFormation',
    icon: Wallet,
    programColumns: [
      { key: 'programStructure', title: 'Durée et structure', icon: CheckCircle },
      { key: 'teachingMethods', title: 'Méthodes d\'enseignement', icon: FileText },
      { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Wallet }
    ]
  },
  mecanique: {
    id: 'mecanique',
    name: 'Formation Mécanique',
    dataKey: 'mecaniqueFormation', 
    icon: Wrench,
    programColumns: [
      { key: 'programStructure', title: 'Structure du programme', icon: CheckCircle },
      { key: 'courseContent', title: 'Contenu du cours', icon: FileText },
      { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Target }
    ],
    hasWorkshopsSection: true
  },
  commerce: {
    id: 'commerce',
    name: 'Formation Commerce',
    dataKey: 'commerceFormation',
    icon: Briefcase,
    programColumns: [
      { key: 'programStructure', title: 'Structure du programme', icon: CheckCircle },
      { key: 'courseContent', title: 'Contenu du cours', icon: FileText },
      { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Target }
    ]
  },
  diagnostic: {
    id: 'diagnostic',
    name: 'Formation Diagnostic',
    dataKey: 'diagnosticFormation',
    icon: Settings,
    programColumns: [
      { key: 'programStructure', title: 'Structure du programme', icon: CheckCircle },
      { key: 'courseContent', title: 'Contenu du cours', icon: FileText },
      { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Target }
    ],
    hasEquipmentSection: true
  }
};

interface InlineFormationEditorProps {
  pageEditData: any;
  selectedTemplate: any;
  formationData: any;
  formationKey: string;
  updateField: (section: string, field: string, value: any) => void;
  onSave: () => void;
}

export const InlineFormationEditor: React.FC<InlineFormationEditorProps> = ({
  pageEditData,
  selectedTemplate,
  formationData,
  formationKey,
  updateField,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  // Obtenir la structure de la vraie page
  const pageStructure = REAL_PAGE_STRUCTURES[selectedTemplate.id] || REAL_PAGE_STRUCTURES.finance;
  const IconComponent = pageStructure.icon;

  // Fonction pour uploader une image
  const handleImageUpload = async (file: File, field: string) => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return null;
    }
    
    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('L\'image est trop volumineuse (max 10MB)');
      return null;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/upload`;
      console.log('Upload vers:', apiUrl);
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Réponse serveur:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Données reçues:', data);
        
        const imageUrl = `/rachef-uploads/${data.filename}`;
        updateField('datap', `${formationKey}.${field}`, imageUrl);
        toast.success('Image uploadée avec succès');
        return imageUrl;
      } else {
        const errorText = await res.text();
        console.error('Erreur serveur:', res.status, errorText);
        toast.error(`Erreur serveur: ${res.status} - ${errorText}`);
        return null;
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(`Erreur de connexion: ${error.message}`);
      return null;
    }
  };

  // Fonction pour mettre à jour une valeur
  const updateValue = (field: string, value: any) => {
    updateField('datap', `${formationKey}.${field}`, value);
  };

  // Fonction pour ajouter un élément à un tableau
  const addToArray = (field: string, newItem: string = '') => {
    const currentArray = formationData[field] || [];
    updateValue(field, [...currentArray, newItem]);
  };

  // Fonction pour supprimer un élément d'un tableau
  const removeFromArray = (field: string, index: number) => {
    const currentArray = formationData[field] || [];
    updateValue(field, currentArray.filter((_, i) => i !== index));
  };

  // Fonction pour mettre à jour un élément d'un tableau
  const updateArrayItem = (field: string, index: number, value: string) => {
    const currentArray = formationData[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateValue(field, newArray);
  };

  // Fonctions d'upload simplifiées
  const uploadGalleryImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file, 'galleryImages');
        if (imageUrl) {
          const current = formationData.galleryImages || [];
          updateValue('galleryImages', [...current, imageUrl]);
        }
      }
    };
    input.click();
  };

  const uploadEquipmentImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file, 'equipmentImages');
        if (imageUrl) {
          const current = formationData.equipmentImages || [];
          updateValue('equipmentImages', [...current, imageUrl]);
        }
      }
    };
    input.click();
  };

  const uploadWorkshopImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file, 'workshopImages');
        if (imageUrl) {
          const current = formationData.workshopImages || [];
          updateValue('workshopImages', [...current, imageUrl]);
        }
      }
    };
    input.click();
  };

  const replaceGalleryImage = async (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file, 'temp');
        if (imageUrl) {
          const current = [...(formationData.galleryImages || [])];
          current[index] = imageUrl;
          updateValue('galleryImages', current);
        }
      }
    };
    input.click();
  };

  const replaceEquipmentImage = async (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file, 'temp');
        if (imageUrl) {
          const current = [...(formationData.equipmentImages || [])];
          current[index] = imageUrl;
          updateValue('equipmentImages', current);
        }
      }
    };
    input.click();
  };

  const replaceWorkshopImage = async (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file, 'temp');
        if (imageUrl) {
          const current = [...(formationData.workshopImages || [])];
          current[index] = imageUrl;
          updateValue('workshopImages', current);
        }
      }
    };
    input.click();
  };

  return (
    <div className="relative">
      {/* Barre de contrôle - IDENTIQUE à HeroSection */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800">
            {pageStructure.name} - Édition en direct
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditing 
              ? "🟢 Mode édition ACTIVÉ - Vous pouvez maintenant éditer tous les champs" 
              : "⚪ Cliquez sur 'Activer l'édition' pour modifier cette page de formation"
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-lg px-6 py-3 font-semibold transition-all duration-300 ${
              isEditing 
                ? "bg-red-600 hover:bg-red-700 shadow-lg animate-pulse" 
                : "bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isEditing ? "🔴 Arrêter l'édition" : "✏️ Activer l'édition"}
          </Button>
          
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Indicateur visuel quand le mode édition est activé */}
      {isEditing && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Mode édition activé !</strong> Vous pouvez maintenant modifier tous les champs. 
                Les champs éditables sont encadrés en bleu. N'oubliez pas de cliquer sur "Sauvegarder" pour enregistrer vos modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page de formation - EXACTEMENT comme le site avec édition inline */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section - Édition inline */}
          <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-6">
                    <IconComponent className="h-4 w-4 mr-2 text-emerald-300" />
                    <span className="text-emerald-200 text-sm font-medium">
                      {isEditing ? (
                        <Input
                          value={formationData.badgeText || "Formation Professionnelle"}
                          onChange={(e) => updateValue('badgeText', e.target.value)}
                          className="bg-white/10 border border-white/30 text-emerald-200 text-sm"
                          placeholder="Formation Professionnelle"
                        />
                      ) : (
                        formationData.badgeText || "Formation Professionnelle"
                      )}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                      {isEditing ? (
                        <Textarea
                          value={formationData.title || pageEditData.title}
                          onChange={(e) => updateValue('title', e.target.value)}
                          className="bg-white/10 border border-white/30 text-white text-4xl font-bold min-h-32 resize-none"
                          placeholder="Titre de la formation"
                        />
                      ) : (
                        formationData.title || pageEditData.title
                      )}
                    </span>
                  </h1>
                  
                  <div className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                    {isEditing ? (
                      <Textarea
                        value={formationData.description || pageEditData.description}
                        onChange={(e) => updateValue('description', e.target.value)}
                        className="bg-white/10 border border-white/30 text-emerald-100 text-lg min-h-32"
                        placeholder="Description de la formation"
                      />
                    ) : (
                      <p>{formationData.description || pageEditData.description}</p>
                    )}
                  </div>
                  
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
                    {isEditing && (
                      <div className="absolute -top-4 -right-4 z-10">
                        <Button
                          onClick={() => heroImageInputRef.current?.click()}
                          size="sm"
                          className="bg-white/90 text-black hover:bg-white"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <input
                          ref={heroImageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleImageUpload(file, 'image');
                              e.target.value = ''; // Reset input
                            }
                          }}
                        />
                      </div>
                    )}
                    <img 
                      src={formationData.image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
                      alt={formationData.title || pageEditData.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Program Details - EXACTEMENT comme la vraie page avec édition inline */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {isEditing ? (
                  <Input
                    value={formationData.programDetailsTitle || "Détails du programme"}
                    onChange={(e) => updateValue('programDetailsTitle', e.target.value)}
                    className="border-2 border-emerald-300 text-center text-4xl font-bold bg-transparent"
                    placeholder="Titre de la section"
                  />
                ) : (
                  formationData.programDetailsTitle || "Détails du programme"
                )}
              </h2>
              <div className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {isEditing ? (
                  <Textarea
                    value={formationData.programDetailsDescription || (pageStructure.id === 'finance' ? "Maîtrisez la finance et la comptabilité avec une formation complète et pratique." : "Un programme complet conçu pour vous donner toutes les compétences nécessaires.")}
                    onChange={(e) => updateValue('programDetailsDescription', e.target.value)}
                    className="border-2 border-emerald-300 text-center min-h-20"
                    placeholder="Description de la section"
                  />
                ) : (
                  <p>
                    {formationData.programDetailsDescription || (pageStructure.id === 'finance' ? "Maîtrisez la finance et la comptabilité avec une formation complète et pratique." : "Un programme complet conçu pour vous donner toutes les compétences nécessaires.")}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pageStructure.programColumns.map((column) => (
                <Card key={column.key} className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <column.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                      {column.title}
                    </h3>
                    
                    {/* Liste éditable inline */}
                    <ul className="space-y-3">
                      {(formationData[column.key] || []).map((item, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200 flex-shrink-0" />
                          {isEditing ? (
                            <div className="flex items-center w-full space-x-2">
                              <Input
                                value={item}
                                onChange={(e) => updateArrayItem(column.key, index, e.target.value)}
                                className="border border-emerald-300 text-sm flex-1"
                                placeholder={`Élément ${column.title.toLowerCase()}...`}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromArray(column.key, index)}
                                className="text-red-600 h-8 w-8 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-600 leading-relaxed">{item}</span>
                          )}
                        </li>
                      ))}
                      
                      {/* Bouton ajouter en mode édition */}
                      {isEditing && (
                        <li className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToArray(column.key)}
                            className="border-dashed border-emerald-300 text-emerald-600 text-sm"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Ajouter
                          </Button>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications - SEULEMENT pour Finance - Édition inline */}
          {pageStructure.id === 'finance' && (
            <div className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">
                  {isEditing ? (
                    <Input
                      value={formationData.certificationTitle || "Certifications"}
                      onChange={(e) => updateValue('certificationTitle', e.target.value)}
                      className="border-2 border-emerald-300 text-center text-3xl font-bold bg-transparent"
                      placeholder="Titre des certifications"
                    />
                  ) : (
                    formationData.certificationTitle || "Certifications"
                  )}
                </h2>
                
                <div className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {isEditing ? (
                    <Textarea
                      value={formationData.certificationDescription || "Nos formations mènent à des certifications professionnelles reconnues dans l'industrie."}
                      onChange={(e) => updateValue('certificationDescription', e.target.value)}
                      className="border-2 border-emerald-300 text-center min-h-16"
                      placeholder="Description des certifications"
                    />
                  ) : (
                    <p>
                      {formationData.certificationDescription || "Nos formations mènent à des certifications professionnelles reconnues dans l'industrie."}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  {/* Utiliser directement formationData.certifications (pas .items) */}
                  {(formationData.certifications || []).map((cert, index) => (
                    <Card key={index} className="text-center p-6">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-gray-500">Certification {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newCerts = (formationData.certifications || []).filter((_, i) => i !== index);
                                updateValue('certifications', newCerts);
                              }}
                              className="text-red-600 h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <Input
                            value={cert.title || ''}
                            onChange={(e) => {
                              const newCerts = [...(formationData.certifications || [])];
                              newCerts[index] = { ...newCerts[index], title: e.target.value };
                              updateValue('certifications', newCerts);
                            }}
                            placeholder="Titre de la certification"
                            className="border border-emerald-300 text-sm"
                          />
                          <Textarea
                            value={cert.description || ''}
                            onChange={(e) => {
                              const newCerts = [...(formationData.certifications || [])];
                              newCerts[index] = { ...newCerts[index], description: e.target.value };
                              updateValue('certifications', newCerts);
                            }}
                            placeholder="Description"
                            className="border border-emerald-300 text-sm min-h-16"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                          <p className="text-sm text-gray-600">{cert.description}</p>
                        </>
                      )}
                    </Card>
                  ))}
                  
                  {/* Bouton ajouter certification */}
                  {isEditing && (
                    <Card className="text-center p-6 border-dashed border-2 border-emerald-300">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const current = formationData.certifications || [];
                          updateValue('certifications', [...current, { title: '', description: '' }]);
                        }}
                        className="border-dashed border-emerald-300 text-emerald-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter certification
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gallery - Formation en action - Édition inline */}
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-4">
                {isEditing ? (
                  <Input
                    value={formationData.galleryTitle || "Formation en action"}
                    onChange={(e) => updateValue('galleryTitle', e.target.value)}
                    className="border-2 border-emerald-300 text-center text-3xl font-bold bg-transparent"
                    placeholder="Titre de la galerie"
                  />
                ) : (
                  formationData.galleryTitle || "Formation en action"
                )}
              </h2>
              
              <div className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                {isEditing ? (
                  <Textarea
                    value={formationData.galleryDescription || "Découvrez notre approche pratique de la formation professionnelle."}
                    onChange={(e) => updateValue('galleryDescription', e.target.value)}
                    className="border-2 border-emerald-300 text-center min-h-16"
                    placeholder="Description de la galerie"
                  />
                ) : (
                  <p>
                    {formationData.galleryDescription || "Découvrez notre approche pratique de la formation professionnelle."}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {(formationData.galleryImages || []).map((image, index) => (
                  <div key={index} className="relative group">
                    {isEditing && (
                      <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
                        <Button
                          onClick={() => replaceGalleryImage(index)}
                          size="sm"
                          className="bg-white/90 text-black hover:bg-white h-8 w-8 p-0"
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newImages = (formationData.galleryImages || []).filter((_, i) => i !== index);
                            updateValue('galleryImages', newImages);
                          }}
                          className="bg-white/90 text-red-600 hover:bg-white h-8 w-8 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <img
                      src={image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                      alt={`Formation ${index + 1}`}
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Bouton ajouter image */}
                {isEditing && (
                                      <div className="border-dashed border-2 border-emerald-300 rounded-lg h-64 flex items-center justify-center">
                      <Button
                        variant="outline"
                        onClick={uploadGalleryImage}
                        className="border-dashed border-emerald-300 text-emerald-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter image
                      </Button>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Équipements de diagnostic - SEULEMENT pour Diagnostic */}
          {pageStructure.id === 'diagnostic' && (
            <div className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">
                  {isEditing ? (
                    <Input
                      value={formationData.equipmentTitle || "Équipements de diagnostic"}
                      onChange={(e) => updateValue('equipmentTitle', e.target.value)}
                      className="border-2 border-emerald-300 text-center text-3xl font-bold bg-transparent"
                      placeholder="Titre des équipements"
                    />
                  ) : (
                    formationData.equipmentTitle || "Équipements de diagnostic"
                  )}
                </h2>
                
                <div className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {isEditing ? (
                    <Textarea
                      value={formationData.equipmentDescription || "Découvrez les équipements modernes que vous utiliserez pendant votre formation."}
                      onChange={(e) => updateValue('equipmentDescription', e.target.value)}
                      className="border-2 border-emerald-300 text-center min-h-16"
                      placeholder="Description des équipements"
                    />
                  ) : (
                    <p>
                      {formationData.equipmentDescription || "Découvrez les équipements modernes que vous utiliserez pendant votre formation."}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {(formationData.equipmentImages || []).map((image, index) => (
                    <div key={index} className="relative group">
                      {isEditing && (
                        <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
                          <Button
                            onClick={() => replaceEquipmentImage(index)}
                            size="sm"
                            className="bg-white/90 text-black hover:bg-white h-8 w-8 p-0"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newImages = (formationData.equipmentImages || []).filter((_, i) => i !== index);
                              updateValue('equipmentImages', newImages);
                            }}
                            className="bg-white/90 text-red-600 hover:bg-white h-8 w-8 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      <img
                        src={image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                        alt={`Équipement ${index + 1}`}
                        className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                      />
                    </div>
                  ))}
                  
                  {/* Bouton ajouter image d'équipement */}
                  {isEditing && (
                    <div className="border-dashed border-2 border-emerald-300 rounded-lg h-64 flex items-center justify-center">
                      <Button
                        variant="outline"
                        onClick={uploadEquipmentImage}
                        className="border-dashed border-emerald-300 text-emerald-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter équipement
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Nos ateliers de formation - SEULEMENT pour Mécanique */}
          {pageStructure.id === 'mecanique' && (
            <div className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">
                  {isEditing ? (
                    <Input
                      value={formationData.workshopsTitle || "Nos ateliers de formation"}
                      onChange={(e) => updateValue('workshopsTitle', e.target.value)}
                      className="border-2 border-emerald-300 text-center text-3xl font-bold bg-transparent"
                      placeholder="Titre des ateliers"
                    />
                  ) : (
                    formationData.workshopsTitle || "Nos ateliers de formation"
                  )}
                </h2>
                
                <div className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {isEditing ? (
                    <Textarea
                      value={formationData.workshopsDescription || "Découvrez nos installations modernes où vous développerez vos compétences pratiques."}
                      onChange={(e) => updateValue('workshopsDescription', e.target.value)}
                      className="border-2 border-emerald-300 text-center min-h-16"
                      placeholder="Description des ateliers"
                    />
                  ) : (
                    <p>
                      {formationData.workshopsDescription || "Découvrez nos installations modernes où vous développerez vos compétences pratiques."}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {(formationData.workshopImages || []).map((image, index) => (
                    <div key={index} className="relative group">
                      {isEditing && (
                        <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
                          <Button
                            onClick={() => replaceWorkshopImage(index)}
                            size="sm"
                            className="bg-white/90 text-black hover:bg-white h-8 w-8 p-0"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newImages = (formationData.workshopImages || []).filter((_, i) => i !== index);
                              updateValue('workshopImages', newImages);
                            }}
                            className="bg-white/90 text-red-600 hover:bg-white h-8 w-8 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      <img
                        src={image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                        alt={`Atelier ${index + 1}`}
                        className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                      />
                    </div>
                  ))}
                  
                  {/* Bouton ajouter image d'atelier */}
                  {isEditing && (
                    <div className="border-dashed border-2 border-emerald-300 rounded-lg h-64 flex items-center justify-center">
                      <Button
                        variant="outline"
                        onClick={uploadWorkshopImage}
                        className="border-dashed border-emerald-300 text-emerald-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter image atelier
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CTA - Édition inline */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {isEditing ? (
                  <Textarea
                    value={formationData.cta?.title || `Prêt à lancer votre carrière en ${pageStructure.name.toLowerCase()} ?`}
                    onChange={(e) => {
                      const currentCta = formationData.cta || {};
                      updateValue('cta', { ...currentCta, title: e.target.value });
                    }}
                    className="bg-white/10 border border-white/30 text-white text-4xl font-bold min-h-32 text-center"
                    placeholder="Titre de l'appel à l'action"
                  />
                ) : (
                  formationData.cta?.title || `Prêt à lancer votre carrière en ${pageStructure.name.toLowerCase()} ?`
                )}
              </h2>
              
              <div className="text-xl text-emerald-100 mb-8 leading-relaxed">
                {isEditing ? (
                  <Textarea
                    value={formationData.cta?.description || "Rejoignez notre programme complet de formation professionnelle et ouvrez les portes à une carrière réussie dans votre domaine d'activité."}
                    onChange={(e) => {
                      const currentCta = formationData.cta || {};
                      updateValue('cta', { ...currentCta, description: e.target.value });
                    }}
                    className="bg-white/10 border border-white/30 text-emerald-100 text-xl min-h-24 text-center"
                    placeholder="Description de l'appel à l'action"
                  />
                ) : (
                  <p>
                    {formationData.cta?.description || "Rejoignez notre programme complet de formation professionnelle et ouvrez les portes à une carrière réussie dans votre domaine d'activité."}
                  </p>
                )}
              </div>
              
              <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/contact">
                  {isEditing ? (
                    <Input
                      value={formationData.cta?.buttonText || "S'inscrire maintenant"}
                      onChange={(e) => {
                        const currentCta = formationData.cta || {};
                        updateValue('cta', { ...currentCta, buttonText: e.target.value });
                      }}
                      className="bg-transparent border-none text-emerald-600 font-bold text-lg p-0 h-auto text-center"
                      placeholder="Texte du bouton"
                    />
                  ) : (
                    formationData.cta?.buttonText || "S'inscrire maintenant"
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
      

    </div>
  );
};