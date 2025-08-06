// Types pour le dashboard d'administration ACTL

export interface DataFile {
  name: string;
  content: any;
  lastModified: Date;
}

export interface DashboardSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: string;
}

export interface EditableField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'array' | 'object' | 'boolean' | 'date';
  value: any;
  required?: boolean;
  placeholder?: string;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'open' | 'closed' | 'draft';
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location?: string;
  image: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  programStructure: string[];
  courseContent: string[];
  careerOpportunities: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tags: string[];
  uploadedAt: Date;
}

export interface DashboardState {
  // Données actuelles
  dataJson: any;
  datapJson: any;
  
  // État de l'interface
  activeSection: string;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  // Historique
  history: Array<{
    timestamp: Date;
    action: string;
    data: any;
  }>;
  
  // Actions
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  updateField: (file: 'data' | 'datap', path: string, value: any) => void;
  addItem: (file: 'data' | 'datap', path: string, item: any) => void;
  removeItem: (file: 'data' | 'datap', path: string, index: number) => void;
  setActiveSection: (section: string) => void;
  undo: () => void;
  redo: () => void;
  addFormation: (formation: any) => void;
  updateFormation: (formation: any) => void;
  removeFormation: (formationId: string) => void;
  formationBackups: Array<{ date: string; items: any[] }>;
  backupFormations: () => void;
  restoreFormationBackup: (date: string) => void;
  // Synchronise la navbar avec les formations
  syncNavbarWithFormations: () => void;
  syncNavbarWithFormationsTitles: () => void;
}

export interface ImageUploadResult {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // en millisecondes
  maxHistory: number;
}

