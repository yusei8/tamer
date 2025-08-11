import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

import { 
  FileText, 
  Plus, 
  X, 
  Edit3, 
  Upload, 
  Play, 
  Download,
  Award,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  Star,
  Camera,
  Video,
  FileImage
} from 'lucide-react';

interface FormationPageEditorProps {
  pageEditData: any;
  datapJson: any;
  updateField: (type: string, path: string, value: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  iconOptions: any[];
}

interface SectionConfig {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  component: React.ComponentType<any>;
}

const FormationPageEditor: React.FC<FormationPageEditorProps> = ({
  pageEditData,
  datapJson,
  updateField,
  fileInputRef,
  iconOptions
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const formationKey = `${pageEditData.id}Formation`;
  const formationData = datapJson[formationKey] || {};

  // Configuration des sections avec checkboxes
  const [sectionsConfig, setSectionsConfig] = useState<SectionConfig[]>([
    {
      id: 'programDetails',
      title: 'Détails du programme',
      description: 'Structure, contenu et débouchés professionnels',
      enabled: formationData.sections?.programDetails?.enabled || false,
      component: ProgramDetailsSection
    },
    {
      id: 'imageGallery',
      title: 'Galerie d\'images avec descriptions',
      description: 'Images numérotées avec descriptions détaillées',
      enabled: formationData.sections?.imageGallery?.enabled || false,
      component: ImageGallerySection
    },
    {
      id: 'certifications',
      title: 'Certifications',
      description: 'Certifications et diplômes délivrés',
      enabled: formationData.sections?.certifications?.enabled || false,
      component: CertificationsSection
    },
    {
      id: 'additionalContent',
      title: 'Contenu supplémentaire',
      description: 'PDF, vidéos, GIFs avec descriptions',
      enabled: formationData.sections?.additionalContent?.enabled || false,
      component: AdditionalContentSection
    },
    {
      id: 'ctaFinal',
      title: 'Appel à l\'action final',
      description: 'Section d\'inscription et motivation',
      enabled: formationData.sections?.ctaFinal?.enabled || false,
      component: CTAFinalSection
    }
  ]);

  const toggleSection = (sectionId: string, enabled: boolean) => {
    setSectionsConfig(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, enabled } : section
      )
    );
    updateField('datap', `${formationKey}.sections.${sectionId}.enabled`, enabled);
  };

  const updateSectionData = (sectionId: string, field: string, value: any) => {
    updateField('datap', `${formationKey}.sections.${sectionId}.${field}`, value);
  };

  return (
    <div className="p-6">
      {/* Mode d'édition - IDENTIQUE À ContactSection */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800">Page Formation - {pageEditData.title}</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditing ? "🟢 Mode édition ACTIVÉ - Vous pouvez maintenant éditer le contenu de la formation" : "⚪ Cliquez sur 'Activer l'édition' pour modifier le contenu de la formation"}
          </p>
        </div>
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
                <strong>Mode édition activé !</strong> Vous pouvez maintenant modifier tous les contenus de la formation.
                Les changements sont sauvegardés automatiquement !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode d'édition - Panneaux de configuration */}
      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration des sections (1/3) */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-emerald-800">
                <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                Configuration des sections
              </h3>
              <div className="space-y-4">
                {sectionsConfig.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={section.enabled}
                        onCheckedChange={(checked) => toggleSection(section.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Configuration du contenu principal */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Contenu principal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre principal
                  </label>
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-20"
                    value={formationData.hero?.title || pageEditData.title || ''}
                    onChange={e => updateSectionData('hero', 'title', e.target.value)}
                    placeholder="Titre principal de la formation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-20"
                    value={formationData.hero?.description || pageEditData.description || ''}
                    onChange={e => updateSectionData('hero', 'description', e.target.value)}
                    placeholder="Description de la formation"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Aperçu temps réel (2/3) */}
          <div className="lg:col-span-2">
            <FormationPagePreview 
              formationData={formationData}
              pageEditData={pageEditData}
              sectionsConfig={sectionsConfig}
              editMode={isEditing}
              updateSectionData={updateSectionData}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>
      ) : (
        /* PREVIEW NON-ÉDITABLE IDENTIQUE AU SITE */
        <FormationPagePreview 
          formationData={formationData}
          pageEditData={pageEditData}
          sectionsConfig={sectionsConfig}
          editMode={false}
        />
      )}
    </div>
  );
};


// Section 01 - Détails du programme
const ProgramDetailsSection: React.FC<any> = ({ data, editMode, onUpdate }) => {
  const programData = data || {};

  if (editMode) {
    return (
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
            01
          </div>
          <h2 className="text-xl font-bold text-orange-800">Détails du programme - ÉDITION</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre principal
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={programData.mainTitle || ''}
              onChange={e => onUpdate('mainTitle', e.target.value)}
              placeholder="Ex: Maîtrisez le diagnostic automobile..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Structure du programme
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-24"
              value={programData.structure || ''}
              onChange={e => onUpdate('structure', e.target.value)}
              placeholder="Décrivez la structure du programme..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu du cours
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-24"
              value={programData.content || ''}
              onChange={e => onUpdate('content', e.target.value)}
              placeholder="Décrivez le contenu détaillé..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Débouchés professionnels
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-24"
              value={programData.opportunities || ''}
              onChange={e => onUpdate('opportunities', e.target.value)}
              placeholder="Décrivez les débouchés professionnels..."
            />
          </div>
        </div>
      </Card>
    );
  }

  // Mode preview - identique au site
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
          01
        </div>
        <h2 className="text-2xl font-bold">Détails du programme</h2>
      </div>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-700">
          {programData.mainTitle || 'Maîtrisez le diagnostic automobile avec des outils et méthodes modernes.'}
        </p>
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Structure du programme</h3>
          <p className="text-gray-700">{programData.structure || '--content'}</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Contenu du cours</h3>
          <p className="text-gray-700">{programData.content || '--content'}</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Débouchés professionnels</h3>
          <p className="text-gray-700">{programData.opportunities || '--content'}</p>
        </div>
      </div>
    </div>
  );
};

// Section 02 - Galerie d'images
const ImageGallerySection: React.FC<any> = ({ data, editMode, onUpdate, fileInputRef }) => {
  const galleryData = data || { title: '', description: '', images: [] };

  const addImage = () => {
    const newImages = [...(galleryData.images || []), { url: '', description: '', number: (galleryData.images?.length || 0) + 1 }];
    onUpdate('images', newImages);
  };

  const updateImage = (index: number, field: string, value: any) => {
    const newImages = [...(galleryData.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    onUpdate('images', newImages);
  };

  const removeImage = (index: number) => {
    const newImages = (galleryData.images || []).filter((_, i) => i !== index);
    onUpdate('images', newImages);
  };

  if (editMode) {
    return (
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
            02
          </div>
          <h2 className="text-xl font-bold text-purple-800">Galerie d'images - ÉDITION</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la section
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={galleryData.title || ''}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Ex: Nos ateliers de formation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-20"
              value={galleryData.description || ''}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Ex: Découvrez nos installations modernes..."
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Images</h4>
              <Button size="sm" onClick={addImage} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Ajouter une image</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {(galleryData.images || []).map((image: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Image {index + 1}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeImage(index)} className="text-red-600">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                      <div className="flex space-x-2">
                        <input
                          className="flex-1 border rounded px-2 py-1"
                          value={image.url || ''}
                          onChange={e => updateImage(index, 'url', e.target.value)}
                          placeholder="URL de l'image"
                        />
                        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={image.description || ''}
                        onChange={e => updateImage(index, 'description', e.target.value)}
                        placeholder="Description de l'image"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Mode preview - identique au site
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
          02
        </div>
        <h2 className="text-2xl font-bold">{galleryData.title || 'Galerie d\'images'}</h2>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-gray-700 text-lg">{galleryData.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(galleryData.images || []).map((image: any, index: number) => (
          <div key={index} className="relative">
            <div className="absolute top-4 left-4 z-10">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
            <img
              src={image.url || '/placeholder.svg'}
              alt={image.description}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-3">
              <p className="text-gray-700">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 03 - Certifications
const CertificationsSection: React.FC<any> = ({ data, editMode, onUpdate }) => {
  const certData = data || {};
  const certifications = certData.items || [
    { title: 'Certification Professionnelle', description: 'Diplôme reconnu par l\'État' },
    { title: 'Spécialisation Métier', description: 'Expertise dans votre domaine d\'activité' },
    { title: 'Compétences Transversales', description: 'Savoir-être et soft skills' },
    { title: 'Expertise Technique', description: 'Maîtrise des outils professionnels' }
  ];

  const updateCertification = (index: number, field: string, value: string) => {
    const newCerts = [...certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    onUpdate('items', newCerts);
  };

  if (editMode) {
    return (
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
            03
          </div>
          <h2 className="text-xl font-bold text-yellow-800">Certifications - ÉDITION</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description générale
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-20"
              value={certData.description || ''}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Nos formations mènent à des certifications professionnelles reconnues dans l'industrie."
            />
          </div>
          
          <div className="space-y-4">
            {certifications.map((cert: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={cert.title}
                      onChange={e => updateCertification(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={cert.description}
                      onChange={e => updateCertification(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Mode preview - identique au site
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
          03
        </div>
        <h2 className="text-2xl font-bold">Certifications</h2>
      </div>
      <p className="text-lg text-gray-700 text-center mb-8">
        {certData.description || 'Nos formations mènent à des certifications professionnelles reconnues dans l\'industrie.'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert: any, index: number) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 text-emerald-600 mr-3" />
              <h4 className="text-xl font-semibold">{cert.title}</h4>
            </div>
            <p className="text-gray-700">{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 04 - Contenu supplémentaire
const AdditionalContentSection: React.FC<any> = ({ data, editMode, onUpdate, fileInputRef }) => {
  const contentData = data || { files: [] };

  const addFile = () => {
    const newFiles = [...(contentData.files || []), { type: 'pdf', url: '', title: '', description: '' }];
    onUpdate('files', newFiles);
  };

  const updateFile = (index: number, field: string, value: any) => {
    const newFiles = [...(contentData.files || [])];
    newFiles[index] = { ...newFiles[index], [field]: value };
    onUpdate('files', newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = (contentData.files || []).filter((_, i) => i !== index);
    onUpdate('files', newFiles);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <Download className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'gif': return <FileImage className="w-6 h-6" />;
      default: return <Download className="w-6 h-6" />;
    }
  };

  if (editMode) {
    return (
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
            04
          </div>
          <h2 className="text-xl font-bold text-indigo-800">Contenu supplémentaire - ÉDITION</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Fichiers et médias</h4>
            <Button size="sm" onClick={addFile} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Ajouter un fichier</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            {(contentData.files || []).map((file: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Fichier {index + 1}</span>
                  <Button size="sm" variant="ghost" onClick={() => removeFile(index)} className="text-red-600">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={file.type || 'pdf'}
                      onChange={e => updateFile(index, 'type', e.target.value)}
                    >
                      <option value="pdf">PDF</option>
                      <option value="video">Vidéo</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={file.title || ''}
                      onChange={e => updateFile(index, 'title', e.target.value)}
                      placeholder="Titre du fichier"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL du fichier</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 border rounded px-2 py-1"
                        value={file.url || ''}
                        onChange={e => updateFile(index, 'url', e.target.value)}
                        placeholder="URL du fichier"
                      />
                      <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full border rounded px-2 py-1 min-h-16"
                      value={file.description || ''}
                      onChange={e => updateFile(index, 'description', e.target.value)}
                      placeholder="Description du fichier"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Mode preview - identique au site
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
          04
        </div>
        <h2 className="text-2xl font-bold">Contenu supplémentaire</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(contentData.files || []).map((file: any, index: number) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="text-emerald-600 mr-3">
                {getFileIcon(file.type)}
              </div>
              <h4 className="text-xl font-semibold">{file.title}</h4>
            </div>
            <p className="text-gray-700 mb-4">{file.description}</p>
            <Button variant="outline" className="flex items-center space-x-2">
              {file.type === 'video' ? <Play className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{file.type === 'video' ? 'Regarder' : 'Télécharger'}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 05 - CTA Final
const CTAFinalSection: React.FC<any> = ({ data, editMode, onUpdate }) => {
  const ctaData = data || {};

  if (editMode) {
    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
            05
          </div>
          <h2 className="text-xl font-bold text-green-800">CTA Final - ÉDITION</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre principal
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={ctaData.title || ''}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Ex: Devenez un professionnel de la conduite"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-20"
              value={ctaData.description || ''}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Inscrivez-vous dès maintenant à notre formation..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte du bouton
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={ctaData.buttonText || ''}
              onChange={e => onUpdate('buttonText', e.target.value)}
              placeholder="S'inscrire maintenant"
            />
          </div>
        </div>
      </Card>
    );
  }

  // Mode preview - identique au site (TEXTE BLANC comme demandé)
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 rounded-lg text-white shadow-lg mb-12">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center font-bold mr-4">
          05
        </div>
        <h2 className="text-2xl font-bold">Appel à l'action final</h2>
      </div>
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">
          {ctaData.title || 'Devenez un professionnel de la conduite'}
        </h3>
        <p className="text-xl mb-8 opacity-90">
          {ctaData.description || 'Inscrivez-vous dès maintenant à notre formation de conduite professionnelle et obtenez votre brevet professionnel.'}
        </p>
        <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
          {ctaData.buttonText || "S'inscrire maintenant"}
        </Button>
      </div>
    </div>
  );
};

// Composant qui affiche la page identique à /formation/{id}
const FormationPagePreview: React.FC<{
  formationData: any;
  pageEditData: any;
  sectionsConfig: any[];
  editMode: boolean;
  updateSectionData?: (sectionId: string, field: string, value: any) => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}> = ({ formationData, pageEditData, sectionsConfig, editMode, updateSectionData, fileInputRef }) => {

  // Fonction de rendu des sections - IDENTIQUE à page.tsx
  const renderFormationSection = (sectionId: string, data: any) => {
    if (!data || !data.enabled) return null;

    switch (sectionId) {
      case 'programDetails':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                01
              </div>
              <h2 className="text-2xl font-bold">Détails du programme</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700">{data.mainTitle}</p>
              {data.structure && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Structure du programme</h3>
                  <p className="text-gray-700">{data.structure}</p>
                </div>
              )}
              {data.content && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Contenu du cours</h3>
                  <p className="text-gray-700">{data.content}</p>
                </div>
              )}
              {data.opportunities && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Débouchés professionnels</h3>
                  <p className="text-gray-700">{data.opportunities}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'imageGallery':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                02
              </div>
              <h2 className="text-2xl font-bold">{data.title || 'Galerie d\'images'}</h2>
            </div>
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg">{data.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(data.images || []).map((image: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <img
                    src={image.url || '/placeholder.svg'}
                    alt={image.description}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-3">
                    <p className="text-gray-700">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                03
              </div>
              <h2 className="text-2xl font-bold">Certifications</h2>
            </div>
            <p className="text-lg text-gray-700 text-center mb-8">
              {data.description || 'Nos formations mènent à des certifications professionnelles reconnues dans l\'industrie.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.items || []).map((cert: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Award className="w-8 h-8 text-emerald-600 mr-3" />
                    <h4 className="text-xl font-semibold">{cert.title}</h4>
                  </div>
                  <p className="text-gray-700">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'additionalContent':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                04
              </div>
              <h2 className="text-2xl font-bold">Contenu supplémentaire</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.files || []).map((file: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-emerald-600 mr-3">
                      {file.type === 'video' ? <Video className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                    </div>
                    <h4 className="text-xl font-semibold">{file.title}</h4>
                  </div>
                  <p className="text-gray-700 mb-4">{file.description}</p>
                  <Button variant="outline" className="flex items-center space-x-2">
                    {file.type === 'video' ? <Play className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span>{file.type === 'video' ? 'Regarder' : 'Télécharger'}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ctaFinal':
        return (
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 rounded-lg text-white shadow-lg mb-12">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center font-bold mr-4">
                05
              </div>
              <h2 className="text-2xl font-bold">Appel à l'action final</h2>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                {data.title || 'Devenez un professionnel de la conduite'}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {data.description || 'Inscrivez-vous dès maintenant à notre formation de conduite professionnelle et obtenez votre brevet professionnel.'}
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                {data.buttonText || "S'inscrire maintenant"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-lg">
      {editMode && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <span className="text-sm text-blue-800">📄 Contenu de la page /formation/{pageEditData.id} (Hero/Contact/Footer ajoutés automatiquement sur le site)</span>
        </div>
      )}

      {/* CONTENU IDENTIQUE À /formation/{id} - EXACTEMENT comme page.tsx */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* En-tête de la formation */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {formationData.hero?.title || formationData.title || pageEditData.title || 'Titre de la formation'}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {formationData.hero?.description || formationData.description || pageEditData.description || 'Description de la formation'}
          </p>
        </div>

        {/* IMAGE PRINCIPALE (si existe) */}
        {formationData.image && (
          <div className="mb-8 text-center">
            <img 
              src={formationData.image} 
              alt={formationData.title} 
              className="w-full h-64 object-cover rounded-lg mx-auto max-w-4xl" 
            />
          </div>
        )}

        {/* Sections modulaires créées dans l'éditeur */}
        {sectionsConfig.map((section) => {
          if (!section.enabled) return null;
          
          const sectionData = formationData.sections?.[section.id];
          const SectionComponent = section.component;
          return (
            <div key={section.id} className="relative">
              {editMode && (
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg z-10">
                  {section.title}
                </div>
              )}
              <SectionComponent
                data={sectionData}
                editMode={editMode}
                onUpdate={updateSectionData ? (field, value) => updateSectionData(section.id, field, value) : () => {}}
                fileInputRef={fileInputRef}
              />
            </div>
          );
        })}

        {/* CONTENU EXISTANT - EXACTEMENT comme page.tsx */}
        
        {/* Structure du programme */}
        {formationData.programStructure && formationData.programStructure.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Structure du programme</h2>
            <ul className="list-disc pl-5">
              {formationData.programStructure.map((item: string, index: number) => (
                <li key={index} className="text-lg mb-2">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Contenu du cours */}
        {formationData.courseContent && formationData.courseContent.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Contenu du cours</h2>
            <ul className="list-disc pl-5">
              {formationData.courseContent.map((item: string, index: number) => (
                <li key={index} className="text-lg mb-2">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Opportunités de carrière */}
        {formationData.careerOpportunities && formationData.careerOpportunities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Opportunités de carrière</h2>
            <ul className="list-disc pl-5">
              {formationData.careerOpportunities.map((item: string, index: number) => (
                <li key={index} className="text-lg mb-2">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Ateliers de formation (si existe) */}
        {formationData.workshopTitle && (
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">{formationData.workshopTitle}</h2>
            <p className="text-lg mb-6">{formationData.workshopDescription}</p>
            {formationData.workshopImages && formationData.workshopImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formationData.workshopImages.map((img: string, index: number) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt="Atelier de formation" 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA Final */}
        {formationData.cta && (
          <section className="text-center py-8 bg-gray-100 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{formationData.cta.title}</h2>
            <p className="text-lg mb-6">{formationData.cta.description}</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {formationData.cta.buttonText}
            </Button>
          </section>
        )}
      </main>
    </Card>
  );
};

export default FormationPageEditor; 