import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Plus, Edit, Trash2, ArrowLeft, Save, X, Upload } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RichTextEditor } from '../ui/rich-text-editor';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import {
  Wrench, CarFront, Truck, Briefcase, Users, Wallet, Book, Star, Award, BookOpen, School, Hammer, Settings, Globe, Lightbulb, Code, ChartBar, Clipboard, FileText, User, UserCheck, UserCog, UserPlus, BookMarked, BookCopy, BookDown, BookKey, BookLock, BookOpenCheck, BookText, BookType, BookX, User2, UserCircle, UserMinus, UserSquare, UserX
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog } from '../ui/dialog';
import { Document, Page, pdfjs } from 'react-pdf';
import { Switch } from '../ui/switch';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '../ui/badge';
import { usePdfLoader, getPdfJsConfig, detectDownloadManager } from '../../lib/pdfUtils';
import { uploadImage } from '../../lib/uploadUtils';
import { FormationPageEditor } from './FormationPageEditor';
import { FormationTemplateSelector } from './FormationTemplateSelector';
import { InlineFormationEditor } from './InlineFormationEditor';
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/rachef-uploads/pdf.worker.min.js`;

// Composant d'édition intégré avec design moderne
function FormationEditStepper({ pageEditData, handlePageEditChange, handlePageEditSave, setShowPageEditor, iconOptions, dataJson, datapJson, isNewFormation }: any): React.ReactElement {
  const [step, setStep] = React.useState(1);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = React.useState<{[key:string]:string}>({});
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);
  const [showFullEditor, setShowFullEditor] = React.useState(false);

  // Auto-détection du template pour l'édition
  React.useEffect(() => {
    if (!isNewFormation && pageEditData.id && step === 3) {
      // Mapper les IDs de formation aux templates
      const templateMap = {
        'mecanique': { id: 'mecanique', name: 'Formation Mécanique Automobile', previewKey: 'mecaniqueFormation' },
        'commerce': { id: 'commerce', name: 'Formation Commerce & Marketing', previewKey: 'commerceFormation' },
        'diagnostic': { id: 'diagnostic', name: 'Formation Diagnostic Automobile', previewKey: 'diagnosticFormation' },
        'conduite': { id: 'conduite', name: 'Formation Brevet Professionnel', previewKey: 'conduiteFormation' },
        'finance': { id: 'finance', name: 'Formation Comptabilité & Finance', previewKey: 'financeFormation' },
        'rh': { id: 'rh', name: 'Formation Ressources Humaines', previewKey: 'rhFormation' }
      };

      const detectedTemplate = templateMap[pageEditData.id];
      if (detectedTemplate) {
        setSelectedTemplate({
          template: detectedTemplate,
          formationKey: `${pageEditData.id}Formation`,
          clonedData: datapJson[detectedTemplate.previewKey] || {}
        });
        setShowFullEditor(true);
      }
    }
  }, [isNewFormation, pageEditData.id, step, datapJson]);
  const { updateField } = useDashboardStore();
  // 1. Ajout du ref pour l'input file atelier
  const atelierFileInputRef = React.useRef<HTMLInputElement>(null);
  // Ajout des refs pour chaque input file d'upload
  const galleryFileInputRef = React.useRef<HTMLInputElement>(null);
  const equipmentFileInputRef = React.useRef<HTMLInputElement>(null);
  const workshopFileInputRef = React.useRef<HTMLInputElement>(null);

  // Fonction pour valider les données avant de passer à l'étape suivante
  const validateStep = (currentStep: number) => {
    const errors: {[key:string]:string} = {};
    
    if (currentStep === 1) {
      if (!pageEditData.title?.trim()) errors.title = 'Le titre est requis';
      if (!pageEditData.description?.trim()) errors.description = 'La description est requise';
      if (!pageEditData.icon) errors.icon = 'Une icône est requise';
    }
    
    if (currentStep === 2) {
      if (!pageEditData.id?.trim()) errors.id = 'Un ID est requis';
      if (!pageEditData.path?.trim()) errors.path = 'Un chemin est requis';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(Math.min(step + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(step)) {
      handlePageEditSave();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header de l'éditeur */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPageEditor(false)}
                className="text-gray-600 hover:text-emerald-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formations
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">
                Édition de formation
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPageEditor(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de progression moderne */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-8">
            {[
              { num: 1, title: 'Carte de formation', desc: 'Titre, description, image' },
              { num: 2, title: 'Liens & Navigation', desc: 'ID et chemin de redirection' },
              { num: 3, title: 'Contenu détaillé', desc: 'Page complète de formation' }
            ].map((stepInfo, idx) => (
              <div key={stepInfo.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer ${
                      step === stepInfo.num
                        ? 'bg-emerald-600 text-white shadow-lg scale-110'
                        : step > stepInfo.num
                        ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                    }`}
                    onClick={() => setStep(stepInfo.num)}
                  >
                    {stepInfo.num}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${step === stepInfo.num ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {stepInfo.title}
                    </div>
                    <div className="text-xs text-gray-500 max-w-24">
                      {stepInfo.desc}
                    </div>
                  </div>
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-colors duration-300 ${
                    step > stepInfo.num ? 'bg-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Étape 1 : Édition de carte */}
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Aperçu en temps réel */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Aperçu en temps réel
                  </h2>
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="group overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-xl w-full max-w-md">
                      <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden rounded-t-xl">
                        <img 
                          src={pageEditData.image || 'https://via.placeholder.com/400x225?text=Image+de+formation'} 
                          alt={pageEditData.title || 'Aperçu formation'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                            {iconOptions.find(opt => opt.name === pageEditData.icon)?.icon || <GraduationCap className="w-5 h-5 text-white" />}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            <div dangerouslySetInnerHTML={{ __html: cleanHtml(pageEditData.title || '<span class="text-gray-400">Titre de la formation...</span>') }} />
                          </h3>
                        </div>
                        <div className="text-gray-600 mb-6 leading-relaxed min-h-[48px]">
                          <div dangerouslySetInnerHTML={{ __html: cleanHtml(pageEditData.description || '<span class="text-gray-300">Description de la formation...</span>') }} />
                        </div>
                        <button disabled className="inline-flex items-center text-emerald-600 font-semibold opacity-60 cursor-not-allowed bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                          En savoir plus
                          <span className="ml-2">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulaire d'édition */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Edit className="w-5 h-5 mr-3 text-emerald-600" />
                    Modifier la carte
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Titre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de la formation *
                      </label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={pageEditData.title || ''}
                        onChange={(e) => {
                          handlePageEditChange('title', e.target.value);
                          setValidationErrors(v => ({...v, title: undefined}));
                        }}
                        placeholder="Ex: Formation en Mécanique Automobile"
                      />
                      {validationErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                      )}
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={pageEditData.description || ''}
                        onChange={(e) => {
                          handlePageEditChange('description', e.target.value);
                          setValidationErrors(v => ({...v, description: undefined}));
                        }}
                        placeholder="Décrivez les objectifs et le contenu de cette formation..."
                      />
                      {validationErrors.description && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                      )}
                    </div>

                    {/* Icône */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icône *
                      </label>
                      <div className="flex items-center space-x-3">
                        <select 
                          className={`flex-1 border-2 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${
                            validationErrors.icon ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-emerald-300'
                          }`}
                          value={pageEditData.icon || ''} 
                          onChange={e => {
                            handlePageEditChange('icon', e.target.value);
                            setValidationErrors(v => ({...v, icon: undefined}));
                          }}
                        >
                          <option value="">-- Choisir une icône --</option>
                          {iconOptions.map(opt => (
                            <option key={opt.name} value={opt.name}>{opt.name}</option>
                          ))}
                        </select>
                        {pageEditData.icon && (
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl text-emerald-600">
                              {iconOptions.find(opt => opt.name === pageEditData.icon)?.icon}
                            </span>
                          </div>
                        )}
                      </div>
                      {validationErrors.icon && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.icon}</p>
                      )}
                    </div>

                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image de couverture
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input 
                            className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition" 
                            value={pageEditData.image || ''} 
                            onChange={e => handlePageEditChange('image', e.target.value)} 
                            placeholder="URL de l'image ou utilisez le bouton Parcourir..." 
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="border-emerald-200 hover:bg-emerald-50 px-6 py-3 text-base" 
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Uploader une image
                            </span>
                          </Button>
                          <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              // Vérifier le type de fichier
                              if (!file.type.startsWith('image/')) {
                                toast.error('Veuillez sélectionner une image valide', { position: 'top-right' });
                                return;
                              }
                              
                              const formData = new FormData();
                              formData.append('file', file);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              
                              try {
                                const res = await fetch(apiUrl, {
                                  method: 'POST',
                                  body: formData,
                                });
                                
                                if (res.ok) {
                                  const data = await res.json();
                                  handlePageEditChange('image', `/rachef-uploads/${data.filename}`);
                                  toast.success('Image uploadée avec succès', { position: 'top-right' });
                                } else {
                                  const errorData = await res.text();
                                  console.error('Erreur serveur:', errorData);
                                  toast.error(`Erreur serveur: ${res.status}`, { position: 'top-right' });
                                }
                              } catch (error) {
                                console.error('Erreur upload:', error);
                                toast.error("Erreur de connexion au serveur", { position: 'top-right' });
                              }
                            }} 
                          />
                        </div>
                        {pageEditData.image && (
                          <div className="relative">
                            <img 
                              src={pageEditData.image} 
                              alt="aperçu" 
                              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" 
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                              onClick={() => handlePageEditChange('image', '')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2 : Liens et navigation */}
            {step === 2 && (
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Configuration principale */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Globe className="w-6 h-6 mr-3 text-emerald-600" />
                        Configuration des liens et navigation
                      </h2>
                      
                      <div className="space-y-8">
                        {/* ID de la formation */}
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-3">
                            Identifiant de la formation *
                          </label>
                          <p className="text-gray-600 text-sm mb-4">
                            Choisissez l'identifiant unique qui sera utilisé pour cette formation dans le système.
                          </p>
                          <div className="relative">
                            <select
                              className={`w-full border-2 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition appearance-none bg-white ${
                                validationErrors.id ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-emerald-300'
                              }`}
                              value={pageEditData.id || ''}
                              onChange={e => {
                                handlePageEditChange('id', e.target.value);
                                handlePageEditChange('path', `/formations/${e.target.value}`);
                                setValidationErrors(v => ({...v, id: undefined}));
                              }}
                            >
                              <option value="">-- Sélectionner un ID --</option>
                              {dataJson?.formations?.items?.map((f: any) => (
                                <option key={f.id} value={f.id}>
                                  {f.id} ({f.title})
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          {validationErrors.id && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.id}</p>
                          )}
                        </div>

                        {/* Chemin de redirection */}
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-3">
                            Chemin de redirection *
                          </label>
                          <p className="text-gray-600 text-sm mb-4">
                            URL qui sera utilisée pour accéder à cette formation sur le site web.
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 font-mono bg-gray-100 px-4 py-3 rounded-l-lg border-2 border-gray-200 text-sm">
                              {window.location.origin}
                            </span>
                            <input
                              className={`flex-1 border-2 rounded-r-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-mono ${validationErrors.path ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-emerald-300'}`}
                              value={pageEditData.path || ''}
                              onChange={e => {
                                handlePageEditChange('path', e.target.value);
                                setValidationErrors(v => ({...v, path: undefined}));
                              }}
                              placeholder="/formations/mon-id"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2"
                              onClick={() => {
                                // Ajoute le chemin actuel à la liste des chemins disponibles (si non déjà présent)
                                if (pageEditData.path && !dataJson.formations.items.some(f => f.path === pageEditData.path)) {
                                  // Extraire l'ID du chemin (ex: /formations/mon-id => mon-id)
                                  const match = pageEditData.path.match(/\/formations\/(.+)/);
                                  const newId = match ? match[1] : '';
                                  if (newId) {
                                    handlePageEditChange('id', newId);
                                    handlePageEditChange('path', `/formations/${newId}`);
                                    toast.success('Nouveau chemin et identifiant créés et sélectionnés', { position: 'top-right' });
                                  } else {
                                    toast.error('Le chemin doit être du type /formations/mon-id', { position: 'top-right' });
                                  }
                                } else {
                                  toast.error('Ce chemin existe déjà ou est vide', { position: 'top-right' });
                                }
                              }}
                            >
                              Ajouter ce nouveau chemin
                            </Button>
                          </div>
                          {validationErrors.path && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.path}</p>
                          )}
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-xs text-gray-500">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              Le chemin doit commencer par "/"
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              Doit être unique sur le site
                            </div>
                          </div>
                        </div>

                        {/* Suggestions de chemins */}
                        {pageEditData.title && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                              <Lightbulb className="w-4 h-4 mr-2" />
                              Suggestions de chemins
                            </h4>
                            <div className="space-y-2">
                              {[
                                `/formations/${pageEditData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
                                `/formations/${pageEditData.id || 'nouveau'}`,
                                `/formation/${pageEditData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
                              ].filter(Boolean).map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="block w-full text-left px-3 py-2 text-sm font-mono bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                                  onClick={() => handlePageEditChange('path', suggestion)}
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Panneau d'aperçu et validation */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-emerald-600" />
                        Aperçu & Validation
                      </h3>
                      
                      {/* Aperçu du lien final */}
                      {pageEditData.path && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-700 mb-2">Lien final :</h4>
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <code className="text-emerald-700 text-sm break-all">
                              {window.location.origin}{pageEditData.path}
                            </code>
                          </div>
                          <button
                            type="button"
                            className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}${pageEditData.path}`)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copier le lien
                          </button>
                        </div>
                      )}

                      {/* Validation en temps réel */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Validation :</h4>
                        
                        <div className="space-y-2">
                          <div className={`flex items-center text-sm ${pageEditData.id ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${pageEditData.id ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            ID sélectionné
                          </div>
                          
                          <div className={`flex items-center text-sm ${pageEditData.path?.startsWith('/') ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${pageEditData.path?.startsWith('/') ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            Chemin valide
                          </div>
                          
                          <div className={`flex items-center text-sm ${pageEditData.path && pageEditData.path.length > 1 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${pageEditData.path && pageEditData.path.length > 1 ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            Chemin non vide
                          </div>
                        </div>
                      </div>

                      {/* Liens existants */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-2">Liens existants :</h4>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {dataJson?.formations?.items?.map((f: any) => (
                            <div key={f.id} className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">
                              {f.path || `/formations/${f.id}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3 : Page complète de formation - Sélecteur de template pour nouvelles formations */}
            {step === 3 && !showFullEditor && isNewFormation && (
              <FormationTemplateSelector
                pageEditData={pageEditData}
                handlePageEditChange={handlePageEditChange}
                onTemplateSelected={(templateData) => {
                  setSelectedTemplate(templateData);
                  // Copier les données du template dans datapJson
                  updateField('datap', templateData.formationKey, templateData.clonedData);
                  setShowFullEditor(true);
                }}
              />
            )}

            {/* Éditeur complet de la page de formation */}
            {step === 3 && showFullEditor && selectedTemplate && (
              <div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">
                        Template utilisé: {selectedTemplate.template.name}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Vous pouvez maintenant personnaliser entièrement cette formation
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowFullEditor(false);
                        setSelectedTemplate(null);
                      }}
                    >
                      Changer de template
                    </Button>
                  </div>
                </div>
                
                <InlineFormationEditor
                  pageEditData={pageEditData}
                  selectedTemplate={selectedTemplate.template}
                  formationData={datapJson[selectedTemplate.formationKey] || {}}
                  formationKey={selectedTemplate.formationKey}
                  updateField={updateField}
                  onSave={() => {
                    handlePageEditSave();
                  }}
                />
              </div>
            )}

            {/* Ancien étape 3 : Contenu détaillé (gardé en commentaire) */}
            {false && step === 3 && (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Éditeur de contenu */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-emerald-600" />
                        Contenu détaillé de la formation
                      </h2>
                      <div className="space-y-6">
                        {/* Titre de la page */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la page</label>
                          <textarea
                            className="w-full border rounded px-2 py-2 min-h-20"
                            value={datapJson[`${pageEditData.id}Formation`]?.title || pageEditData.title || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.title`, e.target.value)}
                            placeholder="Titre principal de la page de formation"
                          />
                        </div>
                        {/* Description détaillée */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée</label>
                          <textarea
                            className="w-full border rounded px-2 py-2 min-h-20"
                            value={datapJson[`${pageEditData.id}Formation`]?.description || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.description`, e.target.value)}
                            placeholder="Description complète de la formation, objectifs, prérequis..."
                          />
                        </div>
                        {/* Image principale */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image principale de la page</label>
                          <div className="flex items-center space-x-3">
                            <input
                              className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition"
                              value={datapJson[`${pageEditData.id}Formation`]?.image || pageEditData.image || ''}
                              onChange={e => updateField('datap', `${pageEditData.id}Formation.image`, e.target.value)}
                              placeholder="URL de l'image principale..."
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Upload
                            </Button>
                          </div>
                        </div>
                        {/* Structure du programme */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Structure du programme</label>
                          <div className="space-y-3">
                            {(datapJson[`${pageEditData.id}Formation`]?.programStructure || []).map((item: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <textarea
                                  className="w-full border rounded px-2 py-2 min-h-20"
                                  value={item}
                                  onChange={e => {
                                    const arr = [...(datapJson[`${pageEditData.id}Formation`]?.programStructure || [])];
                                    arr[idx] = e.target.value;
                                    updateField('datap', `${pageEditData.id}Formation.programStructure`, arr);
                                  }}
                                  placeholder="Élément du programme..."
                                />
                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                  const arr = (datapJson[`${pageEditData.id}Formation`]?.programStructure || []).filter((_, i) => i !== idx);
                                  updateField('datap', `${pageEditData.id}Formation.programStructure`, arr);
                                }} className="text-red-600 hover:bg-red-50"><X className="w-4 h-4" /></Button>
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                              const arr = [...(datapJson[`${pageEditData.id}Formation`]?.programStructure || []), ''];
                              updateField('datap', `${pageEditData.id}Formation.programStructure`, arr);
                            }} className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50"><Plus className="w-4 h-4 mr-2" />Ajouter un élément</Button>
                          </div>
                        </div>
                        {/* Contenu du cours */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contenu du cours</label>
                          <div className="space-y-3">
                            {(datapJson[`${pageEditData.id}Formation`]?.courseContent || []).map((item: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <textarea
                                  className="w-full border rounded px-2 py-2 min-h-20"
                                  value={item}
                                  onChange={e => {
                                    const arr = [...(datapJson[`${pageEditData.id}Formation`]?.courseContent || [])];
                                    arr[idx] = e.target.value;
                                    updateField('datap', `${pageEditData.id}Formation.courseContent`, arr);
                                  }}
                                  placeholder="Contenu du cours..."
                                />
                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                  const arr = (datapJson[`${pageEditData.id}Formation`]?.courseContent || []).filter((_, i) => i !== idx);
                                  updateField('datap', `${pageEditData.id}Formation.courseContent`, arr);
                                }} className="text-red-600 hover:bg-red-50"><X className="w-4 h-4" /></Button>
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                              const arr = [...(datapJson[`${pageEditData.id}Formation`]?.courseContent || []), ''];
                              updateField('datap', `${pageEditData.id}Formation.courseContent`, arr);
                            }} className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50"><Plus className="w-4 h-4 mr-2" />Ajouter du contenu</Button>
                          </div>
                        </div>
                        {/* Débouchés professionnels */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Débouchés professionnels</label>
                          <div className="space-y-3">
                            {(datapJson[`${pageEditData.id}Formation`]?.careerOpportunities || []).map((item: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <textarea
                                  className="w-full border rounded px-2 py-2 min-h-20"
                                  value={item}
                                  onChange={e => {
                                    const arr = [...(datapJson[`${pageEditData.id}Formation`]?.careerOpportunities || [])];
                                    arr[idx] = e.target.value;
                                    updateField('datap', `${pageEditData.id}Formation.careerOpportunities`, arr);
                                  }}
                                  placeholder="Débouché professionnel..."
                                />
                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                  const arr = (datapJson[`${pageEditData.id}Formation`]?.careerOpportunities || []).filter((_, i) => i !== idx);
                                  updateField('datap', `${pageEditData.id}Formation.careerOpportunities`, arr);
                                }} className="text-red-600 hover:bg-red-50"><X className="w-4 h-4" /></Button>
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                              const arr = [...(datapJson[`${pageEditData.id}Formation`]?.careerOpportunities || []), ''];
                              updateField('datap', `${pageEditData.id}Formation.careerOpportunities`, arr);
                            }} className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50"><Plus className="w-4 h-4 mr-2" />Ajouter une opportunité</Button>
                          </div>
                        </div>
                        {/* Ateliers de formation */}
                        {datapJson[`${pageEditData.id}Formation`]?.workshopTitle !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'atelier</label>
                            <input
                              className="w-full border rounded px-2 py-2 mb-2"
                              value={datapJson[`${pageEditData.id}Formation`]?.workshopTitle || ''}
                              onChange={e => updateField('datap', `${pageEditData.id}Formation.workshopTitle`, e.target.value)}
                              placeholder="Titre de l'atelier..."
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description de l'atelier</label>
                            <textarea
                              className="w-full border rounded px-2 py-2 min-h-20"
                              value={datapJson[`${pageEditData.id}Formation`]?.workshopDescription || ''}
                              onChange={e => updateField('datap', `${pageEditData.id}Formation.workshopDescription`, e.target.value)}
                              placeholder="Description de l'atelier..."
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Images de l'atelier</label>
                            <div className="flex flex-wrap gap-4 mb-2">
                              {(datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).map((img: string, idx: number) => (
                                <div key={idx} className="relative">
                                  <img src={img} alt="atelier" className="w-32 h-20 object-cover rounded border" />
                                  <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                    const arr = (datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).filter((_, i) => i !== idx);
                                    updateField('datap', `${pageEditData.id}Formation.workshopImages`, arr);
                                  }}>Supprimer</Button>
                                </div>
                              ))}
                              <Button size="sm" variant="outline" onClick={() => workshopFileInputRef.current?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Uploader une image
                              </Button>
                              <input
                                ref={workshopFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append('file', file, file.name);
                                  // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                                  const res = await fetch(apiUrl, { method: 'POST', body: formData });
                                  if (res.ok) {
                                    const data = await res.json();
                                    const url = `/rachef-uploads/${data.filename}`;
                                    const arr = datapJson[`${pageEditData.id}Formation`]?.workshopImages || [];
                                    if (arr.includes(url)) {
                                      toast.error('Image déjà présente', { position: 'top-right' });
                                      return;
                                    }
                                    updateField('datap', `${pageEditData.id}Formation.workshopImages`, [...arr, url]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {/* Certifications */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                          {(datapJson[`${pageEditData.id}Formation`]?.certifications || []).map((cert: any, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2">
                              <input
                                className="w-1/3 border rounded px-2 py-2"
                                value={cert.title}
                                onChange={e => {
                                  const arr = [...datapJson[`${pageEditData.id}Formation`].certifications];
                                  arr[idx].title = e.target.value;
                                  updateField('datap', `${pageEditData.id}Formation.certifications`, arr);
                                }}
                                placeholder="Titre"
                              />
                              <input
                                className="w-2/3 border rounded px-2 py-2"
                                value={cert.description}
                                onChange={e => {
                                  const arr = [...datapJson[`${pageEditData.id}Formation`].certifications];
                                  arr[idx].description = e.target.value;
                                  updateField('datap', `${pageEditData.id}Formation.certifications`, arr);
                                }}
                                placeholder="Description"
                              />
                              <Button size="sm" variant="ghost" onClick={() => {
                                const arr = datapJson[`${pageEditData.id}Formation`].certifications.filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.certifications`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => {
                            const arr = [...(datapJson[`${pageEditData.id}Formation`]?.certifications || []), { title: '', description: '' }];
                            updateField('datap', `${pageEditData.id}Formation.certifications`, arr);
                          }}>Ajouter une certification</Button>
                        </div>
                        {/* CTA */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Titre du bloc d'appel à l'action</label>
                          <input
                            className="w-full border rounded px-2 py-2 mb-2"
                            value={datapJson[`${pageEditData.id}Formation`]?.cta?.title || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.cta.title`, e.target.value)}
                            placeholder="Titre du bloc CTA (ex: Lancez votre carrière...)"
                          />
                        </div>
                        {/* Images supplémentaires (galleryImages, equipmentImages, etc.) */}
                        {(datapJson[`${pageEditData.id}Formation`]?.sections || []).map((section: any, sIdx: number) => (
                          <div key={sIdx} className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                            <ul className="space-y-2">
                              {(section.items || []).map((item: any, idx: number) => (
                                <li key={idx} className="flex items-center gap-2">
                                  {item.icon && iconOptions.find(opt => opt.name === item.icon)?.icon}
                                  <span>{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      
                              
                        {/* Champ titre galerie d'images */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la galerie d'images</label>
                          <input
                            className="w-full border rounded px-2 py-2 mb-2"
                            value={datapJson[`${pageEditData.id}Formation`]?.galleryTitle || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.galleryTitle`, e.target.value)}
                            placeholder="Titre de la galerie (ex: Galerie, Nos réalisations...)"
                          />
                        </div>
                        {/* Galerie d'images */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Galerie d'images</h3>
                          <div className="flex flex-wrap gap-4 mb-2">
                            {(datapJson[`${pageEditData.id}Formation`]?.galleryImages || []).map((img: string, idx: number) => (
                              <div key={idx} className="relative">
                                <img src={img} alt="galerie" className="w-32 h-20 object-cover rounded border" />
                                <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                  const arr = (datapJson[`${pageEditData.id}Formation`]?.galleryImages || []).filter((_, i) => i !== idx);
                                  updateField('datap', `${pageEditData.id}Formation.galleryImages`, arr);
                                }}>Supprimer</Button>
                              </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={() => galleryFileInputRef.current?.click()}>
                              <Upload className="w-4 h-4 mr-2" />
                              Uploader une image
                            </Button>
                            <input
                              ref={galleryFileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file, file.name);
                                // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                                const res = await fetch(apiUrl, { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  const url = `/rachef-uploads/${data.filename}`;
                                  const arr = datapJson[`${pageEditData.id}Formation`]?.galleryImages || [];
                                  if (arr.includes(url)) {
                                    toast.error('Image déjà présente', { position: 'top-right' });
                                    return;
                                  }
                                  updateField('datap', `${pageEditData.id}Formation.galleryImages`, [...arr, url]);
                                }
                              }}
                            />
                          </div>
                        </div>
                        {/* Images équipements */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Titre des images équipements</h3>
                          <input
                            className="w-full border rounded px-2 py-2 mb-2"
                            value={datapJson[`${pageEditData.id}Formation`]?.equipmentTitle || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.equipmentTitle`, e.target.value)}
                            placeholder="Titre des équipements (ex: Nos équipements...)"
                          />
                        </div>
                        {/* Description des images équipements */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description des images équipements</label>
                          <textarea
                            className="w-full border rounded px-2 py-2 mb-2"
                            value={datapJson[`${pageEditData.id}Formation`]?.equipmentDescription || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.equipmentDescription`, e.target.value)}
                            placeholder="Description des équipements..."
                          />
                        </div>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {(datapJson[`${pageEditData.id}Formation`]?.equipmentImages || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="équipement" className="w-32 h-20 object-cover rounded border" />
                              <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                const arr = (datapJson[`${pageEditData.id}Formation`]?.equipmentImages || []).filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.equipmentImages`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => equipmentFileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </Button>
                          <input
                            ref={equipmentFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file, file.name);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              const res = await fetch(apiUrl, { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                const url = `/rachef-uploads/${data.filename}`;
                                const arr = datapJson[`${pageEditData.id}Formation`]?.equipmentImages || [];
                                if (arr.includes(url)) {
                                  toast.error('Image déjà présente', { position: 'top-right' });
                                  return;
                                }
                                updateField('datap', `${pageEditData.id}Formation.equipmentImages`, [...arr, url]);
                              }
                            }}
                          />
                        </div>
                        {/* Images ateliers */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Titre des images ateliers</h3>
                          <input
                            className="w-full border rounded px-2 py-2 mb-2"
                            value={datapJson[`${pageEditData.id}Formation`]?.workshopTitleImages || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.workshopTitleImages`, e.target.value)}
                            placeholder="Titre des ateliers (ex: Nos ateliers...)"
                          />
                        </div>
                        {/* Description des images ateliers */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description des images ateliers</label>
                          <textarea
                            className="w-full border rounded px-2 py-2 mb-2"
                            value={datapJson[`${pageEditData.id}Formation`]?.workshopDescriptionImages || ''}
                            onChange={e => updateField('datap', `${pageEditData.id}Formation.workshopDescriptionImages`, e.target.value)}
                            placeholder="Description des ateliers..."
                          />
                        </div>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {(datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="atelier" className="w-32 h-20 object-cover rounded border" />
                              <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                const arr = (datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.workshopImages`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => workshopFileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </Button>
                          <input
                            ref={workshopFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file, file.name);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              const res = await fetch(apiUrl, { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                const url = `/rachef-uploads/${data.filename}`;
                                const arr = datapJson[`${pageEditData.id}Formation`]?.workshopImages || [];
                                if (arr.includes(url)) {
                                  toast.error('Image déjà présente', { position: 'top-right' });
                                  return;
                                }
                                updateField('datap', `${pageEditData.id}Formation.workshopImages`, [...arr, url]);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aperçu de la page */}
                  <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Aperçu de la page
                    </h3>
                    
                    <div className="space-y-6 max-h-[600px] overflow-y-auto">
                      {/* En-tête de la page */}
                      <div className="border-b border-gray-200 pb-6">
                        {datapJson[`${pageEditData.id}Formation`]?.image && (
                          <img
                            src={datapJson[`${pageEditData.id}Formation`].image}
                            alt="Formation"
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                          <div dangerouslySetInnerHTML={{ 
                            __html: cleanHtml(datapJson[`${pageEditData.id}Formation`]?.title || pageEditData.title || 'Titre de la formation') 
                          }} />
                        </h1>
                        <div className="text-gray-600 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ 
                            __html: cleanHtml(datapJson[`${pageEditData.id}Formation`]?.description || 'Description de la formation...') 
                          }} />
                        </div>
                      </div>

                      {/* Structure du programme */}
                      {datapJson[`${pageEditData.id}Formation`]?.sections?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Structure du programme</h3>
                          <ul className="space-y-2">
                            {(datapJson[`${pageEditData.id}Formation`]?.sections || []).map((section: any, sIdx: number) => (
                              <li key={sIdx} className="flex items-center gap-2">
                                {section.title}
                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                  const arr = [...(datapJson[`${pageEditData.id}Formation`]?.sections || [])];
                                  arr[sIdx] = { ...arr[sIdx], items: [] };
                                  updateField('datap', `${pageEditData.id}Formation.sections`, arr);
                                }} className="text-red-600 hover:bg-red-50"><X className="w-4 h-4" /></Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Contenu du cours */}
                      {datapJson[`${pageEditData.id}Formation`]?.sections?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contenu du cours</h3>
                          <div className="space-y-3">
                            {(datapJson[`${pageEditData.id}Formation`]?.sections || []).map((section: any, sIdx: number) => (
                              <div key={sIdx} className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                                <ul className="space-y-2">
                                  {(section.items || []).map((item: any, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      {item.icon && iconOptions.find(opt => opt.name === item.icon)?.icon}
                                      <span>{item.text}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Débouchés professionnels */}
                      {datapJson[`${pageEditData.id}Formation`]?.sections?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Débouchés professionnels</h3>
                          <div className="space-y-3">
                            {(datapJson[`${pageEditData.id}Formation`]?.sections || []).map((section: any, sIdx: number) => (
                              <div key={sIdx} className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                                <ul className="space-y-2">
                                  {(section.items || []).map((item: any, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      {item.icon && iconOptions.find(opt => opt.name === item.icon)?.icon}
                                      <span>{item.text}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Ateliers de formation */}
                      {datapJson[`${pageEditData.id}Formation`]?.workshopTitle && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{datapJson[`${pageEditData.id}Formation`].workshopTitle}</h3>
                          <div className="text-gray-700 mb-2">{datapJson[`${pageEditData.id}Formation`].workshopDescription}</div>
                          <div className="flex flex-wrap gap-4">
                            {(datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).map((img: string, idx: number) => (
                              <img key={idx} src={img} alt="atelier" className="w-32 h-20 object-cover rounded border" />
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Certifications */}
                      {datapJson[`${pageEditData.id}Formation`]?.certifications && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h3>
                          <ul className="list-disc pl-6">
                            {(datapJson[`${pageEditData.id}Formation`]?.certifications || []).map((cert: any, idx: number) => (
                              <li key={idx} className="mb-1"><span className="font-semibold">{cert.title}</span> : {cert.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* CTA */}
                      {datapJson[`${pageEditData.id}Formation`]?.cta && (
                        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
                          <h3 className="text-lg font-semibold text-emerald-700 mb-1">{datapJson[`${pageEditData.id}Formation`].cta.title}</h3>
                          <div className="mb-2">{datapJson[`${pageEditData.id}Formation`].cta.description}</div>
                          <Button className="bg-emerald-600 text-white mt-2">{datapJson[`${pageEditData.id}Formation`].cta.buttonText || "S'inscrire"}</Button>
                        </div>
                      )}
                      {/* Images supplémentaires */}
                      {(datapJson[`${pageEditData.id}Formation`]?.sections || []).map((section: any, sIdx: number) => (
                        <div key={sIdx} className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                          <ul className="space-y-2">
                            {(section.items || []).map((item: any, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                {item.icon && iconOptions.find(opt => opt.name === item.icon)?.icon}
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {/* Galerie d'images */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Galerie d'images</h3>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {(datapJson[`${pageEditData.id}Formation`]?.galleryImages || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="galerie" className="w-32 h-20 object-cover rounded border" />
                              <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                const arr = (datapJson[`${pageEditData.id}Formation`]?.galleryImages || []).filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.galleryImages`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => galleryFileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </Button>
                          <input
                            ref={galleryFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file, file.name);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              const res = await fetch(apiUrl, { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                const url = `/rachef-uploads/${data.filename}`;
                                const arr = datapJson[`${pageEditData.id}Formation`]?.galleryImages || [];
                                if (arr.includes(url)) {
                                  toast.error('Image déjà présente', { position: 'top-right' });
                                  return;
                                }
                                updateField('datap', `${pageEditData.id}Formation.galleryImages`, [...arr, url]);
                              }
                            }}
                          />
                        </div>
                      </div>
                      {/* Images équipements */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Images équipements</h3>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {(datapJson[`${pageEditData.id}Formation`]?.equipmentImages || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="équipement" className="w-32 h-20 object-cover rounded border" />
                              <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                const arr = (datapJson[`${pageEditData.id}Formation`]?.equipmentImages || []).filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.equipmentImages`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => equipmentFileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </Button>
                          <input
                            ref={equipmentFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file, file.name);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              const res = await fetch(apiUrl, { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                const url = `/rachef-uploads/${data.filename}`;
                                const arr = datapJson[`${pageEditData.id}Formation`]?.equipmentImages || [];
                                if (arr.includes(url)) {
                                  toast.error('Image déjà présente', { position: 'top-right' });
                                  return;
                                }
                                updateField('datap', `${pageEditData.id}Formation.equipmentImages`, [...arr, url]);
                              }
                            }}
                          />
                        </div>
                      </div>
                      {/* Images ateliers */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Images ateliers</h3>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {(datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="atelier" className="w-32 h-20 object-cover rounded border" />
                              <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                const arr = (datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.workshopImages`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => workshopFileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </Button>
                          <input
                            ref={workshopFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file, file.name);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              const res = await fetch(apiUrl, { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                const url = `/rachef-uploads/${data.filename}`;
                                const arr = datapJson[`${pageEditData.id}Formation`]?.workshopImages || [];
                                if (arr.includes(url)) {
                                  toast.error('Image déjà présente', { position: 'top-right' });
                                  return;
                                }
                                updateField('datap', `${pageEditData.id}Formation.workshopImages`, [...arr, url]);
                              }
                            }}
                          />
                        </div>
                      </div>
                      {/* Champ titre galerie d'images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la galerie d'images</label>
                        <input
                          className="w-full border rounded px-2 py-2 mb-2"
                          value={datapJson[`${pageEditData.id}Formation`]?.galleryTitle || ''}
                          onChange={e => updateField('datap', `${pageEditData.id}Formation.galleryTitle`, e.target.value)}
                          placeholder="Titre de la galerie (ex: Galerie, Nos réalisations...)"
                        />
                      </div>
                      {/* Galerie d'images */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Galerie d'images</h3>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {(datapJson[`${pageEditData.id}Formation`]?.galleryImages || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="galerie" className="w-32 h-20 object-cover rounded border" />
                              <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                                const arr = (datapJson[`${pageEditData.id}Formation`]?.galleryImages || []).filter((_, i) => i !== idx);
                                updateField('datap', `${pageEditData.id}Formation.galleryImages`, arr);
                              }}>Supprimer</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => galleryFileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </Button>
                          <input
                            ref={galleryFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file, file.name);
                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                              const res = await fetch(apiUrl, { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                const url = `/rachef-uploads/${data.filename}`;
                                const arr = datapJson[`${pageEditData.id}Formation`]?.galleryImages || [];
                                if (arr.includes(url)) {
                                  toast.error('Image déjà présente', { position: 'top-right' });
                                  return;
                                }
                                updateField('datap', `${pageEditData.id}Formation.galleryImages`, [...arr, url]);
                              }
                            }}
                          />
                        </div>
                      </div>
                      {/* Images équipements */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Titre des images équipements</h3>
                        <input
                          className="w-full border rounded px-2 py-2 mb-2"
                          value={datapJson[`${pageEditData.id}Formation`]?.equipmentTitle || ''}
                          onChange={e => updateField('datap', `${pageEditData.id}Formation.equipmentTitle`, e.target.value)}
                          placeholder="Titre des équipements (ex: Nos équipements...)"
                        />
                      </div>
                      {/* Description des images équipements */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description des images équipements</label>
                        <textarea
                          className="w-full border rounded px-2 py-2 mb-2"
                          value={datapJson[`${pageEditData.id}Formation`]?.equipmentDescription || ''}
                          onChange={e => updateField('datap', `${pageEditData.id}Formation.equipmentDescription`, e.target.value)}
                          placeholder="Description des équipements..."
                        />
                      </div>
                      <div className="flex flex-wrap gap-4 mb-2">
                        {(datapJson[`${pageEditData.id}Formation`]?.equipmentImages || []).map((img: string, idx: number) => (
                          <div key={idx} className="relative">
                            <img src={img} alt="équipement" className="w-32 h-20 object-cover rounded border" />
                            <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                              const arr = (datapJson[`${pageEditData.id}Formation`]?.equipmentImages || []).filter((_, i) => i !== idx);
                              updateField('datap', `${pageEditData.id}Formation.equipmentImages`, arr);
                            }}>Supprimer</Button>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => equipmentFileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Uploader une image
                        </Button>
                        <input
                          ref={equipmentFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('file', file, file.name);
                                                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                            const res = await fetch(apiUrl, { method: 'POST', body: formData });
                            if (res.ok) {
                              const data = await res.json();
                              const url = `/rachef-uploads/${data.filename}`;
                              const arr = datapJson[`${pageEditData.id}Formation`]?.equipmentImages || [];
                              if (arr.includes(url)) {
                                toast.error('Image déjà présente', { position: 'top-right' });
                                return;
                              }
                              updateField('datap', `${pageEditData.id}Formation.equipmentImages`, [...arr, url]);
                            }
                          }}
                        />
                      </div>
                      {/* Images ateliers */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Titre des images ateliers</h3>
                        <input
                          className="w-full border rounded px-2 py-2 mb-2"
                          value={datapJson[`${pageEditData.id}Formation`]?.workshopTitleImages || ''}
                          onChange={e => updateField('datap', `${pageEditData.id}Formation.workshopTitleImages`, e.target.value)}
                          placeholder="Titre des ateliers (ex: Nos ateliers...)"
                        />
                      </div>
                      {/* Description des images ateliers */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description des images ateliers</label>
                        <textarea
                          className="w-full border rounded px-2 py-2 mb-2"
                          value={datapJson[`${pageEditData.id}Formation`]?.workshopDescriptionImages || ''}
                          onChange={e => updateField('datap', `${pageEditData.id}Formation.workshopDescriptionImages`, e.target.value)}
                          placeholder="Description des ateliers..."
                        />
                      </div>
                      <div className="flex flex-wrap gap-4 mb-2">
                        {(datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).map((img: string, idx: number) => (
                          <div key={idx} className="relative">
                            <img src={img} alt="atelier" className="w-32 h-20 object-cover rounded border" />
                            <Button size="sm" variant="ghost" className="absolute top-1 right-1" onClick={() => {
                              const arr = (datapJson[`${pageEditData.id}Formation`]?.workshopImages || []).filter((_, i) => i !== idx);
                              updateField('datap', `${pageEditData.id}Formation.workshopImages`, arr);
                            }}>Supprimer</Button>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => workshopFileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Uploader une image
                        </Button>
                        <input
                          ref={workshopFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('file', file, file.name);
                                                              // Utilisation de l'utilitaire uploadImage pour la compatibilité serveur
                            const res = await fetch(apiUrl, { method: 'POST', body: formData });
                            if (res.ok) {
                              const data = await res.json();
                              const url = `/rachef-uploads/${data.filename}`;
                              const arr = datapJson[`${pageEditData.id}Formation`]?.workshopImages || [];
                              if (arr.includes(url)) {
                                toast.error('Image déjà présente', { position: 'top-right' });
                                return;
                              }
                              updateField('datap', `${pageEditData.id}Formation.workshopImages`, [...arr, url]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3"
          >
            Précédent
          </Button>
          
          <div className="flex space-x-3">
            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
              >
                Suivant
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal FormationsSection amélioré
export const FormationsSection: React.FC = () => {
  const { dataJson, datapJson, updateFormation, addFormation, removeFormation, saveData, syncNavbarWithFormations, updateField } = useDashboardStore();
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [pageEditData, setPageEditData] = useState<any>({});
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);

  // Toast pour drag & drop
  React.useEffect(() => {
    toast.success(
      (t) => (
        <div className="flex items-center justify-between">
          <span>🎯 Fonctionnalité drag & drop activée ! Vous pouvez changer l'ordre des formations en sélectionnant une carte puis en la déplaçant vers une autre position.</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-white hover:text-gray-200 font-bold text-lg"
          >
            ×
          </button>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#ffffff',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '8px',
          maxWidth: '500px'
        }
      }
    );
  }, []);

  // Options d'icônes disponibles
  const iconOptions = [
    { name: 'Wrench', icon: <Wrench className="w-5 h-5 text-white" /> },
    { name: 'CarFront', icon: <CarFront className="w-5 h-5 text-white" /> },
    { name: 'Truck', icon: <Truck className="w-5 h-5 text-white" /> },
    { name: 'Briefcase', icon: <Briefcase className="w-5 h-5 text-white" /> },
    { name: 'Users', icon: <Users className="w-5 h-5 text-white" /> },
    { name: 'Wallet', icon: <Wallet className="w-5 h-5 text-white" /> },
    { name: 'Book', icon: <Book className="w-5 h-5 text-white" /> },
    { name: 'GraduationCap', icon: <GraduationCap className="w-5 h-5 text-white" /> },
  ];

  const handleEditFormation = (formation: any) => {
    setPageEditData(JSON.parse(JSON.stringify(formation)));
    setShowPageEditor(true);
  };

  const handleAddFormation = () => {
    setPageEditData({
      id: '',
      title: '',
      description: '',
      icon: '',
      image: '',
      path: '',
      isEditing: false
    });
    setShowPageEditor(true);
  };

  // Nouvelle version : met à jour le store global à chaque changement
  const handlePageEditChange = (field: string, value: any) => {
    setPageEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePageEditSave = () => {
    try {
      let formationToSave = { ...pageEditData };
      // Validation stricte
      const requiredFields = ['id', 'title', 'description', 'image', 'icon', 'path'];
      for (const field of requiredFields) {
        if (!formationToSave[field] || (typeof formationToSave[field] === 'string' && !formationToSave[field].trim())) {
          toast.error(`Le champ "${field}" est requis pour créer une formation`, { position: 'top-right' });
          return;
        }
      }
      
      // Déterminer si c'est une nouvelle formation
      const isNewFormation = !pageEditData.isEditing && !dataJson.formations.items.some(f => f.id === formationToSave.id);
      
      // Vérifier unicité de l'id pour les nouvelles formations
      if (isNewFormation && dataJson.formations.items.some(f => f.id === formationToSave.id)) {
        toast.error('Cet identifiant existe déjà', { position: 'top-right' });
        return;
      }
      
      if (!formationToSave.path) {
        formationToSave.path = `/formations/${formationToSave.id}`;
      }
      
      if (isNewFormation) {
        // Créer la nouvelle page dans datap.json en utilisant un template
        const newPageId = pageEditData.id;
        const newPageTitle = pageEditData.title;
        const newPageDescription = pageEditData.description;

        // Définir un template de page par défaut pour les nouvelles formations
        const defaultPageTemplate = {
          title: newPageTitle,
          description: newPageDescription,
          image: pageEditData.image || "https://via.placeholder.com/1920x1080?text=Image+de+formation",
          programStructure: [],
          courseContent: [],
          careerOpportunities: [],
          cta: {
            title: `Lancez votre carrière dans ${newPageTitle}`,
            description: `Inscrivez-vous dès maintenant à notre formation complète et développez des compétences essentielles pour réussir dans le monde des affaires.`,
            buttonText: "S'inscrire maintenant"
          }
        };
        
        // Ajouter la page dans datap.json
        updateField("datap", newPageId, defaultPageTemplate);
        
        // Ajouter la formation dans data.json
        addFormation(formationToSave);
        
        // Sauvegarder immédiatement
        saveData();
        
        syncNavbarWithFormations();
      } else {
        updateFormation(formationToSave);
        syncNavbarWithFormations();
        saveData();
      }
      
      setShowPageEditor(false);
      toast.success("Formation sauvegardée avec succès!", { position: 'top-right' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde', { position: 'top-right' });
    }
  };

  const handleDeleteFormation = async (formationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        removeFormation(formationId);
        await saveData();
        syncNavbarWithFormations();
        toast.success('Formation supprimée avec succès', { position: 'top-right' });
      } catch (error) {
        toast.error('Erreur lors de la suppression', { position: 'top-right' });
      }
    }
  };

  // --- Etats pour la modale catalogue ---
  const [catalogue, setCatalogue] = useState(() => ({
    title: datapJson?.catalogueFormation?.title || '',
    description: datapJson?.catalogueFormation?.description || '',
    pdfUrl: datapJson?.catalogueFormation?.pdfUrl || '',
    downloadButton: datapJson?.catalogueFormation?.downloadButton || '',
    contactButton: datapJson?.catalogueFormation?.contactButton || '',
    error: datapJson?.catalogueFormation?.error || { title: '', details: '', solutions: [], downloadText: '', retryText: '' },
    loading: datapJson?.catalogueFormation?.loading || { title: '', subtitle: '' },
  }));
  const [isSavingCatalogue, setIsSavingCatalogue] = useState(false);
  // --- Upload PDF ---
  const handleCataloguePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    toast.loading('Upload PDF en cours...', { id: 'pdf-upload' });
    
    const result = await uploadImage(file); // uploadImage fonctionne aussi pour les PDFs
    
    if (result.success && result.filename) {
      setCatalogue(c => ({ ...c, pdfUrl: `/rachef-uploads/${result.filename}` }));
      updateField('datap', 'catalogueFormation.pdfUrl', `/rachef-uploads/${result.filename}`);
      toast.success('PDF uploadé avec succès !', { id: 'pdf-upload' });
    } else {
      toast.error(`Erreur upload PDF: ${result.error}`, { id: 'pdf-upload' });
    }
  };
  // --- Save catalogue ---
  const handleSaveCatalogue = async () => {
    setIsSavingCatalogue(true);
    updateField('datap', 'catalogueFormation.title', catalogue.title);
    updateField('datap', 'catalogueFormation.description', catalogue.description);
    updateField('datap', 'catalogueFormation.pdfUrl', catalogue.pdfUrl);
    updateField('datap', 'catalogueFormation.downloadButton', catalogue.downloadButton);
    updateField('datap', 'catalogueFormation.contactButton', catalogue.contactButton);
    updateField('datap', 'catalogueFormation.error', catalogue.error);
    updateField('datap', 'catalogueFormation.loading', catalogue.loading);
    await saveData();
    setIsSavingCatalogue(false);
    setShowCatalogueModal(false);
    toast.success('Catalogue de formation mis à jour !', { position: 'top-right' });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(dataJson.formations.items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    updateField('data', 'formations.items', reordered);
  };

  // Si l'éditeur est ouvert, afficher seulement l'éditeur
  if (showPageEditor) {
    // Déterminer si c'est une nouvelle formation
    const isNewFormation = !pageEditData.isEditing && !dataJson.formations.items.some(f => f.id === pageEditData.id);
    
    return (
            <FormationEditStepper
              pageEditData={pageEditData}
              handlePageEditChange={handlePageEditChange}
              handlePageEditSave={handlePageEditSave}
              setShowPageEditor={setShowPageEditor}
              iconOptions={iconOptions}
              dataJson={dataJson}
              datapJson={datapJson}
              isNewFormation={isNewFormation}
            />
    );
  }

  // Affichage normal de la liste des formations
  return (
    <div className="p-6 space-y-6">
      {/* Section éditable pour le titre et description de la page formations du site */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="rounded-lg border border-slate-200 bg-slate-50 hover:border-emerald-300 focus-within:border-emerald-500 transition-colors p-4 mb-6">
          <label className="block text-sm font-medium text-emerald-700 mb-2">
            🎯 Titre principal de la section Formations (affiché sur le site)
          </label>
          <Input
            className="text-3xl md:text-4xl font-extrabold text-emerald-800 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent mb-3 shadow-none outline-none transition-all duration-150"
            style={{ boxShadow: 'none', outline: 'none' }}
            value={dataJson.formations?.title || 'Nos Formations'}
            onChange={e => updateField('data', 'formations.title', e.target.value)}
            placeholder="Nos Formations"
          />
          <label className="block text-sm font-medium text-emerald-700 mb-2">
            📝 Description de la section Formations (affichée sur le site)
          </label>
          <Textarea
            className="text-lg md:text-xl font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
            style={{ minHeight: 0, boxShadow: 'none', outline: 'none' }}
            value={dataJson.formations?.description || 'Découvrez nos programmes de formation conçus pour développer vos compétences professionnelles dans divers secteurs.'}
            onChange={e => updateField('data', 'formations.description', e.target.value)}
            placeholder="Découvrez nos programmes de formation conçus pour développer vos compétences professionnelles dans divers secteurs."
            rows={3}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-emerald-600" />
            Gestion des Formations
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les formations affichées sur votre site web
          </p>
        </div>
        <Button
          onClick={handleAddFormation}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une formation
        </Button>
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="formations-droppable" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {dataJson?.formations?.items?.map((formation: any, index: number) => (
                <Draggable key={formation.id} draggableId={formation.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-emerald-300 ${snapshot.isDragging ? 'ring-4 ring-emerald-400 shadow-2xl scale-105' : ''}`}
                    >
                      <Card>
                        <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden rounded-t-lg">
                          <img 
                            src={formation.image || 'https://via.placeholder.com/400x225?text=Formation'} 
                            alt={formation.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                              {iconOptions.find(opt => opt.name === formation.icon)?.icon || <GraduationCap className="w-5 h-5 text-white" />}
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {formation.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-gray-600 line-clamp-3">
                            {formation.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              {formation.path || '/formations/' + formation.id}
                            </span>
                            <div className="flex space-x-2 items-center">
                              {/* Switch Afficher dans l'accueil */}
                              <div className="flex items-center gap-1 mr-2">
                                <Switch
                                  checked={!!formation.showOnHome}
                                  onCheckedChange={checked => updateField('data', `formations.items.${index}.showOnHome`, checked)}
                                  id={`showOnHome-${formation.id}`}
                                />
                                <label htmlFor={`showOnHome-${formation.id}`} className="text-xs text-gray-600 select-none cursor-pointer">
                                  Accueil
                                </label>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditFormation(formation)}
                                className="hover:bg-emerald-50 hover:border-emerald-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteFormation(formation.id)}
                                className="hover:bg-red-50 hover:border-red-300 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {(!dataJson?.formations?.items || dataJson.formations.items.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune formation
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par ajouter votre première formation
          </p>
          <Button
            onClick={handleAddFormation}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une formation
          </Button>
        </motion.div>
      )}
      {/* BOUTON CONFIGURER LE CATALOGUE */}
      <div className="mt-12 p-6 border rounded-lg bg-slate-50">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <BookOpen className="w-8 h-8 mr-3 text-emerald-600" />
          Catalogue de formation
        </h2>
        <Button variant="outline" className="mb-4" onClick={() => setShowCatalogueModal(true)}>
          Configurer le catalogue
        </Button>
      </div>
      {/* MODALE CONFIGURATION CATALOGUE */}
      {showCatalogueModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-0 overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-full w-full h-[90vh] mx-auto flex flex-col md:flex-row gap-8 md:gap-16 relative">
            {/* Bouton de fermeture en haut à droite */}
            <Button variant="ghost" className="absolute top-4 right-4 z-10" onClick={() => setShowCatalogueModal(false)}>
              ✕
            </Button>
            {/* Colonne des champs */}
            <div className="flex-1 min-w-[350px] max-w-2xl p-4 md:p-10 overflow-y-auto">
              <h3 className="text-lg font-bold mb-6">Configuration du catalogue</h3>
              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre du catalogue</label>
                  <textarea
                    className="w-full border rounded px-2 py-2 min-h-20"
                    value={catalogue.title}
                    onChange={v => setCatalogue(c => { updateField('datap', 'catalogueFormation.title', v); return { ...c, title: v }; })}
                    placeholder="Titre du catalogue..."
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full border rounded px-2 py-2 min-h-20"
                    value={catalogue.description}
                    onChange={v => setCatalogue(c => { updateField('datap', 'catalogueFormation.description', v); return { ...c, description: v }; })}
                    placeholder="Description du catalogue..."
                  />
                </div>
                {/* PDF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fichier PDF</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="application/pdf" onChange={handleCataloguePdfUpload} />
                    {catalogue.pdfUrl && (
                      <a href={catalogue.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">Voir le PDF actuel</a>
                    )}
                  </div>
                </div>
                {/* Boutons texte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton Télécharger</label>
                  <textarea
                    className="w-full border rounded px-2 py-2 min-h-20"
                    value={catalogue.downloadButton}
                    onChange={e => setCatalogue(c => { updateField('datap', 'catalogueFormation.downloadButton', e.target.value); return { ...c, downloadButton: e.target.value }; })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton Contact</label>
                  <textarea
                    className="w-full border rounded px-2 py-2 min-h-20"
                    value={catalogue.contactButton}
                    onChange={e => setCatalogue(c => { updateField('datap', 'catalogueFormation.contactButton', e.target.value); return { ...c, contactButton: e.target.value }; })}
                  />
                </div>
                {/* Erreur */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-2">Messages d'erreur</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Titre (erreur)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={catalogue.error.title}
                        onChange={e => setCatalogue(c => { const v = { ...c.error, title: e.target.value }; updateField('datap', 'catalogueFormation.error', v); return { ...c, error: v }; })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Détails (erreur)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={catalogue.error.details}
                        onChange={v => setCatalogue(c => { const err = { ...c.error, details: v }; updateField('datap', 'catalogueFormation.error', err); return { ...c, error: err }; })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Solutions (erreur, une par ligne)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        rows={2}
                        value={Array.isArray(catalogue.error.solutions) ? catalogue.error.solutions.join('\n') : ''}
                        onChange={e => setCatalogue(c => { const v = { ...c.error, solutions: e.target.value.split('\n') }; updateField('datap', 'catalogueFormation.error', v); return { ...c, error: v }; })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Texte bouton téléchargement (erreur)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={catalogue.error.downloadText || ''}
                        onChange={e => setCatalogue(c => { const v = { ...c.error, downloadText: e.target.value }; updateField('datap', 'catalogueFormation.error', v); return { ...c, error: v }; })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Texte bouton réessayer (erreur)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={catalogue.error.retryText || ''}
                        onChange={e => setCatalogue(c => { const v = { ...c.error, retryText: e.target.value }; updateField('datap', 'catalogueFormation.error', v); return { ...c, error: v }; })}
                      />
                    </div>
                  </div>
                </div>
                {/* Loading */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-2">Messages de chargement</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Titre (loading)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={catalogue.loading.title || ''}
                        onChange={e => setCatalogue(c => { const v = { ...c.loading, title: e.target.value }; updateField('datap', 'catalogueFormation.loading', v); return { ...c, loading: v }; })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre (loading)</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 min-h-20"
                        value={catalogue.loading.subtitle || ''}
                        onChange={e => setCatalogue(c => { const v = { ...c.loading, subtitle: e.target.value }; updateField('datap', 'catalogueFormation.loading', v); return { ...c, loading: v }; })}
                      />
                    </div>
                  </div>
                </div>
                {/* Boutons */}
                <div className="flex justify-end gap-4 mt-8">
                  <Button variant="outline" onClick={() => setShowCatalogueModal(false)}>Annuler</Button>
                  <Button variant="default" onClick={handleSaveCatalogue} disabled={isSavingCatalogue}>{isSavingCatalogue ? 'Enregistrement...' : 'Valider'}</Button>
                </div>
              </div>
            </div>
            {/* Colonne PDF preview */}
            <div className="w-full max-w-2xl p-4 md:p-10 flex flex-col items-center justify-center">
              <h4 className="text-md font-semibold mb-2">Aperçu catalogue (public)</h4>
              <CataloguePreview catalogue={catalogue} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationsSection;


// Aperçu catalogue public dans la modale
const CataloguePreview: React.FC<{ catalogue: any }> = ({ catalogue }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorDetails, setErrorDetails] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Utiliser notre loader PDF compatible IDM
  const { pdfUrl, isLoading: isPdfLoading, error: pdfError, reload } = usePdfLoader(catalogue.pdfUrl);

  useEffect(() => {
    setPageNumber(1);
    setStatus('loading');
    setErrorDetails('');
  }, [catalogue.pdfUrl]);

  const goToPrevPage = () => setPageNumber(p => Math.max(p - 1, 1));
  const goToNextPage = () => numPages && setPageNumber(p => Math.min(p + 1, numPages));

  return (
    <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900/90 to-slate-800/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="text-white/90 font-medium">
            <span dangerouslySetInnerHTML={{ __html: cleanHtml(catalogue.title) }} /> - <span dangerouslySetInnerHTML={{ __html: cleanHtml(catalogue.description) }} />
          </div>
        </div>
        {status === 'success' && (
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
              <span className="text-white/90 font-medium">
                Page {pageNumber} / {numPages}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* PDF + states */}
      <div className="relative min-h-[60vh] bg-gradient-to-br from-gray-900/50 to-green-900/30 flex flex-col items-center justify-center">
        {status === 'error' ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
              <span className="text-white text-3xl font-bold">!</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{catalogue.error?.title || 'Erreur'}</h3>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-lg text-left mb-6 border border-red-300/20">
              <h4 className="font-bold mb-2 text-red-300">{catalogue.error?.details}</h4>
              <p className="text-sm text-red-200 mb-4 font-mono bg-red-900/30 p-2 rounded-lg">{errorDetails}</p>
              <h4 className="font-bold mb-2 text-white/90">Solutions :</h4>
              <ol className="list-decimal pl-6 space-y-1 text-white/80 text-sm">
                {(catalogue.error?.solutions || []).map((solution: string, idx: number) => (
                  <li key={idx}>{solution}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={catalogue.pdfUrl} download className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl px-6 py-3 text-base rounded-xl flex items-center">
                Télécharger
              </a>
              <button onClick={() => setStatus('loading')} className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 py-3 text-base rounded-xl">
                Réessayer
              </button>
            </div>
          </div>
        ) : status === 'loading' ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
              <span className="text-white text-2xl font-bold">PDF</span>
            </div>
            <p className="text-xl font-semibold text-white mb-2">{catalogue.loading?.title || 'Chargement...'}</p>
            <p className="text-white/70">{catalogue.loading?.subtitle || ''}</p>
            <div className="mt-6 w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <div className="relative w-full flex flex-col items-center justify-center">
            {/* Navigation pages */}
            {numPages && numPages > 1 && (
              <>
                <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:shadow-xl disabled:opacity-40">
                  {'<'}
                </button>
                <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:shadow-xl disabled:opacity-40">
                  {'>'}
                </button>
              </>
            )}
            <div ref={containerRef} className="flex items-center justify-center w-full py-6">
              <Document
                {...getPdfJsConfig(pdfUrl)}
                loading={
                  <div className="text-white/60 text-lg text-center">
                    {isPdfLoading ? "Optimisation anti-IDM..." : "Préparation du catalogue..."}
                    {detectDownloadManager() && (
                      <div className="text-sm text-blue-300 mt-2">Mode compatibilité gestionnaire de téléchargement</div>
                    )}
                  </div>
                }
                error={
                  <div className="text-center p-8">
                    <div className="text-red-400 text-lg mb-4">Erreur d'affichage du PDF</div>
                    {pdfError && <div className="text-red-300 text-sm mb-4">{pdfError}</div>}
                    {detectDownloadManager() && (
                      <div className="bg-blue-900/50 border border-blue-500/50 rounded-lg p-4 mb-4">
                        <div className="text-blue-300 text-sm">
                          <strong>Gestionnaire de téléchargement détecté</strong><br/>
                          IDM ou un autre gestionnaire interfère avec l'affichage.
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={reload}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Réessayer
                    </button>
                    <a 
                      href={catalogue.pdfUrl} 
                      download 
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Télécharger
                    </a>
                  </div>
                }
                onLoadSuccess={({ numPages }) => { setNumPages(numPages); setStatus('success'); }}
                onLoadError={error => { setStatus('error'); setErrorDetails('Impossible de charger le document PDF'); }}
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerRef.current?.offsetWidth ? Math.min(containerRef.current.offsetWidth, 900) : 700}
                  className="shadow-xl rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
            {/* Boutons download/contact */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              <a href={catalogue.pdfUrl} download className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl px-8 py-4 text-lg rounded-xl flex items-center">
                Télécharger le catalogue
              </a>
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-xl flex items-center text-white">
                Nous contacter
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fonction utilitaire pour nettoyer le HTML (supprime <font> et attributs color)
function cleanHtml(html: string): string {
  if (!html) return '';
  // Supprime toutes les balises <font ...>
  html = html.replace(/<font[^>]*>/gi, '');
  html = html.replace(/<\/font>/gi, '');
  // Supprime tous les attributs color="..." ou size="..."
  html = html.replace(/ (color|size)=["'][^"']*["']/gi, '');
  // Supprime tous les styles font-size: ... ou color: ... dans les attributs style
  html = html.replace(/font-size:\s?[^;"']+;?/gi, '');
  html = html.replace(/color:\s?[^;"']+;?/gi, '');
  // Supprime les balises <span style="..."> qui ne contiennent plus rien d'utile
  html = html.replace(/<span style=["'][^"']*["']>/gi, '<span>');
  // Supprime les styles vides
  html = html.replace(/style=["']\s*["']/gi, '');
  return html;
}

