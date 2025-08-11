import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  FileText, 
  Archive,
  Save,
  X,
  AlertTriangle,
  Package,
  FolderOpen,
  ArrowLeft,
  Plus,
  Search,
  Settings,
  Shield,
  RefreshCw,
  CheckCircle,
  Loader2,
  HardDrive,
  Cpu,
  Monitor,
  Server,
  Activity,
  Clock,
  Database
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number | null;
  modified: string;
  extension: string | null;
}

interface ExploreResponse {
  currentPath: string;
  parentPath: string | null;
  items: FileItem[];
  error?: string;
}

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '-';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getFileIcon = (item: FileItem) => {
  if (item.type === 'directory') return <Folder className="w-4 h-4 text-blue-600" />;
  
  const ext = item.extension?.toLowerCase();
  if (!ext) return <File className="w-4 h-4 text-gray-600" />;
  
  const iconMap: Record<string, string> = {
    '.js': 'text-yellow-600',
    '.ts': 'text-blue-600', 
    '.jsx': 'text-cyan-600',
    '.tsx': 'text-cyan-600',
    '.json': 'text-orange-600',
    '.css': 'text-purple-600',
    '.html': 'text-red-600',
    '.md': 'text-gray-800',
    '.txt': 'text-gray-600',
    '.env': 'text-green-600',
    '.cfg': 'text-slate-600',
    '.zip': 'text-yellow-700',
    '.pdf': 'text-red-700'
  };
  
  const colorClass = iconMap[ext] || 'text-gray-600';
  return <FileText className={`w-4 h-4 ${colorClass}`} />;
};

const isEditableFile = (extension: string | null): boolean => {
  if (!extension) return false;
  const editableExts = ['.txt', '.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.html', '.md', '.env', '.cfg', '.config', '.xml', '.yml', '.yaml'];
  return editableExts.includes(extension.toLowerCase());
};

export const FileManagerSection: React.FC = () => {
  const { hasPermission, currentAdmin } = useAuthStore();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [parentPath, setParentPath] = useState<string | null>(null);
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour l'éditeur
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // États pour l'upload
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  
  // États pour les opérations
  const [renamingItem, setRenamingItem] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  
  // États pour la progression du backup
  const [backupProgress, setBackupProgress] = useState<{
    isRunning: boolean;
    progress: number;
    stage: string;
    filename?: string;
    startTime?: number;
    estimatedTimeLeft?: string;
  }>({
    isRunning: false,
    progress: 0,
    stage: ''
  });

  // États pour les informations système
  const [systemInfo, setSystemInfo] = useState<{
    system: {
      hostname: string;
      platform: string;
      arch: string;
      uptime: number;
      nodeVersion: string;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
    cpu: {
      count: number;
      model: string;
      speed: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
    project: {
      size: number;
      path: string;
    };
  } | null>(null);
  const [loadingSystemInfo, setLoadingSystemInfo] = useState(false);

  // Vérifier les permissions
  if (currentAdmin?.role !== 'admin') {
    return (
      <div className="p-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Accès Restreint</h3>
            <p className="text-gray-600 mb-4">
              Seuls les administrateurs peuvent accéder au gestionnaire de fichiers.
            </p>
            <Badge variant="destructive">Permission file_manager requise</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Charger les informations système
  const loadSystemInfo = async () => {
    setLoadingSystemInfo(true);
    try {
      const response = await fetch('/api/filemanager/system-info');
      const data = await response.json();
      
      if (response.ok) {
        setSystemInfo(data);
      } else {
        toast.error('Erreur lors du chargement des informations système');
      }
    } catch (error) {
      toast.error('Erreur réseau système');
    } finally {
      setLoadingSystemInfo(false);
    }
  };

  // Charger les fichiers du répertoire actuel
  const loadDirectory = async (path: string = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/filemanager/explore?path=${encodeURIComponent(path)}`);
      const data: ExploreResponse = await response.json();
      
      if (response.ok) {
        setCurrentPath(data.currentPath);
        setParentPath(data.parentPath);
        setItems(data.items);
      } else {
        toast.error(data.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  // Naviguer vers un dossier
  const navigateToDirectory = (path: string) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('Vous avez des modifications non sauvegardées. Continuer ?')) {
        return;
      }
      setHasUnsavedChanges(false);
    }
    setEditingFile(null);
    loadDirectory(path);
  };

  // Ouvrir un fichier pour édition
  const openFile = async (filePath: string) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('Vous avez des modifications non sauvegardées. Continuer ?')) {
        return;
      }
    }

    try {
      const response = await fetch(`/api/filemanager/read-file?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();
      
      if (response.ok) {
        setEditingFile(filePath);
        setFileContent(data.content);
        setOriginalContent(data.content);
        setHasUnsavedChanges(false);
      } else {
        toast.error(data.error || 'Erreur lors de l\'ouverture du fichier');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  // Sauvegarder le fichier
  const saveFile = async () => {
    if (!editingFile) return;

    try {
      const response = await fetch('/api/filemanager/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: editingFile, content: fileContent })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOriginalContent(fileContent);
        setHasUnsavedChanges(false);
        toast.success('Fichier sauvegardé');
        loadDirectory(currentPath); // Rafraîchir la liste
      } else {
        toast.error(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  // Supprimer un fichier/dossier
  const deleteItem = async (itemPath: string, itemName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${itemName}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/filemanager/delete?path=${encodeURIComponent(itemPath)}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Supprimé avec succès');
        loadDirectory(currentPath);
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  // Renommer un fichier/dossier
  const renameItem = async (oldPath: string) => {
    if (!newName.trim()) {
      toast.error('Nom requis');
      return;
    }

    try {
      const response = await fetch('/api/filemanager/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newName: newName.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Renommé avec succès');
        setRenamingItem(null);
        setNewName('');
        loadDirectory(currentPath);
      } else {
        toast.error(data.error || 'Erreur lors du renommage');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  // Upload de fichiers
  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    formData.append('path', currentPath);
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/filemanager/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`${data.files.length} fichier(s) uploadé(s)`);
        loadDirectory(currentPath);
        setUploadDialogOpen(false);
      } else {
        toast.error(data.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  // Télécharger un fichier
  const downloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/api/filemanager/download?path=${encodeURIComponent(filePath)}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Créer une backup avec progression
  const createBackup = async () => {
    if (!window.confirm('Créer une backup complète du site ? Cela peut prendre quelques minutes.')) {
      return;
    }

    // Initialiser la progression
    const startTime = Date.now();
    setBackupProgress({
      isRunning: true,
      progress: 0,
      stage: 'Initialisation...',
      startTime
    });

    const stages = [
      { stage: 'Préparation de la backup...', progress: 10 },
      { stage: 'Analyse des fichiers...', progress: 25 },
      { stage: 'Compression des fichiers système...', progress: 45 },
      { stage: 'Compression des données utilisateur...', progress: 65 },
      { stage: 'Compression des ressources...', progress: 85 },
      { stage: 'Finalisation de l\'archive...', progress: 95 },
      { stage: 'Backup terminée !', progress: 100 }
    ];

    try {
      // Simuler la progression pendant que le backup s'exécute
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          const currentStageIndex = Math.floor(prev.progress / 15);
          if (currentStageIndex < stages.length) {
            const currentStage = stages[currentStageIndex];
            const newProgress = Math.min(prev.progress + 2, currentStage.progress);
            
            // Calculer le temps estimé restant
            const elapsedTime = Date.now() - (prev.startTime || Date.now());
            const estimatedTotalTime = elapsedTime * (100 / Math.max(newProgress, 1));
            const timeLeft = estimatedTotalTime - elapsedTime;
            const estimatedTimeLeft = timeLeft > 0 ? 
              `${Math.ceil(timeLeft / 1000)}s restantes` : 
              'Finalisation...';
            
            return {
              ...prev,
              progress: newProgress,
              stage: currentStage.stage,
              estimatedTimeLeft: newProgress < 100 ? estimatedTimeLeft : 'Terminé !'
            };
          }
          return prev;
        });
      }, 200);

      const response = await fetch('/api/filemanager/backup', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      clearInterval(progressInterval);
      
      if (response.ok) {
        setBackupProgress({
          isRunning: false,
          progress: 100,
          stage: 'Backup terminée !',
          filename: data.filename
        });
        
        toast.success(`Backup créée : ${data.filename}`);
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
          setBackupProgress({
            isRunning: false,
            progress: 0,
            stage: ''
          });
        }, 3000);
      } else {
        clearInterval(progressInterval);
        setBackupProgress({
          isRunning: false,
          progress: 0,
          stage: 'Erreur lors de la backup'
        });
        toast.error(data.error || 'Erreur lors de la création de la backup');
      }
    } catch (error) {
      setBackupProgress({
        isRunning: false,
        progress: 0,
        stage: 'Erreur réseau'
      });
      toast.error('Erreur réseau');
    }
  };

  // Extraire un ZIP
  const extractZip = async (zipPath: string) => {
    if (!window.confirm('Extraire ce fichier ZIP ? Les fichiers existants seront écrasés.')) {
      return;
    }

    try {
      const response = await fetch('/api/filemanager/extract-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipPath, extractPath: currentPath, overwrite: true })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Extraction terminée : ${data.extractedFiles.length} fichiers`);
        loadDirectory(currentPath);
      } else {
        toast.error(data.error || 'Erreur lors de l\'extraction');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  // Filtrer les éléments selon la recherche
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Charger le répertoire racine et les informations système au montage
  useEffect(() => {
    loadDirectory();
    loadSystemInfo();

    // Actualiser les informations système toutes les 5 minutes
    const systemInfoInterval = setInterval(loadSystemInfo, 5 * 60 * 1000); // 5 minutes = 300000ms

    return () => {
      clearInterval(systemInfoInterval);
    };
  }, []);

  // Détecter les changements dans l'éditeur
  useEffect(() => {
    setHasUnsavedChanges(fileContent !== originalContent);
  }, [fileContent, originalContent]);

  // Fonction utilitaire pour déterminer le langage de l'éditeur
  const getEditorLanguage = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'json': 'json',
      'css': 'css',
      'html': 'html',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'env': 'shell',
      'cfg': 'ini',
      'config': 'ini'
    };
    
    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header avec avertissement */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
              <Settings className="w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-600" />
              File Manager
            </h1>
            <p className="text-sm md:text-base text-gray-600">Gestionnaire de fichiers système - Accès administrateur</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button 
              onClick={loadSystemInfo} 
              disabled={loadingSystemInfo}
              variant="outline" 
              size="sm"
              className="bg-emerald-50 border-emerald-200 text-emerald-700"
            >
              {loadingSystemInfo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="hidden md:inline ml-2">Actualiser</span>
            </Button>
            
            <Button 
              onClick={createBackup} 
              disabled={backupProgress.isRunning}
              variant="outline" 
              size="sm"
              className="bg-orange-50 border-orange-200 text-orange-700 disabled:opacity-50"
            >
              {backupProgress.isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden md:inline ml-2">Backup en cours...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Créer Backup</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Avertissement */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800">⚠️ Attention - Modifications Définitives</h4>
              <p className="text-red-700 text-sm mt-1">
                Toutes les modifications faites ici affectent directement les fichiers du serveur. 
                Assurez-vous d'avoir effectué une sauvegarde avant d'agir.
              </p>
            </div>
          </div>
        </div>

        {/* Informations système */}
        {loadingSystemInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-gray-200 rounded"></div>
                      <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : systemInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Espace disque */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Stockage</h4>
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {systemInfo.disk.percentage}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Utilisé:</span>
                    <span className="font-medium text-blue-900">{formatFileSize(systemInfo.disk.used)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Libre:</span>
                    <span className="font-medium text-green-700">{formatFileSize(systemInfo.disk.free)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-blue-200 pt-2">
                    <span className="text-blue-700">Total:</span>
                    <span className="font-bold text-blue-900">{formatFileSize(systemInfo.disk.total)}</span>
                  </div>
                  <Progress value={systemInfo.disk.percentage} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* RAM */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">RAM</h4>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {systemInfo.memory.percentage}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Utilisée:</span>
                    <span className="font-medium text-green-900">{formatFileSize(systemInfo.memory.used)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Libre:</span>
                    <span className="font-medium text-emerald-700">{formatFileSize(systemInfo.memory.free)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-green-200 pt-2">
                    <span className="text-green-700">Total:</span>
                    <span className="font-bold text-green-900">{formatFileSize(systemInfo.memory.total)}</span>
                  </div>
                  <Progress value={systemInfo.memory.percentage} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* CPU */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">CPU</h4>
                  </div>
                  <Badge variant="outline" className="text-purple-700 border-purple-300">
                    {systemInfo.cpu.count} cores
                  </Badge>
                </div>
                
                                 <div className="space-y-2">
                   <div className="text-sm">
                     <span className="text-purple-700">Modèle:</span>
                     <p className="font-medium text-purple-900 text-xs leading-tight break-words" title={systemInfo.cpu.model}>
                       {systemInfo.cpu.model}
                     </p>
                   </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">Vitesse:</span>
                    <span className="font-medium text-purple-900">{systemInfo.cpu.speed} MHz</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-purple-200 pt-2">
                    <span className="text-purple-700">Architecture:</span>
                    <span className="font-bold text-purple-900">{systemInfo.system.arch}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Serveur */}
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Serveur</h4>
                  </div>
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    <Activity className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-700">Uptime:</span>
                    <span className="font-medium text-orange-900 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatUptime(systemInfo.system.uptime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-700">OS:</span>
                    <span className="font-medium text-orange-900 capitalize">{systemInfo.system.platform}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-700">Node:</span>
                    <span className="font-medium text-orange-900">{systemInfo.system.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-orange-200 pt-2">
                    <span className="text-orange-700 flex items-center">
                      <Database className="w-3 h-3 mr-1" />
                      Projet:
                    </span>
                    <span className="font-bold text-orange-900">{formatFileSize(systemInfo.project.size)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
                     </div>
         ) : null}

        {/* Barre de progression du backup */}
        <AnimatePresence>
          {(backupProgress.isRunning || backupProgress.progress > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {backupProgress.isRunning ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : backupProgress.progress === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {backupProgress.isRunning ? 'Création de la backup en cours...' : 
                       backupProgress.progress === 100 ? 'Backup terminée !' : 
                       'Backup interrompue'}
                    </h4>
                    <p className="text-sm text-gray-600">{backupProgress.stage}</p>
                  </div>
                </div>
                                 <div className="text-right">
                   <div className="text-lg font-bold text-blue-600">
                     {Math.round(backupProgress.progress)}%
                   </div>
                   {backupProgress.estimatedTimeLeft && (
                     <div className="text-xs text-gray-500">
                       {backupProgress.estimatedTimeLeft}
                     </div>
                   )}
                   {backupProgress.filename && (
                     <div className="text-xs text-gray-500 truncate max-w-32">
                       {backupProgress.filename}
                     </div>
                   )}
                 </div>
              </div>
              
                             <div className="space-y-2">
                 <div className="relative">
                   <Progress 
                     value={backupProgress.progress} 
                     className={`h-3 transition-all duration-300 ${
                       backupProgress.isRunning ? 'animate-pulse' : ''
                     }`}
                   />
                   {backupProgress.isRunning && (
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-bounce"></div>
                   )}
                 </div>
                 <div className="flex justify-between text-xs text-gray-500">
                   <span className="flex items-center">
                     🚀 Début
                   </span>
                   <span className={`px-2 py-1 rounded-md border transition-colors ${
                     backupProgress.isRunning 
                       ? 'bg-blue-50 border-blue-200 text-blue-700' 
                       : backupProgress.progress === 100 
                       ? 'bg-green-50 border-green-200 text-green-700'
                       : 'bg-white border-gray-200'
                   }`}>
                     {backupProgress.stage}
                   </span>
                   <span className="flex items-center">
                     ✅ Terminé
                   </span>
                 </div>
               </div>
              
              {backupProgress.progress === 100 && backupProgress.filename && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                  <div className="text-sm text-green-800">
                    ✅ Backup sauvegardée : <code className="bg-green-100 px-1 rounded">{backupProgress.filename}</code>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation et actions */}
        <div className="space-y-4">
          {/* Navigation et chemin */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 flex-wrap">
              {parentPath !== null && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateToDirectory(parentPath)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </Button>
              )}
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg truncate max-w-xs md:max-w-none">
                /{currentPath || 'racine'}
              </div>
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={() => setUploadDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" onClick={() => loadDirectory(currentPath)}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions Mobile */}
          <div className="md:hidden space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setUploadDialogOpen(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" onClick={() => loadDirectory(currentPath)} className="px-4">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Explorateur de fichiers */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col bg-white">
          {/* Header avec colonnes */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">Explorateur ({filteredItems.length} éléments)</h3>
            
            {/* En-têtes de colonnes - Desktop uniquement */}
            <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide pb-2 border-b border-gray-300">
              <div className="col-span-1 text-center">Type</div>
              <div className="col-span-4">Nom</div>
              <div className="col-span-2 text-right">Taille</div>
              <div className="col-span-3 text-center">Modifié</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Chargement...</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredItems.map((item, index) => (
                  <div key={item.path} className="group">
                    {renamingItem === item.path ? (
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nouveau nom"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') renameItem(item.path);
                              if (e.key === 'Escape') setRenamingItem(null);
                            }}
                            autoFocus
                          />
                          <Button size="sm" onClick={() => renameItem(item.path)}>
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setRenamingItem(null)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Layout Desktop */}
                        <div 
                          className={`hidden md:grid grid-cols-12 gap-2 p-3 hover:bg-gray-50 cursor-pointer group items-center transition-colors border-l-4 ${
                            index % 2 === 0 ? 'bg-white border-l-transparent' : 'bg-gray-25 border-l-gray-100'
                          } hover:border-l-blue-400`}
                          onClick={() => {
                            if (item.type === 'directory') {
                              navigateToDirectory(item.path);
                            } else if (isEditableFile(item.extension)) {
                              openFile(item.path);
                            }
                          }}
                        >
                          {/* Colonne Type/Icône */}
                          <div className="col-span-1 flex justify-center">
                            {getFileIcon(item)}
                          </div>
                          
                          {/* Colonne Nom */}
                          <div className="col-span-4 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{item.name}</div>
                            {item.extension && (
                              <Badge variant="outline" className="text-xs mt-1">{item.extension}</Badge>
                            )}
                          </div>

                          {/* Colonne Taille */}
                          <div className="col-span-2 text-right">
                            <span className="text-sm font-medium text-gray-700">
                              {formatFileSize(item.size)}
                            </span>
                          </div>

                          {/* Colonne Date */}
                          <div className="col-span-3 text-center">
                            <span className="text-xs text-gray-500">
                              {new Date(item.modified).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </span>
                            <div className="text-xs text-gray-400">
                              {new Date(item.modified).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>

                          {/* Colonne Actions */}
                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              {item.extension === '.zip' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    extractZip(item.path);
                                  }}
                                  title="Extraire ZIP"
                                  className="hover:bg-blue-100"
                                >
                                  <Archive className="w-3 h-3" />
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(item.path, item.name);
                                }}
                                title="Télécharger"
                                className="hover:bg-green-100"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenamingItem(item.path);
                                  setNewName(item.name);
                                }}
                                title="Renommer"
                                className="hover:bg-orange-100"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteItem(item.path, item.name);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Layout Mobile */}
                        <div className="md:hidden">
                          <div 
                            className={`p-4 hover:bg-gray-50 cursor-pointer group transition-colors border-l-4 ${
                              index % 2 === 0 ? 'bg-white border-l-transparent' : 'bg-gray-25 border-l-gray-100'
                            } hover:border-l-blue-400`}
                            onClick={() => {
                              if (item.type === 'directory') {
                                navigateToDirectory(item.path);
                              } else if (isEditableFile(item.extension)) {
                                openFile(item.path);
                              }
                            }}
                          >
                            {/* Header du fichier */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                {getFileIcon(item)}
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-gray-800 truncate">{item.name}</div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {item.extension && (
                                      <Badge variant="outline" className="text-xs">{item.extension}</Badge>
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {formatFileSize(item.size)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Métadonnées */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <span>
                                Modifié le {new Date(item.modified).toLocaleDateString('fr-FR')} à {new Date(item.modified).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Actions Mobile */}
                            <div className="flex items-center justify-center space-x-2 pt-2 border-t border-gray-100">
                              {item.extension === '.zip' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    extractZip(item.path);
                                  }}
                                  className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                >
                                  <Archive className="w-4 h-4 mr-1" />
                                  Extraire
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(item.path, item.name);
                                }}
                                className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Télécharger
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenamingItem(item.path);
                                  setNewName(item.name);
                                }}
                                className="flex-1 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Renommer
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteItem(item.path, item.name);
                                }}
                                className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {filteredItems.length === 0 && !loading && (
                  <div className="text-center text-gray-500 py-8">
                    <FolderOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun fichier trouvé</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Éditeur de code */}
        <div className="w-full md:w-1/2 flex flex-col min-h-[400px] md:min-h-0">
          {editingFile ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    {editingFile.split('/').pop()}
                    {hasUnsavedChanges && <span className="text-orange-600 ml-2">*</span>}
                  </h3>
                  <p className="text-sm text-gray-600">{editingFile}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                      Non sauvegardé
                    </Badge>
                  )}
                  <Button onClick={saveFile} disabled={!hasUnsavedChanges} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => {
                    if (hasUnsavedChanges && !window.confirm('Annuler les modifications ?')) return;
                    setEditingFile(null);
                    setHasUnsavedChanges(false);
                  }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getEditorLanguage(editingFile)}
                  value={fileContent}
                  onChange={(value) => setFileContent(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on'
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Edit className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Éditeur de Code</p>
                <p className="text-sm">Sélectionnez un fichier éditable pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog d'upload */}
      <AnimatePresence>
        {uploadDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-96"
            >
              <h3 className="text-lg font-semibold mb-4">Upload de Fichiers</h3>
              
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Cliquez pour sélectionner des fichiers</p>
                  <p className="text-sm text-gray-500">ou glissez-déposez ici</p>
                </div>
                
                <input
                  ref={uploadInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleUpload(e.target.files);
                    }
                  }}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}; 