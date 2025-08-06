import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  MapPin,
  Clock,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location?: string;
  image: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  showOnHome?: boolean; // Added showOnHome to the interface
}

export const EventsSection: React.FC = () => {
  const { datapJson, updateField, addItem, removeItem } = useDashboardStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    featured: false
  });

  // Toast pour drag & drop
  React.useEffect(() => {
    toast.success(
      (t) => (
        <div className="flex items-center justify-between">
          <span>🎯 Fonctionnalité drag & drop activée ! Vous pouvez changer l'ordre des événements en sélectionnant une carte puis en la déplaçant vers une autre position.</span>
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

  // Récupérer les événements existants du JSON
  const events: Event[] = datapJson?.evenements?.events || [];

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      toast.error('Veuillez remplir tous les champs obligatoires', { position: 'top-right' });
      return;
    }

    const event: Event = {
      id: Date.now(),
      title: newEvent.title!,
      description: newEvent.description!,
      date: newEvent.date!,
      location: newEvent.location || '',
      image: newEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      featured: newEvent.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ajouter l'événement au JSON (datapJson)
    addItem('datap', 'evenements.events', event);
    
    toast.success('Événement ajouté avec succès', { position: 'top-right' });
    setIsAddDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
      image: '',
      featured: false
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setIsAddDialogOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !newEvent.title || !newEvent.description || !newEvent.date) {
      toast.error('Veuillez remplir tous les champs obligatoires', { position: 'top-right' });
      return;
    }

    const updatedEvent: Event = {
      ...editingEvent,
      title: newEvent.title!,
      description: newEvent.description!,
      date: newEvent.date!,
      location: newEvent.location || '',
      image: newEvent.image || editingEvent.image,
      featured: newEvent.featured || false,
      updatedAt: new Date().toISOString()
    };

    // Mettre à jour l'événement dans le JSON (datapJson)
    const eventIndex = events.findIndex(e => e.id === editingEvent.id);
    if (eventIndex !== -1) {
      updateField('datap', `evenements.events.${eventIndex}`, updatedEvent);
    }
    
    toast.success('Événement mis à jour avec succès', { position: 'top-right' });
    setIsAddDialogOpen(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
      image: '',
      featured: false
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      removeItem('data', 'events.items', eventIndex);
      toast.success('Événement supprimé avec succès', { position: 'top-right' });
    }
  };

  const handleToggleFeatured = (eventId: number) => {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const currentEvent = events[eventIndex];
      updateField('data', `events.items.${eventIndex}.featured`, !currentEvent.featured);
      toast.success(`Événement ${!currentEvent.featured ? 'mis en avant' : 'retiré de la mise en avant'}`, { position: 'top-right' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file, file.name);
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/upload`;
    const res = await fetch(apiUrl, { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      const url = `/rachef-uploads/${data.filename}`;
      setNewEvent(prev => ({ ...prev, image: url }));
      toast.success('Image événement uploadée', { position: 'top-right' });
    } else {
      toast.error("Erreur lors de l'upload de l'image", { position: 'top-right' });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Ajoutons la gestion du calendrier des événements dans le dashboard
  const calendar = datapJson?.evenements?.calendar || [];
  const [calendarItems, setCalendarItems] = useState(calendar);
  const [newCalendarItem, setNewCalendarItem] = useState({ title: '', description: '', date: '' });

  const handleAddCalendarItem = () => {
    if (!newCalendarItem.title || !newCalendarItem.date) {
      toast.error('Titre et date requis', { position: 'top-right' });
      return;
    }
    const updated = [...calendarItems, { ...newCalendarItem }];
    setCalendarItems(updated);
    updateField('data', 'evenements.calendar', updated);
    setNewCalendarItem({ title: '', description: '', date: '' });
    toast.success('Événement ajouté au calendrier', { position: 'top-right' });
  };

  const handleRemoveCalendarItem = (idx: number) => {
    const updated = calendarItems.filter((_, i) => i !== idx);
    setCalendarItems(updated);
    updateField('data', 'evenements.calendar', updated);
    toast.success('Événement supprimé du calendrier', { position: 'top-right' });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(events);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    updateField('datap', 'evenements.events', reordered);
  };

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Mis en avant</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {events.filter(e => e.featured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Ce mois</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => {
                    const eventDate = new Date(e.date);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section gestion des événements (titre, bouton, Dialog, liste) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl shadow p-6 border border-slate-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              Événements
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Gérez les événements et actualités de l'ACTL
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingEvent(null);
              setNewEvent({
                title: '',
                description: '',
                date: '',
                location: '',
                image: '',
                featured: false
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Ajouter un événement</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Modifier l\'événement' : 'Ajouter un nouvel événement'}
                </DialogTitle>
                <DialogDescription>
                  {editingEvent ? 'Modifiez les informations de l\'événement' : 'Créez un nouvel événement pour votre site'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre de l'événement *</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Skills Olympics 2025"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Description détaillée de l'événement..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date de l'événement *</Label>
                    <Input
                      id="date"
                      value={newEvent.date || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      placeholder="Avril 2025"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Lieu (optionnel)</Label>
                    <Input
                      id="location"
                      value={newEvent.location || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Centre ACTL, El Mohammedia"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image">Image de l'événement</Label>
                  <div className="mt-1 space-y-2">
                    <Input
                      id="image"
                      value={newEvent.image || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                      placeholder="URL de l'image ou chemin local"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader une image
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Prévisualisation de l'image */}
                {newEvent.image && (
                  <div>
                    <Label>Prévisualisation</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={newEvent.image}
                        alt="Aperçu de l'événement"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <Label htmlFor="featured" className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={!!newEvent.featured}
                      onCheckedChange={checked => setNewEvent(e => ({ ...e, featured: checked }))}
                    />
                    Mettre en avant sur l'accueil
                  </Label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                    {editingEvent ? 'Mettre à jour' : 'Créer l\'événement'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
          {/* 1. Contenu de la page Événements & Actualités (sans CTA) */}
      <Card className="mb-8 bg-white/80 shadow border border-slate-100">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            Contenu de la page Événements & Actualités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Titre principal</label>
              <Input
                value={datapJson.evenements?.title || ''}
                onChange={e => updateField('datap', 'evenements.title', e.target.value)}
                className="mb-4"
              />
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={datapJson.evenements?.description || ''}
                onChange={e => updateField('datap', 'evenements.description', e.target.value)}
                className="mb-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <Eye className="w-6 h-6 text-blue-400" />
          Tous les événements
        </h2>
        {/* Liste des événements avec drag & drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="events-droppable" direction="vertical">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {(datapJson.evenements?.events || []).map((event, idx) => (
                  <Draggable key={event.id || idx} draggableId={String(event.id || idx)} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-shadow ${snapshot.isDragging ? 'ring-4 ring-blue-400 shadow-2xl scale-105' : ''}`}
                      >
                        <Card className="hover:shadow-2xl transition-shadow border border-slate-200 bg-gradient-to-br from-white to-blue-50/40">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="flex items-center space-x-3 text-lg text-blue-900">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                  <Input
                                    value={event.title}
                                    onChange={e => updateField('datap', `evenements.events.${idx}.title`, e.target.value)}
                                    className="font-bold text-lg mb-1"
                                  />
                                  {event.featured && (
                                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1 animate-pulse">
                                      <Star className="w-3 h-3" />
                                      <span>Mis en avant</span>
                                    </Badge>
                                  )}
                                </CardTitle>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 ml-2"
                              onClick={() => removeItem('datap', 'evenements.events', idx)}
                              title="Supprimer l'événement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <label className="block text-xs font-medium text-slate-700">Description</label>
                            <Textarea
                              value={event.description}
                              onChange={e => updateField('datap', `evenements.events.${idx}.description`, e.target.value)}
                              className="mb-2"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-slate-700">Date</label>
                                <Input
                                  value={event.date}
                                  onChange={e => updateField('datap', `evenements.events.${idx}.date`, e.target.value)}
                                  className="mb-2"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-700">Lieu</label>
                                <Input
                                  value={event.location}
                                  onChange={e => updateField('datap', `evenements.events.${idx}.location`, e.target.value)}
                                  className="mb-2"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700">Image (URL)</label>
                              <Input
                                value={event.image}
                                onChange={e => updateField('datap', `evenements.events.${idx}.image`, e.target.value)}
                              />
                            </div>
                            {event.image && (
                              <div className="my-2">
                                <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded" />
                              </div>
                            )}
                            <label className="flex flex-col items-center mt-2 mb-2 w-full cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append('file', file, file.name);
                                  const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/upload`;
                                  const res = await fetch(apiUrl, { method: 'POST', body: formData });
                                  if (res.ok) {
                                    const data = await res.json();
                                    const url = `/rachef-uploads/${data.filename}`;
                                    updateField('datap', `evenements.events.${idx}.image`, url);
                                    toast.success('Image événement mise à jour', { position: 'top-right' });
                                  } else {
                                    toast.error("Erreur lors de l'upload de l'image", { position: 'top-right' });
                                  }
                                }}
                              />
                              <span className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors text-sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Parcourir
                              </span>
                            </label>
                            <div className="flex items-center gap-4 mt-2">
                              <Switch
                                checked={!!event.featured}
                                onCheckedChange={checked => updateField('datap', `evenements.events.${idx}.featured`, checked)}
                              />
                              <span className="text-xs text-yellow-700 font-semibold">Mettre en avant</span>
                              <Switch
                                checked={!!event.showOnHome}
                                onCheckedChange={checked => updateField('datap', `evenements.events.${idx}.showOnHome`, checked)}
                              />
                              <span className="text-xs text-blue-700 font-semibold">Afficher sur l'accueil</span>
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
      </motion.div>

    
      {/* 3. Calendrier des événements */}
      <Card className="mb-8 bg-white/80 shadow border border-slate-100">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <Clock className="w-6 h-6 text-green-400" />
            Calendrier des événements
          </h2>
          <p className="text-slate-600 mb-6">Consultez notre calendrier pour connaître les dates des prochains événements et formations.</p>
          {/* Formulaire d'ajout */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Titre</label>
              <Input
                value={newCalendarItem.title}
                onChange={e => setNewCalendarItem({ ...newCalendarItem, title: e.target.value })}
                placeholder="Titre de l'événement"
                className="mb-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Description</label>
              <Input
                value={newCalendarItem.description}
                onChange={e => setNewCalendarItem({ ...newCalendarItem, description: e.target.value })}
                placeholder="Description (optionnelle)"
                className="mb-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Date</label>
              <Input
                value={newCalendarItem.date}
                onChange={e => setNewCalendarItem({ ...newCalendarItem, date: e.target.value })}
                placeholder="Date (ex: 2024-09-01)"
                className="mb-2"
              />
            </div>
            <Button onClick={handleAddCalendarItem} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2">Ajouter</Button>
          </div>
          <div className="space-y-4 mb-8">
            {(datapJson.evenements?.calendar || []).map((item, idx) => (
              <Card key={idx} className="p-4 flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div>
                    <label className="block text-xs font-medium">Titre</label>
                    <Input
                      value={item.title}
                      onChange={e => updateField('datap', `evenements.calendar.${idx}.title`, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Description</label>
                    <Input
                      value={item.description}
                      onChange={e => updateField('datap', `evenements.calendar.${idx}.description`, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Date</label>
                    <Input
                      value={item.date}
                      onChange={e => updateField('datap', `evenements.calendar.${idx}.date`, e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 ml-4"
                  onClick={() => handleRemoveCalendarItem(idx)}
                  title="Supprimer l'item du calendrier"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Bloc CTA (à la fin) */}
      <Card className="mb-8 bg-white/80 shadow border border-slate-100">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            {`Vous souhaitez participer ?`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Badge className="bg-blue-100 text-blue-700">CTA</Badge> Titre du CTA</label>
              <Input
                value={datapJson.evenements?.cta?.title || ''}
                onChange={e => updateField('datap', 'evenements.cta.title', e.target.value)}
                className="mb-4"
              />
              <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Badge className="bg-blue-100 text-blue-700">CTA</Badge> Description du CTA</label>
              <Textarea
                value={datapJson.evenements?.cta?.description || ''}
                onChange={e => updateField('datap', 'evenements.cta.description', e.target.value)}
                className="mb-4"
              />
              <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Badge className="bg-blue-100 text-blue-700">CTA</Badge> Texte du bouton CTA</label>
              <Input
                value={datapJson.evenements?.cta?.buttonText || ''}
                onChange={e => updateField('datap', 'evenements.cta.buttonText', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};