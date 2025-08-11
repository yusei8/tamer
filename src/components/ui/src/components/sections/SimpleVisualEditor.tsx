import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { 
  Plus, X, Upload, Save, Edit3, Type, Image, Square,
  Palette, AlignLeft, AlignCenter, AlignRight, Trash2,
  Move, RotateCw, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Section {
  id: string;
  type: 'hero' | 'text' | 'image' | 'cards' | 'cta';
  title: string;
  content: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
  layout: 'left' | 'center' | 'right';
  padding: number;
}

interface SimpleVisualEditorProps {
  formationKey: string;
  formationData: any;
  updateField: (section: string, field: string, value: any) => void;
}

const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'Formation Professionnelle Excellence',
    content: 'Développez vos compétences avec nos formations de qualité supérieure.',
    backgroundColor: '#1e40af',
    textColor: '#ffffff',
    layout: 'center',
    padding: 80
  },
  {
    id: 'text-1',
    type: 'text',
    title: 'Pourquoi Choisir Notre Formation ?',
    content: 'Notre approche pédagogique unique combine théorie et pratique pour vous garantir une formation complète et efficace.',
    backgroundColor: '#f8fafc',
    textColor: '#334155',
    layout: 'left',
    padding: 60
  },
  {
    id: 'cards-1',
    type: 'cards',
    title: 'Nos Avantages',
    content: 'Formation certifiante | Accompagnement personnalisé | Insertion professionnelle',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    layout: 'center',
    padding: 60
  },
  {
    id: 'cta-1',
    type: 'cta',
    title: 'Prêt à Commencer ?',
    content: 'Inscrivez-vous dès maintenant et transformez votre carrière !',
    backgroundColor: '#059669',
    textColor: '#ffffff',
    layout: 'center',
    padding: 60
  }
];

const SECTION_TYPES = [
  { value: 'hero', label: 'Section Hero', icon: '🎯' },
  { value: 'text', label: 'Section Texte', icon: '📝' },
  { value: 'image', label: 'Section Image', icon: '🖼️' },
  { value: 'cards', label: 'Section Cartes', icon: '📋' },
  { value: 'cta', label: 'Call to Action', icon: '🚀' }
];

const PRESET_COLORS = [
  '#1e40af', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#be123c', '#4338ca'
];

export const SimpleVisualEditor: React.FC<SimpleVisualEditorProps> = ({
  formationKey,
  formationData,
  updateField
}) => {
  const [sections, setSections] = useState<Section[]>(
    formationData.simpleVisualEditor?.sections || DEFAULT_SECTIONS
  );
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSections = () => {
    updateField('datap', `${formationKey}.simpleVisualEditor.sections`, sections);
    toast.success('Page sauvegardée !', { position: 'top-right' });
  };

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      title: `Nouveau ${type}`,
      content: 'Votre contenu ici...',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      layout: 'center',
      padding: 60
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
    toast.success('Section ajoutée !', { position: 'top-right' });
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    setSelectedSection(null);
    toast.success('Section supprimée !', { position: 'top-right' });
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sections.length - 1)) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newSections[currentIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[currentIndex]];
    
    setSections(newSections);
  };

  const renderSection = (section: Section) => {
    const style = {
      backgroundColor: section.backgroundColor,
      color: section.textColor,
      padding: `${section.padding}px 20px`,
      textAlign: section.layout as any,
      minHeight: section.type === 'hero' ? '400px' : 'auto',
      display: 'flex',
      flexDirection: 'column' as any,
      justifyContent: section.type === 'hero' ? 'center' : 'flex-start',
      position: 'relative' as any
    };

    return (
      <div
        key={section.id}
        style={style}
        className={`cursor-pointer transition-all duration-200 ${
          selectedSection === section.id && !previewMode ? 'ring-4 ring-blue-500' : ''
        }`}
        onClick={() => !previewMode && setSelectedSection(section.id)}
      >
        {!previewMode && selectedSection === section.id && (
          <div className="absolute top-2 right-2 flex space-x-1 z-10">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                moveSection(section.id, 'up');
              }}
              className="h-8 w-8 p-0 bg-white"
            >
              ↑
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                moveSection(section.id, 'down');
              }}
              className="h-8 w-8 p-0 bg-white"
            >
              ↓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                deleteSection(section.id);
              }}
              className="h-8 w-8 p-0 bg-white text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}

        {section.type === 'hero' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {section.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {section.content}
            </p>
            <Button className="mt-8 px-8 py-3 text-lg">
              Commencer
            </Button>
          </div>
        )}

        {section.type === 'text' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {section.title}
            </h2>
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </div>
        )}

        {section.type === 'image' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {section.title}
            </h2>
            {section.image ? (
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-500">Aucune image</span>
              </div>
            )}
            <p className="text-lg">{section.content}</p>
          </div>
        )}

        {section.type === 'cards' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">
              {section.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {section.content.split(' | ').map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-gray-800">
                  <div className="text-4xl mb-4">
                    {['✅', '🎯', '🚀'][index] || '⭐'}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {card.split(' ')[0]}
                  </h3>
                  <p>{card.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section.type === 'cta' && (
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {section.title}
            </h2>
            <p className="text-lg md:text-xl mb-8">
              {section.content}
            </p>
            <div className="space-x-4">
              <Button className="px-8 py-3 text-lg bg-white text-current border-2">
                S'inscrire
              </Button>
              <Button variant="outline" className="px-8 py-3 text-lg border-2 border-current">
                En savoir plus
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedSectionData = sections.find(s => s.id === selectedSection);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Panel de contrôle gauche */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Éditeur Visual</h3>
            <Button
              variant={previewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Éditer' : 'Aperçu'}
            </Button>
          </div>

          {/* Boutons d'ajout de sections */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Ajouter une section</Label>
            <div className="grid grid-cols-1 gap-2">
              {SECTION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => addSection(type.value as Section['type'])}
                  className="justify-start"
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Propriétés de la section sélectionnée */}
          {selectedSectionData && !previewMode && (
            <div className="space-y-4">
              <h4 className="font-semibold">Propriétés de la section</h4>
              
              <div>
                <Label>Titre</Label>
                <Input
                  value={selectedSectionData.title}
                  onChange={(e) => updateSection(selectedSectionData.id, { title: e.target.value })}
                />
              </div>

              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={selectedSectionData.content}
                  onChange={(e) => updateSection(selectedSectionData.id, { content: e.target.value })}
                  rows={4}
                />
              </div>

              {selectedSectionData.type === 'image' && (
                <div>
                  <Label>Image</Label>
                  <div className="space-y-2">
                    <Input
                      value={selectedSectionData.image || ''}
                      onChange={(e) => updateSection(selectedSectionData.id, { image: e.target.value })}
                      placeholder="URL de l'image"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Uploader une image
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label>Alignement</Label>
                <Select
                  value={selectedSectionData.layout}
                  onValueChange={(value) => updateSection(selectedSectionData.id, { layout: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Gauche</SelectItem>
                    <SelectItem value="center">Centre</SelectItem>
                    <SelectItem value="right">Droite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Couleur de fond</Label>
                <div className="space-y-2">
                  <Input
                    type="color"
                    value={selectedSectionData.backgroundColor}
                    onChange={(e) => updateSection(selectedSectionData.id, { backgroundColor: e.target.value })}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                        onClick={() => updateSection(selectedSectionData.id, { backgroundColor: color })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Couleur du texte</Label>
                <Input
                  type="color"
                  value={selectedSectionData.textColor}
                  onChange={(e) => updateSection(selectedSectionData.id, { textColor: e.target.value })}
                />
              </div>

              <div>
                <Label>Espacement (px)</Label>
                <Slider
                  value={[selectedSectionData.padding]}
                  onValueChange={(value) => updateSection(selectedSectionData.id, { padding: value[0] })}
                  min={20}
                  max={120}
                  step={10}
                />
                <span className="text-sm text-gray-500">{selectedSectionData.padding}px</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button onClick={saveSections} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Zone de prévisualisation */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-white shadow-lg mx-4 my-4 rounded-lg overflow-hidden">
          {sections.map(renderSection)}
        </div>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file && selectedSection) {
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
                updateSection(selectedSection, { image: imageUrl });
                toast.success('Image uploadée avec succès', { position: 'top-right' });
              }
            } catch (error) {
              toast.error("Erreur lors de l'upload", { position: 'top-right' });
            }
          }
        }}
      />
    </div>
  );
}; 