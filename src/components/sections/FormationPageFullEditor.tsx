import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Edit3, Eye, Save, Plus, X, Upload, ArrowRight, 
  CheckCircle, FileText, Target, Wrench, Briefcase, 
  Settings, CarFront, Wallet, Users, GraduationCap 
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Navbar, Footer } from '../../Acceuil';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/uploadUtils';

// Map des icônes pour chaque formation
const FORMATION_ICONS = {
  mecanique: Wrench,
  commerce: Briefcase,
  diagnostic: Settings,
  conduite: CarFront,
  finance: Wallet,
  rh: Users
};

interface FormationPageFullEditorProps {
  pageEditData: any;
  selectedTemplate: any;
  formationData: any;
  formationKey: string;
  updateField: (section: string, field: string, value: any) => void;
  onSave: () => void;
}

export const FormationPageFullEditor: React.FC<FormationPageFullEditorProps> = ({
  pageEditData,
  selectedTemplate,
  formationData,
  formationKey,
  updateField,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { datapJson } = useDashboardStore();

  // Fonction pour uploader une image
  const handleImageUpload = async (file: File, fieldPath: string) => {
    const result = await uploadImage(file);
    
    if (result.success && result.filename) {
      const imageUrl = `/rachef-uploads/${result.filename}`;
      updateField('datap', `${formationKey}.${fieldPath}`, imageUrl);
      toast.success('Image uploadée avec succès', { position: 'top-right' });
      return imageUrl;
    } else {
      toast.error(`Erreur upload: ${result.error}`, { position: 'top-right' });
      return null;
    }
  };

  // Fonction pour ajouter un élément à un tableau
  const addToArray = (fieldPath: string, newItem: string = '') => {
    const currentArray = getNestedValue(formationData, fieldPath) || [];
    updateField('datap', `${formationKey}.${fieldPath}`, [...currentArray, newItem]);
  };

  // Fonction pour supprimer un élément d'un tableau
  const removeFromArray = (fieldPath: string, index: number) => {
    const currentArray = getNestedValue(formationData, fieldPath) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateField('datap', `${formationKey}.${fieldPath}`, newArray);
  };

  // Fonction pour mettre à jour un élément d'un tableau
  const updateArrayItem = (fieldPath: string, index: number, value: string) => {
    const currentArray = getNestedValue(formationData, fieldPath) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateField('datap', `${formationKey}.${fieldPath}`, newArray);
  };

  // Utilitaire pour accéder aux valeurs imbriquées
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Fonction pour mettre à jour une valeur imbriquée
  const updateNestedValue = (fieldPath: string, value: any) => {
    updateField('datap', `${formationKey}.${fieldPath}`, value);
  };

  // Composant pour éditer un champ texte
  const EditableField = ({ 
    value, 
    fieldPath, 
    placeholder, 
    multiline = false, 
    className = "",
    label 
  }: {
    value: string;
    fieldPath: string;
    placeholder: string;
    multiline?: boolean;
    className?: string;
    label?: string;
  }) => {
    if (!isEditing) {
      return <span className={className}>{value || placeholder}</span>;
    }

    const Component = multiline ? 'textarea' : 'input';
    
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <Component
          className={`${multiline ? 'min-h-20' : ''} w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${className}`}
          value={value || ''}
          onChange={(e) => updateNestedValue(fieldPath, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };

  // Composant pour éditer un tableau
  const EditableArray = ({ 
    items, 
    fieldPath, 
    placeholder, 
    label 
  }: {
    items: string[];
    fieldPath: string;
    placeholder: string;
    label: string;
  }) => {
    if (!isEditing) {
      return (
        <ul className="space-y-3">
          {items?.map((item, index) => (
            <li key={index} className="flex items-start group/item">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2" />
              <span className="text-gray-600 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addToArray(fieldPath)}
            className="border-dashed border-emerald-300 text-emerald-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-3">
          {(items || []).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <textarea
                className="flex-1 border rounded px-3 py-2 min-h-20"
                value={item}
                onChange={(e) => updateArrayItem(fieldPath, index, e.target.value)}
                placeholder={placeholder}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeFromArray(fieldPath, index)}
                className="text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Rendu de la page de formation complète
  const renderFormationPage = () => {
    const IconComponent = FORMATION_ICONS[selectedTemplate.id] || GraduationCap;
    
    // Valeurs par défaut pour la structure
    const defaultBadgeText = formationData.badgeText || "Formation Professionnelle";
    const defaultCta = formationData.cta || {
      title: "Commencez votre carrière professionnelle aujourd'hui",
      description: "Rejoignez notre programme complet de formation professionnelle et ouvrez les portes à une carrière réussie dans votre domaine d'activité.",
      buttonText: "S'inscrire maintenant"
    };
    
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
                    <IconComponent className="h-4 w-4 mr-2 text-emerald-300" />
                    <span className="text-emerald-200 text-sm font-medium">
                      <EditableField
                        value={defaultBadgeText}
                        fieldPath="badgeText"
                        placeholder="Formation Professionnelle"
                        className="bg-transparent text-emerald-200"
                      />
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                      <EditableField
                        value={formationData.title}
                        fieldPath="title"
                        placeholder="Titre de la formation"
                        className="bg-transparent"
                      />
                    </span>
                  </h1>
                  
                  <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                    <EditableField
                      value={formationData.description}
                      fieldPath="description"
                      placeholder="Description de la formation"
                      multiline
                      className="bg-transparent text-emerald-100/90"
                    />
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
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={formationData.image || ''}
                          onChange={(e) => updateNestedValue('image', e.target.value)}
                          placeholder="URL de l'image"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Uploader une image
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleImageUpload(file, 'image');
                            }
                          }}
                        />
                      </div>
                    ) : null}
                    <img 
                      src={formationData.image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
                      alt={formationData.title}
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
                Un programme complet conçu pour vous donner toutes les compétences nécessaires.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Structure du programme */}
              <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                    Structure du programme
                  </h3>
                  <EditableArray
                    items={formationData.programStructure || []}
                    fieldPath="programStructure"
                    placeholder="Élément de la structure du programme..."
                    label="Structure du programme"
                  />
                </CardContent>
              </Card>

              {/* Contenu du cours */}
              <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                    Contenu du cours
                  </h3>
                  <EditableArray
                    items={formationData.courseContent || []}
                    fieldPath="courseContent"
                    placeholder="Contenu du cours..."
                    label="Contenu du cours"
                  />
                </CardContent>
              </Card>

              {/* Débouchés professionnels */}
              <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                    Débouchés professionnels
                  </h3>
                  <EditableArray
                    items={formationData.careerOpportunities || []}
                    fieldPath="careerOpportunities"
                    placeholder="Débouché professionnel..."
                    label="Débouchés professionnels"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section Certifications */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  <EditableField
                    value={formationData.certifications?.title || "Certifications"}
                    fieldPath="certifications.title"
                    placeholder="Titre de la section certifications"
                    label="Titre de la section"
                  />
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  <EditableField
                    value={formationData.certifications?.description || "Obtenez des certifications reconnues par l'industrie."}
                    fieldPath="certifications.description"
                    placeholder="Description de la section certifications"
                    multiline
                    label="Description"
                  />
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                {isEditing ? (
                  <EditableArray
                    items={formationData.certifications?.items || []}
                    fieldPath="certifications.items"
                    placeholder="Certification obtenue..."
                    label="Certifications"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(formationData.certifications?.items || []).map((cert, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{cert}</h3>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Formation en action */}
          <div className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                  <EditableField
                    value={formationData.gallerySection?.title || "Formation en action"}
                    fieldPath="gallerySection.title"
                    placeholder="Titre de la galerie"
                    label="Titre de la section"
                  />
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  <EditableField
                    value={formationData.gallerySection?.description || "Découvrez notre approche pratique de la formation professionnelle."}
                    fieldPath="gallerySection.description"
                    placeholder="Description de la galerie"
                    multiline
                    label="Description"
                  />
                </p>
              </div>
              
              {isEditing && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Galerie d'images</label>
                  <div className="space-y-4">
                    {(formationData.gallerySection?.images || []).map((image, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          className="flex-1 border rounded px-3 py-2"
                          value={image}
                          onChange={(e) => {
                            const newImages = [...(formationData.gallerySection?.images || [])];
                            newImages[index] = e.target.value;
                            updateNestedValue('gallerySection.images', newImages);
                          }}
                          placeholder="URL de l'image"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newImages = (formationData.gallerySection?.images || []).filter((_, i) => i !== index);
                            updateNestedValue('gallerySection.images', newImages);
                          }}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newImages = [...(formationData.gallerySection?.images || []), ''];
                        updateNestedValue('gallerySection.images', newImages);
                      }}
                      className="border-dashed border-emerald-300 text-emerald-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une image
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(formationData.gallerySection?.images || []).map((image, index) => (
                  <img 
                    key={index}
                    src={image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                    alt={`Formation ${index + 1}`} 
                    className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section CTA finale */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-6">
                  <EditableField
                    value={defaultCta.title}
                    fieldPath="cta.title"
                    placeholder="Titre de l'appel à l'action"
                    className="bg-transparent text-white"
                    label="Titre CTA"
                  />
                </h2>
                <p className="text-xl mb-8 max-w-4xl mx-auto leading-relaxed text-emerald-100">
                  <EditableField
                    value={defaultCta.description}
                    fieldPath="cta.description"
                    placeholder="Description de l'appel à l'action"
                    multiline
                    className="bg-transparent text-emerald-100"
                    label="Description CTA"
                  />
                </p>
                <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/contact" className="flex items-center">
                    <EditableField
                      value={defaultCta.buttonText}
                      fieldPath="cta.buttonText"
                      placeholder="Texte du bouton"
                      className="bg-transparent text-emerald-600"
                      label="Texte du bouton"
                    />
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Barre d'outils d'édition */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                Template: {selectedTemplate.name}
              </Badge>
              <span className="text-sm text-gray-600">
                Formation: {pageEditData.title}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center"
              >
                {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Aperçu' : 'Éditer'}
              </Button>
              
              <Button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page de formation */}
      {renderFormationPage()}
    </div>
  );
};