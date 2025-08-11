import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Settings, Plus, X, Upload, ArrowRight, Save, Edit3, Eye,
  CheckCircle, FileText, Target, Wrench, Briefcase, 
  CarFront, Wallet, Users, GraduationCap, Video, FileIcon
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Navbar, Footer } from '../../Acceuil';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/uploadUtils';

// Configuration des vraies pages avec leur structure exacte
const REAL_PAGE_STRUCTURES = {
  finance: {
    id: 'finance',
    name: 'Formation Finance',
    dataKey: 'financeFormation',
    icon: Wallet,
    sections: {
      hero: { enabled: true, required: true },
      programDetails: { 
        enabled: true, 
        required: true,
        columns: [
          { key: 'programStructure', title: 'Durée et structure', icon: CheckCircle },
          { key: 'teachingMethods', title: 'Méthodes d\'enseignement', icon: FileText },
          { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Wallet }
        ]
      },
      certifications: { enabled: true, required: false },
      gallery: { enabled: true, required: false, title: 'Formation en action' },
      cta: { enabled: true, required: true }
    }
  },
  mecanique: {
    id: 'mecanique',
    name: 'Formation Mécanique',
    dataKey: 'mecaniqueFormation', 
    icon: Wrench,
    sections: {
      hero: { enabled: true, required: true },
      programDetails: { 
        enabled: true, 
        required: true,
        columns: [
          { key: 'programStructure', title: 'Structure du programme', icon: CheckCircle },
          { key: 'courseContent', title: 'Contenu du cours', icon: FileText },
          { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Target }
        ]
      },
      certifications: { enabled: false, required: false },
      gallery: { enabled: true, required: false, title: 'Formation en action' },
      workshops: { enabled: true, required: false, title: 'Nos ateliers de formation' },
      cta: { enabled: true, required: true }
    }
  },
  commerce: {
    id: 'commerce',
    name: 'Formation Commerce',
    dataKey: 'commerceFormation',
    icon: Briefcase,
    sections: {
      hero: { enabled: true, required: true },
      programDetails: { 
        enabled: true, 
        required: true,
        columns: [
          { key: 'programStructure', title: 'Structure du programme', icon: CheckCircle },
          { key: 'courseContent', title: 'Contenu du cours', icon: FileText },
          { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Target }
        ]
      },
      certifications: { enabled: false, required: false },
      gallery: { enabled: true, required: false, title: 'Formation en action' },
      cta: { enabled: true, required: true }
    }
  },
  diagnostic: {
    id: 'diagnostic',
    name: 'Formation Diagnostic',
    dataKey: 'diagnosticFormation',
    icon: Settings,
    sections: {
      hero: { enabled: true, required: true },
      programDetails: { 
        enabled: true, 
        required: true,
        columns: [
          { key: 'programStructure', title: 'Structure du programme', icon: CheckCircle },
          { key: 'courseContent', title: 'Contenu du cours', icon: FileText },
          { key: 'careerOpportunities', title: 'Débouchés professionnels', icon: Target }
        ]
      },
      gallery: { enabled: true, required: false, title: 'Formation en action' },
      cta: { enabled: true, required: true }
    }
  }
};

interface RealPageEditorProps {
  pageEditData: any;
  selectedTemplate: any;
  formationData: any;
  formationKey: string;
  updateField: (section: string, field: string, value: any) => void;
  onSave: () => void;
}

export const RealPageEditor: React.FC<RealPageEditorProps> = ({
  pageEditData,
  selectedTemplate,
  formationData,
  formationKey,
  updateField,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customSections, setCustomSections] = useState(() => formationData.customSections || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtenir la structure de la vraie page
  const pageStructure = REAL_PAGE_STRUCTURES[selectedTemplate.id] || REAL_PAGE_STRUCTURES.finance;
  const [activeSections, setActiveSections] = useState(() => {
    const initial = {};
    Object.keys(pageStructure.sections).forEach(key => {
      initial[key] = pageStructure.sections[key].enabled;
    });
    return initial;
  });

  const IconComponent = pageStructure.icon;

  // Fonction pour uploader une image
  const handleImageUpload = async (file: File, field: string) => {
    const result = await uploadImage(file);
    
    if (result.success && result.filename) {
      const imageUrl = `/rachef-uploads/${result.filename}`;
      updateField('datap', `${formationKey}.${field}`, imageUrl);
      toast.success('Image uploadée avec succès');
      return imageUrl;
    } else {
      toast.error(`Erreur upload: ${result.error}`);
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

  // Ajouter une section personnalisée
  const addCustomSection = () => {
    const newSection = {
      id: `custom_${Date.now()}`,
      title: 'Section créée [changer ce texte]',
      description: 'ICI TEXT ............la description',
      content: [],
      images: [],
      videos: [],
      pdfs: []
    };
    setCustomSections([...customSections, newSection]);
    updateValue('customSections', [...customSections, newSection]);
  };

  if (isEditing) {
    // Mode édition - Interface de gestion
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Barre d'outils */}
        <div className="bg-white border rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Mode Édition</Badge>
            <span className="text-sm text-gray-600">
              Page: {pageStructure.name}
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
                {Object.entries(pageStructure.sections).map(([key, section]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      {section.title || key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <Switch
                      checked={activeSections[key]}
                      onCheckedChange={(checked) => 
                        setActiveSections(prev => ({ ...prev, [key]: checked }))
                      }
                      disabled={section.required}
                    />
                  </div>
                ))}
                
                <hr className="my-4" />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Sections personnalisées</h4>
                  {customSections.map((section, index) => (
                    <div key={section.id} className="flex items-center justify-between text-xs">
                      <span>{section.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSections = customSections.filter((_, i) => i !== index);
                          setCustomSections(newSections);
                          updateValue('customSections', newSections);
                        }}
                        className="text-red-600 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCustomSection}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter [SECTION Supplémentaire]
                  </Button>
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre de la section</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.programDetailsTitle || "Détails du programme"}
                      onChange={(e) => updateValue('programDetailsTitle', e.target.value)}
                      placeholder="Détails du programme"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description de la section</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-20"
                      value={formationData.programDetailsDescription || ""}
                      onChange={(e) => updateValue('programDetailsDescription', e.target.value)}
                      placeholder="Description du programme..."
                    />
                  </div>

                  {pageStructure.sections.programDetails.columns.map((column) => (
                    <div key={column.key}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">{column.title}</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addToArray(column.key)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(formationData[column.key] || []).map((item, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              className="flex-1 border rounded px-3 py-2"
                              value={item}
                              onChange={(e) => updateArrayItem(column.key, index, e.target.value)}
                              placeholder={`Élément ${column.title.toLowerCase()}...`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray(column.key, index)}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                          updateValue('certifications.items', [...current, { title: '', description: '' }]);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(formationData.certifications?.items || []).map((item, index) => (
                        <div key={index} className="border rounded p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Certification {index + 1}</h4>
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
                          <input
                            className="w-full border rounded px-3 py-2"
                            value={item.title || ''}
                            onChange={(e) => {
                              const newItems = [...(formationData.certifications?.items || [])];
                              newItems[index] = { ...newItems[index], title: e.target.value };
                              updateValue('certifications.items', newItems);
                            }}
                            placeholder="Titre de la certification"
                          />
                          <textarea
                            className="w-full border rounded px-3 py-2"
                            value={item.description || ''}
                            onChange={(e) => {
                              const newItems = [...(formationData.certifications?.items || [])];
                              newItems[index] = { ...newItems[index], description: e.target.value };
                              updateValue('certifications.items', newItems);
                            }}
                            placeholder="Description de la certification"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formation en action / Gallery */}
            {activeSections.gallery && (
              <Card>
                <CardHeader>
                  <CardTitle>{pageStructure.sections.gallery?.title || 'Formation en action'}</CardTitle>
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
                          const current = formationData.galleryImages || [];
                          updateValue('galleryImages', [...current, '']);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.galleryImages || []).map((image, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(formationData.galleryImages || [])];
                              newImages[index] = e.target.value;
                              updateValue('galleryImages', newImages);
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
                              const newImages = (formationData.galleryImages || []).filter((_, i) => i !== index);
                              updateValue('galleryImages', newImages);
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

            {/* Ateliers (pour mécanique) */}
            {activeSections.workshops && (
              <Card>
                <CardHeader>
                  <CardTitle>Nos ateliers de formation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre de la section</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={formationData.workshopsSection?.title || "Nos ateliers de formation"}
                      onChange={(e) => updateValue('workshopsSection.title', e.target.value)}
                      placeholder="Nos ateliers de formation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-20"
                      value={formationData.workshopsSection?.description || ""}
                      onChange={(e) => updateValue('workshopsSection.description', e.target.value)}
                      placeholder="Description des ateliers"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Images des ateliers</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = formationData.workshopImages || [];
                          updateValue('workshopImages', [...current, '']);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formationData.workshopImages || []).map((image, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            className="flex-1 border rounded px-3 py-2"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(formationData.workshopImages || [])];
                              newImages[index] = e.target.value;
                              updateValue('workshopImages', newImages);
                            }}
                            placeholder="URL de l'image d'atelier..."
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
                              const newImages = (formationData.workshopImages || []).filter((_, i) => i !== index);
                              updateValue('workshopImages', newImages);
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
                      value={formationData.cta?.title || `Prêt à lancer votre carrière en ${pageStructure.name.toLowerCase()} ?`}
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

            {/* Sections personnalisées */}
            {customSections.map((section, sectionIndex) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Section personnalisée {sectionIndex + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSections = customSections.filter((_, i) => i !== sectionIndex);
                        setCustomSections(newSections);
                        updateValue('customSections', newSections);
                      }}
                      className="text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre de la section</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...customSections];
                        newSections[sectionIndex].title = e.target.value;
                        setCustomSections(newSections);
                        updateValue('customSections', newSections);
                      }}
                      placeholder="Titre de la section"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-20"
                      value={section.description}
                      onChange={(e) => {
                        const newSections = [...customSections];
                        newSections[sectionIndex].description = e.target.value;
                        setCustomSections(newSections);
                        updateValue('customSections', newSections);
                      }}
                      placeholder="Description de la section"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Images */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Images</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSections = [...customSections];
                            newSections[sectionIndex].images.push('');
                            setCustomSections(newSections);
                            updateValue('customSections', newSections);
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {section.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="flex space-x-1">
                            <input
                              className="flex-1 border rounded px-2 py-1 text-sm"
                              value={image}
                              onChange={(e) => {
                                const newSections = [...customSections];
                                newSections[sectionIndex].images[imageIndex] = e.target.value;
                                setCustomSections(newSections);
                                updateValue('customSections', newSections);
                              }}
                              placeholder="URL image"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSections = [...customSections];
                                newSections[sectionIndex].images = newSections[sectionIndex].images.filter((_, i) => i !== imageIndex);
                                setCustomSections(newSections);
                                updateValue('customSections', newSections);
                              }}
                              className="text-red-600 h-8 w-8 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vidéos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Vidéos</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSections = [...customSections];
                            newSections[sectionIndex].videos.push('');
                            setCustomSections(newSections);
                            updateValue('customSections', newSections);
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {section.videos.map((video, videoIndex) => (
                          <div key={videoIndex} className="flex space-x-1">
                            <input
                              className="flex-1 border rounded px-2 py-1 text-sm"
                              value={video}
                              onChange={(e) => {
                                const newSections = [...customSections];
                                newSections[sectionIndex].videos[videoIndex] = e.target.value;
                                setCustomSections(newSections);
                                updateValue('customSections', newSections);
                              }}
                              placeholder="URL vidéo"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSections = [...customSections];
                                newSections[sectionIndex].videos = newSections[sectionIndex].videos.filter((_, i) => i !== videoIndex);
                                setCustomSections(newSections);
                                updateValue('customSections', newSections);
                              }}
                              className="text-red-600 h-8 w-8 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDFs */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">PDFs</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSections = [...customSections];
                            newSections[sectionIndex].pdfs.push('');
                            setCustomSections(newSections);
                            updateValue('customSections', newSections);
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {section.pdfs.map((pdf, pdfIndex) => (
                          <div key={pdfIndex} className="flex space-x-1">
                            <input
                              className="flex-1 border rounded px-2 py-1 text-sm"
                              value={pdf}
                              onChange={(e) => {
                                const newSections = [...customSections];
                                newSections[sectionIndex].pdfs[pdfIndex] = e.target.value;
                                setCustomSections(newSections);
                                updateValue('customSections', newSections);
                              }}
                              placeholder="URL PDF"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSections = [...customSections];
                                newSections[sectionIndex].pdfs = newSections[sectionIndex].pdfs.filter((_, i) => i !== pdfIndex);
                                setCustomSections(newSections);
                                updateValue('customSections', newSections);
                              }}
                              className="text-red-600 h-8 w-8 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mode aperçu - Page réelle identique au site
  return (
    <div className="relative">
      {/* Barre d'outils d'aperçu */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                Aperçu: {pageStructure.name}
              </Badge>
              <span className="text-sm text-gray-600">
                Exactement comme sur le site
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

      {/* Page de formation - EXACTEMENT comme sur le site */}
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
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Program Details - EXACTEMENT comme la vraie page Finance */}
          {activeSections.programDetails && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {formationData.programDetailsTitle || "Détails du programme"}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {formationData.programDetailsDescription || "Maîtrisez la finance et la comptabilité avec une formation complète et pratique."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {pageStructure.sections.programDetails.columns.map((column) => (
                  <Card key={column.key} className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <column.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                        {column.title}
                      </h3>
                      <ul className="space-y-3">
                        {(formationData[column.key] || []).map((item, index) => (
                          <li key={index} className="flex items-start group/item">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform duration-200" />
                            <span className="text-gray-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Certifications - EXACTEMENT comme la vraie page */}
          {activeSections.certifications && (
            <div className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">
                  {formationData.certifications?.title || "Certifications"}
                </h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {formationData.certifications?.description || "Nos formations mènent à des certifications professionnelles reconnues dans l'industrie."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  {(formationData.certifications?.items || []).map((cert, index) => (
                    <Card key={index} className="text-center p-6">
                      <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                      <p className="text-sm text-gray-600">{cert.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery - EXACTEMENT comme la vraie page */}
          {activeSections.gallery && (
            <div className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">
                  {formationData.gallerySection?.title || "Formation en action"}
                </h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {formationData.gallerySection?.description || "Découvrez notre approche pratique de la formation professionnelle."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {(formationData.galleryImages || []).map((image, index) => (
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

          {/* Ateliers (pour mécanique) */}
          {activeSections.workshops && (
            <div className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">
                  {formationData.workshopsSection?.title || "Nos ateliers de formation"}
                </h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {formationData.workshopsSection?.description || "Découvrez nos ateliers équipés pour une formation pratique complète."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {(formationData.workshopImages || []).map((image, index) => (
                    <img
                      key={index}
                      src={image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                      alt={`Atelier ${index + 1}`}
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sections personnalisées */}
          {customSections.map((section, index) => (
            <div key={section.id} className={index % 2 === 0 ? "py-16" : "bg-gray-50 py-16"}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-4">{section.title}</h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                  {section.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Images */}
                  {section.images.map((image, imageIndex) => (
                    <img
                      key={`img-${imageIndex}`}
                      src={image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                      alt={`${section.title} ${imageIndex + 1}`}
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full object-cover"
                    />
                  ))}
                  
                  {/* Vidéos */}
                  {section.videos.map((video, videoIndex) => (
                    <div key={`vid-${videoIndex}`} className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Vidéo {videoIndex + 1}</p>
                        <a href={video} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-xs">
                          Voir la vidéo
                        </a>
                      </div>
                    </div>
                  ))}
                  
                  {/* PDFs */}
                  {section.pdfs.map((pdf, pdfIndex) => (
                    <div key={`pdf-${pdfIndex}`} className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-64 w-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Document {pdfIndex + 1}</p>
                        <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-xs">
                          Télécharger
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* CTA - EXACTEMENT comme la vraie page */}
          {activeSections.cta && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {formationData.cta?.title || `Prêt à lancer votre carrière en ${pageStructure.name.toLowerCase()} ?`}
                </h2>
                <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                  {formationData.cta?.description || "Rejoignez notre programme complet de formation professionnelle et ouvrez les portes à une carrière réussie dans votre domaine d'activité."}
                </p>
                <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/contact">
                    {formationData.cta?.buttonText || "S'inscrire maintenant"}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};