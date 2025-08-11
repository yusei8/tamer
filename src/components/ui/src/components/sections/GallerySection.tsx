import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Plus, 
  Upload, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Search,
  Grid,
  List,
  Filter,
  Copy,
  ExternalLink
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
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface GalleryImage {
  id?: string;
  name?: string;
  src?: string; // Ajouté pour compatibilité JSON
  url?: string;
  alt: string;
  caption?: string; // Ajouté pour compatibilité JSON
  description?: string;
  category?: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt?: string;
  updatedAt?: string;
}

export const GallerySection: React.FC = () => {
  const { dataJson, updateField, addItem, removeItem } = useDashboardStore();
  const gallery = dataJson.gallery || { title: '', description: '', images: [] };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast pour drag & drop
  React.useEffect(() => {
    toast.success(
      (t) => (
        <div className="flex items-center justify-between">
          <span>🎯 Fonctionnalité drag & drop activée ! Vous pouvez changer l'ordre des images en sélectionnant une image puis en la déplaçant vers une autre position.</span>
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
  
  const [newImage, setNewImage] = useState<Partial<GalleryImage>>({
    name: '',
    alt: '',
    description: '',
    category: 'general'
  });

  // Images simulées pour la démo
  const images: GalleryImage[] = gallery.images || [];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'ateliers', label: 'Ateliers' },
    { value: 'formations', label: 'Formations' },
    { value: 'evenements', label: 'Événements' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'equipements', label: 'Équipements' },
    { value: 'general', label: 'Général' }
  ];

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image valide`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} est trop volumineux (max 10MB)`);
        return;
      }

      // Créer une URL locale pour l'image (simulation)
      const imageUrl = URL.createObjectURL(file);
      
      // Créer l'objet image
      const newImageObj: GalleryImage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: imageUrl,
        alt: newImage.alt || file.name.replace(/\.[^/.]+$/, ''),
        description: newImage.description || '',
        category: newImage.category || 'general',
        size: file.size,
        dimensions: { width: 0, height: 0 }, // À déterminer après chargement
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Ajouter l'image à la galerie
      // Dans une vraie application, on ajouterait au JSON
      toast.success(`Image ${file.name} uploadée avec succès`);
    });

    // Reset form
    setNewImage({
      name: '',
      alt: '',
      description: '',
      category: 'general'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setNewImage({
      name: image.name,
      alt: image.alt,
      description: image.description,
      category: image.category
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateImage = () => {
    if (!editingImage) return;

    const updatedImage: GalleryImage = {
      ...editingImage,
      name: newImage.name || editingImage.name,
      alt: newImage.alt || editingImage.alt,
      description: newImage.description || editingImage.description,
      category: newImage.category || editingImage.category,
      updatedAt: new Date().toISOString()
    };

    // Dans une vraie application, on mettrait à jour le JSON
    toast.success('Image mise à jour avec succès');
    setIsAddDialogOpen(false);
    setEditingImage(null);
    setNewImage({
      name: '',
      alt: '',
      description: '',
      category: 'general'
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiée dans le presse-papiers');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    updateField('data', 'gallery.images', reordered);
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Pour le titre (Input) et la description (Textarea), ajoute un wrapper div avec un style de cadre : */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 focus-within:border-blue-500 transition-colors p-3 mb-4">
          <Input
            className="text-4xl md:text-5xl font-extrabold text-blue-800 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent mb-2 shadow-none outline-none transition-all duration-150"
            style={{ boxShadow: 'none', outline: 'none' }}
            value={gallery.title || ''}
            onChange={e => updateField('data', 'gallery.title', e.target.value)}
            placeholder="Titre de la galerie"
          />
          <Textarea
            className="text-lg md:text-2xl font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
            style={{ minHeight: 0, boxShadow: 'none', outline: 'none' }}
            value={gallery.description || ''}
            onChange={e => updateField('data', 'gallery.description', e.target.value)}
            placeholder="Description de la galerie"
            rows={2}
          />
        </div>
      </motion.div>
        
      {/* Input caché pour upload rapide */}
      <input
        key={images.length} // force le reset à chaque ajout
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            addItem('data', 'gallery.images', { src: url, caption: file.name, alt: file.name, description: '' });
          }
        }}
      />

      {/* Galerie d'images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-end mb-4">
          <Button onClick={() => fileInputRef.current?.click()}>Ajouter une image</Button>
        </div>
        {images.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery-droppable" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((img, idx) => (
                    <Draggable key={img.id || idx} draggableId={img.id?.toString() || idx.toString()} index={idx}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`overflow-hidden group relative transition-shadow duration-200 ${snapshot.isDragging ? 'ring-4 ring-emerald-400 shadow-2xl scale-105' : ''}`}
                        >
                          <img src={img.src || img.url} alt={img.alt} className="w-full h-48 object-cover" />
                          <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <Button size="icon" variant="secondary" onClick={() => removeItem('data', 'gallery.images', idx)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 focus-within:border-blue-500 transition-colors p-2 mb-2">
                              <Textarea
                                className="text-lg font-medium text-slate-700 border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent resize-none shadow-none outline-none transition-all duration-150"
                                value={img.caption || img.description || ''}
                                onChange={e => {
                                  const newImages = [...images];
                                  newImages[idx] = { ...newImages[idx], caption: e.target.value };
                                  updateField('data', 'gallery.images', newImages);
                                }}
                                placeholder="Ajouter une description à cette image..."
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Aucune image dans la galerie</h3>
              <Button onClick={() => fileInputRef.current?.click()}>Ajouter une image</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

