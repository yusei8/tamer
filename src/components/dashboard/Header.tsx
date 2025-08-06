import React from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  Download, 
  Upload,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { 
    hasUnsavedChanges, 
    saveData, 
    undo, 
    redo, 
    activeSection,
    dataJson,
    datapJson
  } = useDashboardStore();

  const handleSave = async () => {
    // Réinitialiser les flags de changements locaux
    (window as any)._hasContactChanges = false;
    (window as any)._hasFooterChanges = false;
    (window as any)._hasHeroChanges = false;
    (window as any)._hasNavbarChanges = false;
    (window as any)._hasUserContactChanges = false;
    
    await saveData();
  };

  const handlePreview = () => {
    // Ouvrir le site principal dans un nouvel onglet
    window.open('/', '_blank');
  };

  const handleExportData = () => {
    // Télécharger data.json
    const dataBlob = new Blob([JSON.stringify(dataJson, null, 2)], {
      type: 'application/json'
    });
    const dataUrl = URL.createObjectURL(dataBlob);
    const aData = document.createElement('a');
    aData.href = dataUrl;
    aData.download = 'data.json';
    document.body.appendChild(aData);
    aData.click();
    document.body.removeChild(aData);
    URL.revokeObjectURL(dataUrl);

    // Télécharger datap.json
    const datapBlob = new Blob([JSON.stringify(datapJson, null, 2)], {
      type: 'application/json'
    });
    const datapUrl = URL.createObjectURL(datapBlob);
    const aDatap = document.createElement('a');
    aDatap.href = datapUrl;
    aDatap.download = 'datap.json';
    document.body.appendChild(aDatap);
    aDatap.click();
    document.body.removeChild(aDatap);
    URL.revokeObjectURL(datapUrl);

    toast.success('data.json et datap.json téléchargés');
  };

  const handleImportData = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Valider la structure des données
          if (importedData.data && importedData.datap) {
            // Envoyer les données au backend pour écraser les fichiers
            await fetch('/api/data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(importedData.data)
            });
            await fetch('/api/datap', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(importedData.datap)
            });
            toast.success('Données importées et remplacées avec succès');
            window.location.reload();
          } else {
            toast.error('Format de fichier invalide');
          }
        } catch (error) {
          toast.error('Erreur lors de l\'importation du fichier');
        }
      };
      
      reader.readAsText(file);
    };

    input.click();
  };

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      overview: 'Vue d\'ensemble',
      hero: 'Section Héro',
      formations: 'Formations',
      events: 'Événements',
      markets: 'Marchés',
      gallery: 'Galerie',
      services: 'Services',
      facilities: 'Ateliers',
      contact: 'Contact',
      navigation: 'Footer',
              navbar: 'Navigation Bar',
        pages: 'Pages internes',
        'user-contact': 'Page de Contact utilisateur'
    };
    return titles[section] || section;
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Section actuelle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {getSectionTitle(activeSection)}
            </h2>
            <p className="text-sm text-slate-500">
              Gestion du contenu • ACTL Dashboard
            </p>
          </div>
          
          {/* Indicateur de statut */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium",
              (hasUnsavedChanges || (window as any)._hasContactChanges || (window as any)._hasFooterChanges || (window as any)._hasHeroChanges || (window as any)._hasNavbarChanges || (window as any)._hasUserContactChanges)
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-green-50 text-green-700 border border-green-200"
            )}
          >
            {(hasUnsavedChanges || (window as any)._hasContactChanges || (window as any)._hasFooterChanges || (window as any)._hasHeroChanges || (window as any)._hasNavbarChanges || (window as any)._hasUserContactChanges) ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Modifications non sauvegardées</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Tout est sauvegardé</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          {/* Actions d'historique */}
          <div className="flex items-center space-x-1 border-r border-slate-200 pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              className="text-slate-600 hover:text-slate-800"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              className="text-slate-600 hover:text-slate-800"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions d'import/export */}
          <div className="flex items-center space-x-1 border-r border-slate-200 pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImportData}
              className="text-slate-600 hover:text-slate-800"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportData}
              className="text-slate-600 hover:text-slate-800"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* Prévisualisation */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="text-slate-600 hover:text-slate-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser
          </Button>

          {/* Sauvegarde */}
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges && !(window as any)._hasContactChanges && !(window as any)._hasFooterChanges && !(window as any)._hasHeroChanges && !(window as any)._hasNavbarChanges && !(window as any)._hasUserContactChanges}
            className={cn(
              "transition-all duration-200",
              (hasUnsavedChanges || (window as any)._hasContactChanges || (window as any)._hasFooterChanges || (window as any)._hasHeroChanges || (window as any)._hasNavbarChanges || (window as any)._hasUserContactChanges)
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

