import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Settings, Plus, X, Upload, ArrowRight, 
  CheckCircle, FileText, Target, Wrench, Briefcase, 
  CarFront, Wallet, Users, GraduationCap, Eye, Edit3, Save
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Navbar, Footer } from '../../Acceuil';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Map des icônes pour chaque formation
const FORMATION_ICONS = {
  mecanique: Wrench,
  commerce: Briefcase,
  diagnostic: Settings,
  conduite: CarFront,
  finance: Wallet,
  rh: Users
};

interface FormationEditorSimpleProps {
  pageEditData: any;
  selectedTemplate: any;
  formationData: any;
  formationKey: string;
  updateField: (section: string, field: string, value: any) => void;
  onSave: () => void;
}

export const FormationEditorSimple: React.FC<FormationEditorSimpleProps> = ({
  pageEditData,
  selectedTemplate,
  formationData,
  formationKey,
  updateField,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSections, setActiveSections] = useState({
    hero: true,
    programDetails: true,
    certifications: false,
    gallery: false,
    cta: true
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour uploader une image
  const handleImageUpload = async (file: File, field: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/upload`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        const imageUrl = `/rachef-uploads/${data.filename}`;
        updateField('datap', `${formationKey}.${field}`, imageUrl);
        toast.success('Image uploadée avec succès');
        return imageUrl;
      } else {
        throw new Error('Erreur upload');
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
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

  const IconComponent = FORMATION_ICONS[selectedTemplate.id] || GraduationCap;

  if (isEditing) {
    // Mode édition - Interface simple
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Barre d'outils */}
        <div className="bg-white border rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Mode Édition</Badge>
            <span className="text-sm text-gray-600">
              Template: {selectedTemplate.name}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau de contrôle des sections */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Hero Section</label>
                  <Switch
                    checked={activeSections.hero}
                    onCheckedChange={(checked) => 
                      setActiveSections(prev => ({ ...prev, hero: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Détails du programme</label>
                  <Switch
                    checked={activeSections.programDetails}
                    onCheckedChange={(checked) => 
                      setActiveSections(prev => ({ ...prev, programDetails: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Certifications</label>
                  <Switch
                    checked={activeSections.certifications}
                    onCheckedChange={(checked) => 
                      setActiveSections(prev => ({ ...prev, certifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Formation en action</label>
                  <Switch
                    checked={activeSections.gallery}
                    onCheckedChange={(checked) => 
                      setActiveSections(prev => ({ ...prev, gallery: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Appel à l'action</label>
                  <Switch
                    checked={activeSections.cta}
                    onCheckedChange={(checked) => 
                      setActiveSections(prev => ({ ...prev, cta: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaires d'édition */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Hero Section */}
            {activeSections.hero && (
              <Card>
                <CardHeader>
                  <CardTitle>Section Hero</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Badge</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.badgeText || "Formation Professionnelle"}
                      onChange={(e) => updateValue('badgeText', e.target.value)}
                      placeholder="Formation Professionnelle"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-20"
                      value={formationData.title || ''}
                      onChange={(e) => updateValue('title', e.target.value)}
                      placeholder="Titre de la formation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-32"
                      value={formationData.description || ''}
                      onChange={(e) => updateValue('description', e.target.value)}
                      placeholder="Description de la formation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 border rounded px-3 py-2"
                        value={formationData.image || ''}
                        onChange={(e) => updateValue('image', e.target.value)}
                        placeholder="URL de l'image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
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
                </CardContent>
              </Card>
            )}

            {/* Détails du programme */}
            {activeSections.programDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Détails du programme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Structure du programme */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Structure du programme</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addToArray('programStructure')}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.programStructure || []).map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={item}
                            onChange={(e) => updateArrayItem('programStructure', index, e.target.value)}
                            placeholder="Élément du programme..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('programStructure', index)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contenu du cours */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Contenu du cours</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addToArray('courseContent')}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.courseContent || []).map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={item}
                            onChange={(e) => updateArrayItem('courseContent', index, e.target.value)}
                            placeholder="Contenu du cours..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('courseContent', index)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Débouchés professionnels */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Débouchés professionnels</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addToArray('careerOpportunities')}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.careerOpportunities || []).map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={item}
                            onChange={(e) => updateArrayItem('careerOpportunities', index, e.target.value)}
                            placeholder="Débouché professionnel..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('careerOpportunities', index)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {activeSections.certifications && (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre de la section</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.certifications?.title || "Certifications"}
                      onChange={(e) => updateValue('certifications.title', e.target.value)}
                      placeholder="Certifications"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-20"
                      value={formationData.certifications?.description || ""}
                      onChange={(e) => updateValue('certifications.description', e.target.value)}
                      placeholder="Description des certifications"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Liste des certifications</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = formationData.certifications?.items || [];
                          updateValue('certifications.items', [...current, '']);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.certifications?.items || []).map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...(formationData.certifications?.items || [])];
                              newItems[index] = e.target.value;
                              updateValue('certifications.items', newItems);
                            }}
                            placeholder="Certification..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = (formationData.certifications?.items || []).filter((_, i) => i !== index);
                              updateValue('certifications.items', newItems);
                            }}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formation en action */}
            {activeSections.gallery && (
              <Card>
                <CardHeader>
                  <CardTitle>Formation en action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre de la section</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.gallerySection?.title || "Formation en action"}
                      onChange={(e) => updateValue('gallerySection.title', e.target.value)}
                      placeholder="Formation en action"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-20"
                      value={formationData.gallerySection?.description || ""}
                      onChange={(e) => updateValue('gallerySection.description', e.target.value)}
                      placeholder="Description de la galerie"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Images</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = formationData.gallerySection?.images || [];
                          updateValue('gallerySection.images', [...current, '']);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.gallerySection?.images || []).map((image, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(formationData.gallerySection?.images || [])];
                              newImages[index] = e.target.value;
                              updateValue('gallerySection.images', newImages);
                            }}
                            placeholder="URL de l'image..."
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
                              updateValue('gallerySection.images', newImages);
                            }}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appel à l'action */}
            {activeSections.cta && (
              <Card>
                <CardHeader>
                  <CardTitle>Appel à l'action final</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.cta?.title || "Commencez votre carrière professionnelle aujourd'hui"}
                      onChange={(e) => updateValue('cta.title', e.target.value)}
                      placeholder="Titre de l'appel à l'action"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-24"
                      value={formationData.cta?.description || "Rejoignez notre programme complet de formation professionnelle et ouvrez les portes à une carrière réussie dans votre domaine d'activité."}
                      onChange={(e) => updateValue('cta.description', e.target.value)}
                      placeholder="Description de l'appel à l'action"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.cta?.buttonText || "S'inscrire maintenant"}
                      onChange={(e) => updateValue('cta.buttonText', e.target.value)}
                      placeholder="Texte du bouton"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mode aperçu - Page complète
  return (
    <div className="relative">
      {/* Barre d'outils d'aperçu */}
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
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Éditer
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          {activeSections.hero && (
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
                        {formationData.badgeText || "Formation Professionnelle"}
                      </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                        {formationData.title || pageEditData.title}
                      </span>
                    </h1>
                    
                    <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
                      {formationData.description || pageEditData.description}
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
                        src={formationData.image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
                        alt={formationData.title || pageEditData.title}
                        className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Program Details */}
          {activeSections.programDetails && (
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
                    <ul className="space-y-3">
                      {(formationData.programStructure || []).map((item, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
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
                    <ul className="space-y-3">
                      {(formationData.courseContent || []).map((item, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
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
                    <ul className="space-y-3">
                      {(formationData.careerOpportunities || []).map((item, index) => (
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
          )}

          {/* Section Certifications */}
          {activeSections.certifications && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {formationData.certifications?.title || "Certifications"}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {formationData.certifications?.description || "Obtenez des certifications reconnues par l'industrie."}
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
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
                </div>
              </div>
            </div>
          )}

          {/* Section Formation en action */}
          {activeSections.gallery && (
            <div className="bg-gray-50 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 text-gray-900">
                    {formationData.gallerySection?.title || "Formation en action"}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {formationData.gallerySection?.description || "Découvrez notre approche pratique de la formation professionnelle."}
                  </p>
                </div>
                
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
          )}

          {/* Section CTA finale */}
          {activeSections.cta && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6">
                    {formationData.cta?.title || "Commencez votre carrière professionnelle aujourd'hui"}
                  </h2>
                  <p className="text-xl mb-8 max-w-4xl mx-auto leading-relaxed text-emerald-100">
                    {formationData.cta?.description || "Rejoignez notre programme complet de formation professionnelle et ouvrez les portes à une carrière réussie dans votre domaine d'activité."}
                  </p>
                  <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Link to="/contact" className="flex items-center">
                      {formationData.cta?.buttonText || "S'inscrire maintenant"}
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};