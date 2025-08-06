import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, X, Upload, Move, RotateCcw, Copy, Trash2, 
  Eye, EyeOff, Save, Edit3, MousePointer, Hand,
  Type, Image, Video, Square, Circle, Triangle,
  Palette, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Grid, Layers, Settings,
  Smartphone, Tablet, Monitor, Download, Upload as UploadIcon,
  Undo, Redo, ZoomIn, ZoomOut, Play, Pause
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import toast from 'react-hot-toast';

interface Element {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'shape' | 'container' | 'navbar' | 'footer' | 'hero' | 'section';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  styles: {
    backgroundColor: string;
    backgroundImage: string;
    color: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    textAlign: string;
    borderRadius: number;
    border: string;
    boxShadow: string;
    padding: number;
    margin: number;
    opacity: number;
    transform: string;
  };
  animations: {
    type: string;
    duration: number;
    delay: number;
    repeat: boolean;
  };
  responsive: {
    mobile: { styles?: Partial<Element['styles']> };
    tablet: { styles?: Partial<Element['styles']> };
  };
  visible: boolean;
}

interface Template {
  id: string;
  name: string;
  preview: string;
  elements: Element[];
}

interface AdvancedVisualEditorProps {
  formationKey: string;
  formationData: any;
  updateField: (section: string, field: string, value: any) => void;
}

const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'hero-centered',
    name: 'Hero Centré',
    preview: '/api/placeholder/300/200',
    elements: [
      {
        id: 'hero-bg',
        type: 'container',
        content: '',
        x: 0,
        y: 0,
        width: 800,
        height: 400,
        rotation: 0,
        zIndex: 0,
        styles: {
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundImage: '',
          color: '#ffffff',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          padding: 60,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'none', duration: 1, delay: 0, repeat: false },
        responsive: { mobile: {}, tablet: {} },
        visible: true
      },
      {
        id: 'hero-title',
        type: 'text',
        content: 'Votre Titre Principal',
        x: 100,
        y: 120,
        width: 600,
        height: 80,
        rotation: 0,
        zIndex: 1,
        styles: {
          backgroundColor: 'transparent',
          backgroundImage: '',
          color: '#ffffff',
          fontSize: 48,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'fadeInUp', duration: 1, delay: 0.5, repeat: false },
                 responsive: { mobile: { styles: { fontSize: 32 } }, tablet: { styles: { fontSize: 40 } } },
        visible: true
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        content: 'Votre sous-titre explicatif',
        x: 150,
        y: 220,
        width: 500,
        height: 40,
        rotation: 0,
        zIndex: 1,
        styles: {
          backgroundColor: 'transparent',
          backgroundImage: '',
          color: '#ffffff',
          fontSize: 18,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          opacity: 0.9,
          transform: ''
        },
                 animations: { type: 'fadeInUp', duration: 1, delay: 1, repeat: false },
         responsive: { mobile: { styles: { fontSize: 16 } }, tablet: { styles: { fontSize: 17 } } },
        visible: true
      },
      {
        id: 'hero-cta',
        type: 'button',
        content: 'Commencer',
        x: 325,
        y: 290,
        width: 150,
        height: 50,
        rotation: 0,
        zIndex: 1,
        styles: {
          backgroundColor: '#ff6b6b',
          backgroundImage: '',
          color: '#ffffff',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 25,
          border: 'none',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
          padding: 15,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'pulse', duration: 2, delay: 1.5, repeat: true },
        responsive: { mobile: {}, tablet: {} },
        visible: true
      }
    ]
  },
  {
    id: 'card-layout',
    name: 'Layout Cartes',
    preview: '/api/placeholder/300/200',
    elements: [
      {
        id: 'section-bg',
        type: 'container',
        content: '',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        rotation: 0,
        zIndex: 0,
        styles: {
          backgroundColor: '#f8f9fa',
          backgroundImage: '',
          color: '#333333',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          padding: 40,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'none', duration: 1, delay: 0, repeat: false },
        responsive: { mobile: {}, tablet: {} },
        visible: true
      },
      {
        id: 'card-1',
        type: 'container',
        content: '',
        x: 50,
        y: 100,
        width: 200,
        height: 250,
        rotation: 0,
        zIndex: 1,
        styles: {
          backgroundColor: '#ffffff',
          backgroundImage: '',
          color: '#333333',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
          borderRadius: 10,
          border: '1px solid #e1e5e9',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: 20,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'fadeInLeft', duration: 1, delay: 0.2, repeat: false },
        responsive: { mobile: {}, tablet: {} },
        visible: true
      },
      {
        id: 'card-2',
        type: 'container',
        content: '',
        x: 300,
        y: 100,
        width: 200,
        height: 250,
        rotation: 0,
        zIndex: 1,
        styles: {
          backgroundColor: '#ffffff',
          backgroundImage: '',
          color: '#333333',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
          borderRadius: 10,
          border: '1px solid #e1e5e9',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: 20,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'fadeInUp', duration: 1, delay: 0.4, repeat: false },
        responsive: { mobile: {}, tablet: {} },
        visible: true
      },
      {
        id: 'card-3',
        type: 'container',
        content: '',
        x: 550,
        y: 100,
        width: 200,
        height: 250,
        rotation: 0,
        zIndex: 1,
        styles: {
          backgroundColor: '#ffffff',
          backgroundImage: '',
          color: '#333333',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'center',
          borderRadius: 10,
          border: '1px solid #e1e5e9',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: 20,
          margin: 0,
          opacity: 1,
          transform: ''
        },
        animations: { type: 'fadeInRight', duration: 1, delay: 0.6, repeat: false },
        responsive: { mobile: {}, tablet: {} },
        visible: true
      }
    ]
  }
];

const FONT_FAMILIES = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
  'Verdana', 'Tahoma', 'Courier New', 'Impact',
  'Comic Sans MS', 'Trebuchet MS', 'Arial Black'
];

const ANIMATIONS = [
  'none', 'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
  'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
  'zoomIn', 'zoomOut', 'rotateIn', 'bounce', 'pulse', 'shake'
];

export const AdvancedVisualEditor: React.FC<AdvancedVisualEditorProps> = ({
  formationKey,
  formationData,
  updateField
}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'image' | 'shape' | 'container'>('select');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les éléments depuis les données
  useEffect(() => {
    if (formationData.advancedVisualEditor?.elements) {
      setElements(formationData.advancedVisualEditor.elements);
    }
  }, [formationData]);

  // Sauvegarder les éléments
  const saveElements = useCallback(() => {
    updateField('datap', `${formationKey}.advancedVisualEditor.elements`, elements);
    toast.success('Page sauvegardée !', { position: 'top-right' });
  }, [elements, formationKey, updateField]);

  // Système d'historique
  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(elements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Appliquer un template
  const applyTemplate = (template: Template) => {
    setElements(template.elements);
    addToHistory();
    toast.success(`Template "${template.name}" appliqué !`, { position: 'top-right' });
  };

  // Créer un nouvel élément
  const createElement = (type: Element['type'], x: number, y: number) => {
    const newElement: Element = {
      id: `element_${Date.now()}`,
      type,
      content: type === 'text' ? 'Nouveau texte' : type === 'button' ? 'Bouton' : '',
      x,
      y,
      width: type === 'text' ? 200 : type === 'image' ? 300 : type === 'container' ? 400 : 150,
      height: type === 'text' ? 40 : type === 'image' ? 200 : type === 'container' ? 300 : 50,
      rotation: 0,
      zIndex: elements.length,
      styles: {
        backgroundColor: type === 'button' ? '#3b82f6' : type === 'container' ? '#f3f4f6' : 'transparent',
        backgroundImage: '',
        color: type === 'button' ? '#ffffff' : '#000000',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        textAlign: 'left',
        borderRadius: type === 'button' ? 8 : type === 'container' ? 10 : 0,
        border: type === 'container' ? '1px solid #d1d5db' : 'none',
        boxShadow: type === 'container' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        padding: type === 'button' ? 12 : type === 'container' ? 20 : 0,
        margin: 0,
        opacity: 1,
        transform: ''
      },
      animations: {
        type: 'none',
        duration: 1,
        delay: 0,
        repeat: false
      },
      responsive: {
        mobile: {},
        tablet: {}
      },
      visible: true
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    addToHistory();
    toast.success(`${type} ajouté`, { position: 'top-right' });
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  const getDeviceWidth = () => {
    switch (devicePreview) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return 1200;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre d'outils gauche */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-4 space-y-2 overflow-y-auto">
        <div className="text-white font-bold text-xs mb-2">OUTILS</div>
        
        <Button
          variant={tool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTool('select')}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col"
        >
          <MousePointer className="w-5 h-5" />
          <span className="text-xs mt-1">Sélect</span>
        </Button>
        
        <Button
          variant={tool === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTool('text')}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col"
        >
          <Type className="w-5 h-5" />
          <span className="text-xs mt-1">Texte</span>
        </Button>
        
        <Button
          variant={tool === 'image' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTool('image')}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col"
        >
          <Image className="w-5 h-5" />
          <span className="text-xs mt-1">Image</span>
        </Button>
        
        <Button
          variant={tool === 'container' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTool('container')}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col"
        >
          <Square className="w-5 h-5" />
          <span className="text-xs mt-1">Boîte</span>
        </Button>

        <div className="border-t border-gray-700 w-full my-2"></div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col"
        >
          <Grid className="w-5 h-5" />
          <span className="text-xs mt-1">Grille</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={historyIndex <= 0}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col disabled:opacity-50"
        >
          <Undo className="w-5 h-5" />
          <span className="text-xs mt-1">Annuler</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col disabled:opacity-50"
        >
          <Redo className="w-5 h-5" />
          <span className="text-xs mt-1">Refaire</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={saveElements}
          className="w-16 h-16 text-white hover:bg-gray-700 flex-col"
        >
          <Save className="w-5 h-5" />
          <span className="text-xs mt-1">Sauver</span>
        </Button>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Barre d'outils supérieure */}
        <div className="h-16 bg-white border-b flex items-center px-4 space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={devicePreview === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={devicePreview === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={devicePreview === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-l h-8"></div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm w-16 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-l h-8"></div>

          <Button
            variant={isPreviewMode ? 'default' : 'outline'}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreviewMode ? 'Éditer' : 'Aperçu'}
          </Button>
        </div>

        {/* Canvas principal */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-auto bg-gray-200 p-8">
            <div
              ref={canvasRef}
              className="relative bg-white mx-auto shadow-xl transition-all duration-300"
              style={{
                width: `${getDeviceWidth() * (zoom / 100)}px`,
                height: `${1200 * (zoom / 100)}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center'
              }}
              onClick={(e) => {
                if (tool === 'select' || isPreviewMode) return;
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = (e.clientX - rect.left) * (100 / zoom);
                const y = (e.clientY - rect.top) * (100 / zoom);
                createElement(tool, x, y);
                setTool('select');
              }}
            >
              {/* Grille */}
              {showGrid && !isPreviewMode && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Éléments */}
              {elements
                .filter(el => el.visible)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => {
                  const currentStyles = devicePreview === 'mobile' && element.responsive.mobile ? 
                    { ...element.styles, ...element.responsive.mobile } :
                    devicePreview === 'tablet' && element.responsive.tablet ?
                    { ...element.styles, ...element.responsive.tablet } :
                    element.styles;

                  return (
                    <div
                      key={element.id}
                      className={`absolute ${!isPreviewMode ? 'cursor-move' : ''} ${
                        selectedElement === element.id && !isPreviewMode ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        transform: `rotate(${element.rotation}deg) ${currentStyles.transform}`,
                        zIndex: element.zIndex,
                        backgroundColor: currentStyles.backgroundColor,
                        backgroundImage: currentStyles.backgroundImage,
                        color: currentStyles.color,
                        fontSize: currentStyles.fontSize,
                        fontFamily: currentStyles.fontFamily,
                        fontWeight: currentStyles.fontWeight,
                        textAlign: currentStyles.textAlign as any,
                        borderRadius: currentStyles.borderRadius,
                        border: currentStyles.border,
                        boxShadow: currentStyles.boxShadow,
                        padding: currentStyles.padding,
                        margin: currentStyles.margin,
                        opacity: currentStyles.opacity,
                        animation: element.animations.type !== 'none' ? 
                          `${element.animations.type} ${element.animations.duration}s ease-in-out ${element.animations.delay}s ${element.animations.repeat ? 'infinite' : ''}` : 
                          'none'
                      }}
                      onClick={(e) => {
                        if (isPreviewMode) return;
                        e.stopPropagation();
                        setSelectedElement(element.id);
                      }}
                    >
                      {element.type === 'text' && (
                        <div className="w-full h-full flex items-center justify-center">
                          {element.content}
                        </div>
                      )}
                      
                      {element.type === 'image' && element.content && (
                        <img
                          src={element.content}
                          alt="Element"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      )}
                      
                      {element.type === 'button' && (
                        <button className="w-full h-full flex items-center justify-center">
                          {element.content}
                        </button>
                      )}
                      
                      {element.type === 'container' && (
                        <div className="w-full h-full"></div>
                      )}

                      {/* Poignées de redimensionnement */}
                      {selectedElement === element.id && !isPreviewMode && (
                        <>
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize" />
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de droite */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="layers">Calques</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="p-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Templates prédéfinis</h3>
              <div className="grid grid-cols-1 gap-3">
                {PREDEFINED_TEMPLATES.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-12 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <Button
                            size="sm"
                            onClick={() => applyTemplate(template)}
                            className="mt-1 w-full"
                          >
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="p-4">
            {selectedElementData ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Propriétés de l'élément</h3>
                
                {/* Contenu */}
                <div>
                  <Label>Contenu</Label>
                  {selectedElementData.type === 'text' || selectedElementData.type === 'button' ? (
                    <Textarea
                      value={selectedElementData.content}
                      onChange={(e) => {
                        const newElements = elements.map(el => 
                          el.id === selectedElementData.id ? { ...el, content: e.target.value } : el
                        );
                        setElements(newElements);
                      }}
                      rows={3}
                    />
                  ) : selectedElementData.type === 'image' ? (
                    <div>
                      <Input
                        value={selectedElementData.content}
                        onChange={(e) => {
                          const newElements = elements.map(el => 
                            el.id === selectedElementData.id ? { ...el, content: e.target.value } : el
                          );
                          setElements(newElements);
                        }}
                        placeholder="URL de l'image"
                      />
                      <Button
                        className="w-full mt-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Uploader
                      </Button>
                    </div>
                  ) : null}
                </div>

                {/* Position et taille */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>X</Label>
                    <Input
                      type="number"
                      value={selectedElementData.x}
                      onChange={(e) => {
                        const newElements = elements.map(el => 
                          el.id === selectedElementData.id ? { ...el, x: parseInt(e.target.value) || 0 } : el
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Y</Label>
                    <Input
                      type="number"
                      value={selectedElementData.y}
                      onChange={(e) => {
                        const newElements = elements.map(el => 
                          el.id === selectedElementData.id ? { ...el, y: parseInt(e.target.value) || 0 } : el
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Largeur</Label>
                    <Input
                      type="number"
                      value={selectedElementData.width}
                      onChange={(e) => {
                        const newElements = elements.map(el => 
                          el.id === selectedElementData.id ? { ...el, width: parseInt(e.target.value) || 0 } : el
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Hauteur</Label>
                    <Input
                      type="number"
                      value={selectedElementData.height}
                      onChange={(e) => {
                        const newElements = elements.map(el => 
                          el.id === selectedElementData.id ? { ...el, height: parseInt(e.target.value) || 0 } : el
                        );
                        setElements(newElements);
                      }}
                    />
                  </div>
                </div>

                {/* Styles */}
                <div>
                  <Label>Police</Label>
                  <Select
                    value={selectedElementData.styles.fontFamily}
                    onValueChange={(value) => {
                      const newElements = elements.map(el => 
                        el.id === selectedElementData.id ? 
                        { ...el, styles: { ...el.styles, fontFamily: value } } : el
                      );
                      setElements(newElements);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Couleur de fond</Label>
                  <Input
                    type="color"
                    value={selectedElementData.styles.backgroundColor.startsWith('#') ? 
                      selectedElementData.styles.backgroundColor : '#ffffff'}
                    onChange={(e) => {
                      const newElements = elements.map(el => 
                        el.id === selectedElementData.id ? 
                        { ...el, styles: { ...el.styles, backgroundColor: e.target.value } } : el
                      );
                      setElements(newElements);
                    }}
                  />
                </div>

                <div>
                  <Label>Animation</Label>
                  <Select
                    value={selectedElementData.animations.type}
                    onValueChange={(value) => {
                      const newElements = elements.map(el => 
                        el.id === selectedElementData.id ? 
                        { ...el, animations: { ...el.animations, type: value } } : el
                      );
                      setElements(newElements);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANIMATIONS.map(anim => (
                        <SelectItem key={anim} value={anim}>{anim}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Sélectionnez un élément pour voir ses propriétés</p>
            )}
          </TabsContent>

          <TabsContent value="layers" className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Calques</h3>
              {elements
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((element) => (
                  <div
                    key={element.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      selectedElement === element.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <span className="text-sm truncate">
                      {element.type} - {element.content.slice(0, 15)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newElements = elements.map(el => 
                            el.id === element.id ? { ...el, visible: !el.visible } : el
                          );
                          setElements(newElements);
                        }}
                      >
                        {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setElements(elements.filter(el => el.id !== element.id));
                          setSelectedElement(null);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedElement) {
            // Logic d'upload d'image...
          }
        }}
      />
    </div>
  );
}; 