import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/uploadUtils';

export const FacilitiesSection: React.FC = () => {
  const { dataJson, updateField, addItem, removeItem } = useDashboardStore();
  const facilities = dataJson.facilities?.items || [];
  const fileInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Toast pour drag & drop
  React.useEffect(() => {
    toast.success(
      (t) => (
        <div className="flex items-center justify-between">
          <span>🎯 Fonctionnalité drag & drop activée ! Vous pouvez changer l'ordre des ateliers en sélectionnant une carte puis en la déplaçant vers une autre position.</span>
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(facilities);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    // Réattribuer les id en fonction du nouvel ordre
    const renumbered = reordered.map((f, i) => (typeof f === 'object' && f !== null ? { ...f, id: i + 1 } : { id: i + 1 }));
    updateField('data', 'facilities.items', renumbered);
  };

  const handleImageEdit = (idx: number) => {
    fileInputRefs.current[idx]?.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Titre et description principaux, éditables inline avec cadre */}
      <div className="mb-8">
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 mb-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
          <Input
            className="text-3xl md:text-4xl font-extrabold text-blue-800 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent shadow-none outline-none transition-all duration-150"
            style={{ boxShadow: 'none', outline: 'none' }}
            value={dataJson.facilities?.title || ''}
            onChange={e => updateField('data', 'facilities.title', e.target.value)}
            placeholder="Titre de la section ateliers"
          />
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50/40 px-4 py-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
          <Textarea
            className="text-lg md:text-xl font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
            style={{ minHeight: 0, boxShadow: 'none', outline: 'none' }}
            value={dataJson.facilities?.description || ''}
            onChange={e => updateField('data', 'facilities.description', e.target.value)}
            placeholder="Description de la section ateliers"
            rows={2}
          />
        </div>
      </div>
      {/* Drag & drop des cartes ateliers */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="facilities-droppable" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {facilities.map((facility, idx) => (
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
                          src={facility.image || 'https://via.placeholder.com/400x225?text=Image+atelier'}
                          alt={facility.title}
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
                            
                            toast.loading('Upload en cours...', { id: 'facility-upload' });
                            
                            const result = await uploadImage(file);
                            
                            if (result.success && result.filename) {
                              const newFacilities = facilities.map((f, i) => i === idx ? { ...f, image: `/rachef-uploads/${result.filename}` } : f);
                              updateField('data', 'facilities.items', newFacilities);
                              toast.success('Image uploadée avec succès !', { id: 'facility-upload' });
                              toast('N\'oublie pas de cliquer sur "Sauvegarder" pour enregistrer l\'image !', { icon: '💾', position: 'top-center' });
                            } else {
                              toast.error(`Erreur upload: ${result.error}`, { id: 'facility-upload' });
                            }
                            
                            if (fileInputRefs.current[idx]) fileInputRefs.current[idx]!.value = '';
                          }}
                        />
                      </div>
                      {/* Titre éditable avec cadre */}
                      <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
                        <Input
                          className="text-lg font-bold text-blue-800 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent shadow-none outline-none transition-all duration-150"
                          style={{ boxShadow: 'none', outline: 'none' }}
                          value={facility.title || ''}
                          onChange={e => {
                            const newFacilities = facilities.map((f, i) => i === idx ? { ...f, title: e.target.value } : f);
                            updateField('data', 'facilities.items', newFacilities);
                          }}
                          placeholder="Titre de l'atelier"
                        />
                      </div>
                      {/* Description éditable avec cadre */}
                      <div className="rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-2 transition-all duration-150 focus-within:border-blue-500 hover:border-blue-400">
                        <Textarea
                          className="text-base font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
                          style={{ minHeight: 0, boxShadow: 'none', outline: 'none' }}
                          value={facility.description || ''}
                          onChange={e => {
                            const newFacilities = facilities.map((f, i) => i === idx ? { ...f, description: e.target.value } : f);
                            updateField('data', 'facilities.items', newFacilities);
                          }}
                          placeholder="Description de l'atelier"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => {
                          const newFacilities = facilities.filter((_, i) => i !== idx);
                          updateField('data', 'facilities.items', newFacilities);
                        }}>
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {/* Ajout d'un atelier */}
              <div className="flex flex-col items-center justify-center border-dashed border-2 border-emerald-300 bg-emerald-50/30 hover:bg-emerald-100/50 transition-all cursor-pointer min-h-[250px] rounded-xl" onClick={() => {
                const newFacilities = [...facilities, { id: facilities.length + 1, title: '', description: '', image: '' }];
                updateField('data', 'facilities.items', newFacilities);
              }}>
                <span className="text-emerald-700 font-semibold">Ajouter un atelier</span>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

