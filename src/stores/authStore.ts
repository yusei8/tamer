import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Fonction de chiffrement simple (pour la demo - en production utiliser une vraie crypto)
const encrypt = (text: string): string => {
  return btoa(text.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) + 3)
  ).join(''));
};

const decrypt = (encrypted: string): string => {
  try {
    return atob(encrypted).split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 3)
    ).join('');
  } catch {
    return '';
  }
};

export type UserRole = 'admin' | 'gestionnaire';

interface Admin {
  id: string;
  name: string;
  pin: string; // chiffré
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  permissions: string[]; // Liste des permissions
}

interface AuthState {
  isAuthenticated: boolean;
  currentAdmin: Admin | null;
  admins: Admin[];
  loginAttempts: number;
  lockoutUntil: number | null;
  
  // Actions
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  createAdmin: (name: string, pin: string, role: UserRole, permissions: string[]) => boolean;
  deleteAdmin: (id: string) => boolean;
  updateAdminPin: (id: string, newPin: string) => boolean;
  updateAdminRole: (id: string, role: UserRole, permissions: string[]) => boolean;
  resetLockout: () => void;
  saveAdminsToFile: () => Promise<boolean>;
  loadAdminsFromFile: () => Promise<void>;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  canAccessSection: (section: string) => boolean;
}

// Définition des permissions disponibles
export const PERMISSIONS = {
  // Permissions d'édition de contenu
  EDIT_HERO: 'edit_hero',
  EDIT_OVERVIEW: 'edit_overview',
  EDIT_SERVICES: 'edit_services',
  EDIT_FORMATIONS: 'edit_formations',
  EDIT_FACILITIES: 'edit_facilities',
  EDIT_GALLERY: 'edit_gallery',
  EDIT_EVENTS: 'edit_events',
  EDIT_PAGES: 'edit_pages',
  EDIT_ANALYTICS: 'edit_analytics',
  EDIT_CONTACT: 'edit_contact',
  
  // Permissions de gestion
  MANAGE_MARKETS: 'manage_markets',
  EDIT_MARKETS: 'edit_markets', // Nouvelle permission pour l'édition du contenu marchés
  MANAGE_CONTACTS: 'manage_contacts',
  MANAGE_ADMINS: 'manage_admins',
  FILE_MANAGER: 'file_manager', // Nouvelle permission pour le gestionnaire de fichiers
  
  // Permissions système
  VIEW_DASHBOARD: 'view_dashboard',
  SYSTEM_SETTINGS: 'system_settings'
};

// Rôles prédéfinis avec leurs permissions
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS), // Toutes les permissions
  gestionnaire: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_MARKETS, // Gestion des inscriptions uniquement
    PERMISSIONS.MANAGE_CONTACTS, // Gestion des messages uniquement, pas d'édition
  ]
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentAdmin: null,
      admins: [
        {
          id: 'default-admin',
          name: 'Administrateur Principal',
          pin: encrypt('9988'),
          role: 'admin',
          permissions: Object.values(PERMISSIONS), // Forcer toutes les permissions
          createdAt: new Date().toISOString()
        }
      ],
      loginAttempts: 0,
      lockoutUntil: null,

      login: async (pin: string) => {
        const state = get();
        
        // Vérifier le lockout
        if (state.lockoutUntil && Date.now() < state.lockoutUntil) {
          return false;
        }

        // Chercher l'admin avec le PIN
        const admin = state.admins.find(a => decrypt(a.pin) === pin);
        
        if (admin) {
          // Succès
          set({
            isAuthenticated: true,
            currentAdmin: { ...admin, lastLogin: new Date().toISOString() },
            loginAttempts: 0,
            lockoutUntil: null
          });
          
          // Sauvegarder la dernière connexion
          get().saveAdminsToFile();
          return true;
        } else {
          // Échec
          const newAttempts = state.loginAttempts + 1;
          const newLockout = newAttempts >= 3 ? Date.now() + 30000 : null; // 30 secondes
          
          set({
            loginAttempts: newAttempts,
            lockoutUntil: newLockout
          });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentAdmin: null
        });
      },

      createAdmin: (name: string, pin: string, role: UserRole, permissions: string[]) => {
        const state = get();
        
        // Vérifier si l'utilisateur actuel peut créer des admins
        if (!state.currentAdmin || !state.hasPermission(PERMISSIONS.MANAGE_ADMINS)) {
          return false;
        }

        // Vérifier que le PIN n'existe pas déjà
        if (state.admins.some(admin => decrypt(admin.pin) === pin)) {
          return false;
        }

        const newAdmin: Admin = {
          id: `admin-${Date.now()}`,
          name,
          pin: encrypt(pin),
          role,
          permissions,
          createdAt: new Date().toISOString()
        };

        set({
          admins: [...state.admins, newAdmin]
        });

        get().saveAdminsToFile();
        return true;
      },

      deleteAdmin: (id: string) => {
        const state = get();
        
        // Vérifier les permissions
        if (!state.currentAdmin || !state.hasPermission(PERMISSIONS.MANAGE_ADMINS)) {
          return false;
        }

        // Ne pas supprimer soi-même
        if (state.currentAdmin.id === id) {
          return false;
        }

        // Ne pas supprimer le dernier admin
        const adminsCount = state.admins.filter(a => a.role === 'admin').length;
        const targetAdmin = state.admins.find(a => a.id === id);
        if (targetAdmin?.role === 'admin' && adminsCount <= 1) {
          return false;
        }

        set({
          admins: state.admins.filter(admin => admin.id !== id)
        });

        get().saveAdminsToFile();
        return true;
      },

      updateAdminPin: (id: string, newPin: string) => {
        const state = get();
        
        // Vérifier les permissions
        if (!state.currentAdmin || (!state.hasPermission(PERMISSIONS.MANAGE_ADMINS) && state.currentAdmin.id !== id)) {
          return false;
        }

        set({
          admins: state.admins.map(admin =>
            admin.id === id
              ? { ...admin, pin: encrypt(newPin) }
              : admin
          )
        });

        get().saveAdminsToFile();
        return true;
      },

      updateAdminRole: (id: string, role: UserRole, permissions: string[]) => {
        const state = get();
        
        // Seuls les admins peuvent changer les rôles
        if (!state.currentAdmin || !state.hasPermission(PERMISSIONS.MANAGE_ADMINS)) {
          return false;
        }

        // Ne pas changer son propre rôle
        if (state.currentAdmin.id === id) {
          return false;
        }

        set({
          admins: state.admins.map(admin =>
            admin.id === id
              ? { ...admin, role, permissions }
              : admin
          )
        });

        get().saveAdminsToFile();
        return true;
      },

      resetLockout: () => {
        set({
          loginAttempts: 0,
          lockoutUntil: null
        });
      },

      saveAdminsToFile: async () => {
        try {
          const response = await fetch('/api/save-admins', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ admins: get().admins }),
          });
          return response.ok;
        } catch (error) {
          console.error('Erreur sauvegarde admins:', error);
          return false;
        }
      },

      loadAdminsFromFile: async () => {
        try {
          const response = await fetch('/api/load-admins');
          if (response.ok) {
            const data = await response.json();
            if (data.admins && data.admins.length > 0) {
              set({ admins: data.admins });
            }
          }
        } catch (error) {
          console.error('Erreur chargement admins:', error);
        }
      },

      // Vérifier si l'utilisateur a une permission spécifique
      hasPermission: (permission: string) => {
        const state = get();
        if (!state.isAuthenticated || !state.currentAdmin) {
          return false;
        }
        
        // Si pas de permissions définies, considérer comme admin avec tous les droits
        if (!state.currentAdmin.permissions || !Array.isArray(state.currentAdmin.permissions)) {
          return true;
        }
        
        return state.currentAdmin.permissions.includes(permission);
      },

      // Vérifier l'accès à une section du dashboard
      canAccessSection: (section: string) => {
        const state = get();
        const hasPermission = state.hasPermission;
        
        // Mapping des sections vers les permissions
        const sectionPermissions: Record<string, string> = {
          'hero': 'edit_hero',
          'overview': 'edit_overview', 
          'services': 'edit_services',
          'formations': 'edit_formations',
          'facilities': 'edit_facilities',
          'gallery': 'edit_gallery',
          'events': 'edit_events',
          'markets': 'manage_markets',
          'contacts': 'manage_contacts',
          'analytics': 'edit_analytics',
          'pages': 'edit_pages',
          'file-manager': 'file_manager'
        };

        const requiredPermission = sectionPermissions[section];
        if (!requiredPermission) {
          return true; // Section inconnue, accès autorisé par défaut
        }

        return hasPermission(requiredPermission);
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentAdmin: state.currentAdmin,
        loginAttempts: state.loginAttempts,
        lockoutUntil: state.lockoutUntil
      })
    }
  )
); 