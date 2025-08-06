import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DashboardState } from '../types/dashboard.types';
import toast from 'react-hot-toast';
import React from 'react';

export const useDashboardStore = create<DashboardState>()(
  immer((set, get) => ({
    // État initial
    dataJson: {},
    datapJson: {},
    activeSection: 'overview',
    isLoading: false,
    hasUnsavedChanges: false,
    history: [],
    formationBackups: [],

    // Charger les données depuis les fichiers JSON
    loadData: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        // Charger data.json depuis l'API backend via proxy
        const dataResponse = await fetch('/api/load-data');
        const dataJson = await dataResponse.json();

        // Charger datap.json depuis l'API backend via proxy
        const datapResponse = await fetch('/api/load-datap');
        const datapJson = await datapResponse.json();

        set((state) => {
          state.dataJson = dataJson;
          state.datapJson = datapJson;
          state.isLoading = false;
          state.hasUnsavedChanges = false;
        });

        toast.success('Données chargées avec succès', { position: 'top-left' });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
        
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    // Sauvegarder les données
    saveData: async () => {
      const { dataJson, datapJson } = get();
      
      try {
        // Sauvegarder data.json via l'API backend et proxy
        const dataSave = await fetch('/api/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataJson)
        });
        if (!dataSave.ok) throw new Error('Erreur sauvegarde data.json');

        // Sauvegarder datap.json via l'API backend et proxy
        const datapSave = await fetch('/api/save-datap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datapJson)
        });
        if (!datapSave.ok) throw new Error('Erreur sauvegarde datap.json');

        set((state) => {
          state.hasUnsavedChanges = false;
          state.history.push({
            timestamp: new Date(),
            action: 'save',
            data: { dataJson, datapJson }
          });
          if (state.history.length > 10) {
            state.history = state.history.slice(-10);
          }
        });

        toast.success('Données sauvegardées avec succès', { position: 'top-left' });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        toast.error('Erreur lors de la sauvegarde');
      }
    },

    // Sauvegarder un backup des formations
    backupFormations: () => {
      set((state) => {
        const snapshot = {
          date: new Date().toISOString(),
          items: JSON.parse(JSON.stringify(state.dataJson.formations.items)),
        };
        state.formationBackups = [snapshot, ...state.formationBackups].slice(0, 10); // max 10 backups
      });
    },

    // Restaurer un backup de formations
    restoreFormationBackup: (date) => {
      set((state) => {
        const backup = state.formationBackups.find(b => b.date === date);
        if (backup) {
          state.dataJson.formations.items = JSON.parse(JSON.stringify(backup.items));
          // Synchroniser la navbar
          state.syncNavbarWithFormations();
          state.hasUnsavedChanges = true;
        }
      });
    },

    // Mettre à jour un champ
    updateField: (file: 'data' | 'datap', path: string, value: any) => {
      set((state) => {
        const target = file === 'data' ? state.dataJson : state.datapJson;
        const keys = path.split('.');
        
        let current = target;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        state.hasUnsavedChanges = true;
        // Synchroniser la navbar si on modifie showOnHome d'une formation
        if (file === 'data' && path.startsWith('formations.items.') && path.endsWith('showOnHome')) {
          state.syncNavbarWithFormations();
        }
      });
    },

    // Ajouter un élément à un tableau
    addItem: (file: 'data' | 'datap', path: string, item: any) => {
      set((state) => {
        const target = file === 'data' ? state.dataJson : state.datapJson;
        const keys = path.split('.');
        
        let current = target;
        for (const key of keys) {
          if (!current[key]) {
            current[key] = [];
          }
          current = current[key];
        }
        
        if (Array.isArray(current)) {
          current.push(item);
          state.hasUnsavedChanges = true;
        }
      });
    },

    // Supprimer un élément d'un tableau
    removeItem: (file: 'data' | 'datap', path: string, index: number) => {
      set((state) => {
        const target = file === 'data' ? state.dataJson : state.datapJson;
        const keys = path.split('.');
        
        let current = target;
        for (const key of keys) {
          current = current[key];
        }
        
        if (Array.isArray(current) && index >= 0 && index < current.length) {
          current.splice(index, 1);
          state.hasUnsavedChanges = true;
        }
      });
    },

    // Ajouter une formation (avec synchronisation navbar)
    addFormation: (formation) => {
      set((state) => {
        // Ajout dans formations.items
        state.dataJson.formations.items.push(formation);
        // Synchroniser la navbar
        state.syncNavbarWithFormations();
        state.hasUnsavedChanges = true;
      });
    },

    // Modifier une formation (et synchroniser la navbar)
    updateFormation: (formation) => {
      set((state) => {
        // Update dans formations.items
        const idx = state.dataJson.formations.items.findIndex(f => f.id === formation.id);
        if (idx !== -1) {
          state.dataJson.formations.items[idx] = formation;
        }
        // Synchroniser la navbar
        state.syncNavbarWithFormations();
        state.hasUnsavedChanges = true;
      });
    },

    // Supprimer une formation (et synchroniser la navbar)
    removeFormation: (formationId) => {
      set((state) => {
        // Suppression dans formations.items
        state.dataJson.formations.items = state.dataJson.formations.items.filter(f => f.id !== formationId);
        // Synchroniser la navbar
        state.syncNavbarWithFormations();
        // TODO: Supprimer la page dédiée si elle existe
        state.hasUnsavedChanges = true;
      });
    },

    // Changer la section active
    setActiveSection: (section: string) => {
      set((state) => {
        state.activeSection = section;
      });
    },

    // Annuler la dernière action
    undo: () => {
      const { history } = get();
      if (history.length > 1) {
        const previousState = history[history.length - 2];
        set((state) => {
          state.dataJson = previousState.data.dataJson;
          state.datapJson = previousState.data.datapJson;
          state.history = history.slice(0, -1);
          state.hasUnsavedChanges = true;
        });
        toast.success('Action annulée');
      }
    },

    // Refaire la dernière action annulée
    redo: () => {
      // Implémentation simplifiée - dans une vraie app, il faudrait un système plus sophistiqué
      toast.success('Fonction redo non implémentée dans cette version');
    },

    // Synchroniser la navbar avec les formations
    syncNavbarWithFormations: () => {
      set((state) => {
        const navbar = state.dataJson.navbar;
        const formationsLink = navbar.links.find(l => l.text === 'Formations');
        if (formationsLink && formationsLink.subLinks) {
          // Forcer la présence du lien catalogue en premier
          let catalogueLink = formationsLink.subLinks.find(s => s.path === '/formations/catalogue');
          if (!catalogueLink) {
            catalogueLink = { text: 'Catalogue de formation', path: '/formations/catalogue' };
          }
          // Générer les autres liens formations
          const otherLinks = state.dataJson.formations.items
            .filter(f => f.showOnHome)
            .map(f => ({
              text: f.title,
              path: f.path || `/formations/${f.id}`
            }))
            .filter(l => l.path !== '/formations/catalogue');
          formationsLink.subLinks = [catalogueLink, ...otherLinks];
        }
      });
    },

    // Ajoute une fonction pour synchroniser les titres des sous-liens formations dans la navbar avec les titres des pages/formations
    syncNavbarWithFormationsTitles: () => {
      set((state) => {
        const navbar = state.dataJson.navbar;
        const formationsLink = navbar.links.find(l => l.text === 'Formations');
        if (formationsLink && formationsLink.subLinks) {
          // Pour chaque sous-lien, si le path correspond à une page formation, on met à jour le text
          formationsLink.subLinks = formationsLink.subLinks.map(sub => {
            const pageKey = sub.path?.split('/').pop();
            const page = state.datapJson[pageKey];
            if (page && page.title) {
              return { ...sub, text: page.title };
            }
            return sub;
          });
        }
      });
    }
  }))
);

// Hook pour auto-sauvegarde
export const useAutoSave = (enabled: boolean = true, interval: number = 30000) => {
  const { hasUnsavedChanges, saveData } = useDashboardStore();

  React.useEffect(() => {
    if (!enabled || !hasUnsavedChanges) return;

    const timer = setInterval(() => {
      if (hasUnsavedChanges) {
        saveData();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, hasUnsavedChanges, saveData, interval]);
};

