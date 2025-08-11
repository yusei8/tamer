import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Clock,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { uploadImage } from '../../lib/uploadUtils';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  duration?: string;
  price?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ServicesSection: React.FC = () => {
  const { dataJson, updateField, addItem, removeItem } = useDashboardStore();
  const services = dataJson.services?.items || [];
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Toast pour drag & drop
  React.useEffect(() => {
    toast.success(
      (t) => (
        <div className="flex items-center justify-between">
          <span>🎯 Fonctionnalité drag & drop activée ! Vous pouvez changer l'ordre des services en sélectionnant une carte puis en la déplaçant vers une autre position.</span>
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

  const handleImageEdit = (idx: number) => {
    fileInputRefs.current[idx]?.click();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(services);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    updateField('data', 'services.items', reordered);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Titre et description principaux, éditables inline avec cadre */}
      <div className="mb-8">
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 mb-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
          <Input
            className="text-3xl md:text-4xl font-extrabold text-blue-800 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent shadow-none outline-none transition-all duration-150"
            style={{ boxShadow: 'none', outline: 'none' }}
            value={dataJson.services?.title || ''}
            onChange={e => updateField('data', 'services.title', e.target.value)}
            placeholder="Titre de la section services"
          />
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50/40 px-4 py-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
          <Textarea
            className="text-lg md:text-xl font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
            style={{ minHeight: 0, boxShadow: 'none', outline: 'none' }}
            value={dataJson.services?.description || ''}
            onChange={e => updateField('data', 'services.description', e.target.value)}
            placeholder="Description de la section services"
            rows={2}
          />
        </div>
      </div>
      {/* Drag & drop des cartes services */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="services-droppable" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {services.map((service, idx) => (
                <Draggable key={idx} draggableId={String(idx)} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative w-full md:w-80 bg-white rounded-xl shadow border border-slate-100 p-4 flex flex-col gap-3 transition-all duration-200 ${snapshot.isDragging ? 'ring-4 ring-emerald-400 scale-105' : ''}`}
                    >
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={service.image || 'https://via.placeholder.com/400x225?text=Image+service'}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => handleImageEdit(idx)}
                        >
                          Modifier image
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={el => (fileInputRefs.current[idx] = el)}
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            toast.loading('Upload en cours...', { id: 'upload' });
                            
                            const result = await uploadImage(file);
                            
                            if (result.success && result.filename) {
                              const newServices = services.map((s, i) => i === idx ? { ...s, image: `/rachef-uploads/${result.filename}` } : s);
                              updateField('data', 'services.items', newServices);
                              toast.success('Image uploadée avec succès !', { id: 'upload' });
                              toast('N\'oublie pas de cliquer sur "Sauvegarder" pour enregistrer l\'image !', { icon: '💾', position: 'top-center' });
                            } else {
                              toast.error(`Erreur upload: ${result.error}`, { id: 'upload' });
                            }
                            
                            // Reset input value to allow re-uploading the same file if needed
                            if (fileInputRefs.current[idx]) fileInputRefs.current[idx]!.value = '';
                          }}
                        />
                      </div>
                      {/* Titre éditable avec cadre */}
                      <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
                        <Input
                          className="text-lg font-bold text-blue-800 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent shadow-none outline-none transition-all duration-150"
                          style={{ boxShadow: 'none', outline: 'none' }}
                          value={service.title || ''}
                          onChange={e => {
                            const newServices = [...services];
                            newServices[idx] = { ...newServices[idx], title: e.target.value };
                            updateField('data', 'services.items', newServices);
                          }}
                          placeholder="Titre du service"
                        />
                      </div>
                      {/* Description éditable avec cadre */}
                      <div className="rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
                        <Textarea
                          className="text-base font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
                          style={{ minHeight: 0, boxShadow: 'none', outline: 'none' }}
                          value={service.description || ''}
                          onChange={e => {
                            const newServices = [...services];
                            newServices[idx] = { ...newServices[idx], description: e.target.value };
                            updateField('data', 'services.items', newServices);
                          }}
                          placeholder="Description du service"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => {
                          const newServices = services.filter((_, i) => i !== idx);
                          updateField('data', 'services.items', newServices);
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {/* Ajout d'un service */}
              <Card className="flex flex-col items-center justify-center border-dashed border-2 border-emerald-300 bg-emerald-50/30 hover:bg-emerald-100/50 transition-all cursor-pointer min-h-[250px]" onClick={() => {
                const newServices = [...services, { title: '', description: '', image: '' }];
                updateField('data', 'services.items', newServices);
              }}>
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <Plus className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-emerald-700 font-semibold">Ajouter un service</span>
                </div>
              </Card>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

