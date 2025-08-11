import React from 'react';
import { Button } from './button';
import { Download, Eye, ExternalLink } from 'lucide-react';
import { usePdfViewer } from '../../hooks/usePdfViewer';
import toast from 'react-hot-toast';

interface AntiIdmButtonsProps {
  pdfUrl: string;
  filename?: string;
  showViewButton?: boolean;
  showDownloadButton?: boolean;
  showNewTabButton?: boolean;
  className?: string;
}

export const AntiIdmButtons: React.FC<AntiIdmButtonsProps> = ({
  pdfUrl,
  filename = 'catalogue-actl.pdf',
  showViewButton = true,
  showDownloadButton = true,
  showNewTabButton = true,
  className = ''
}) => {
  const { openInModal, openInNewTab, downloadViaDom, isOpening } = usePdfViewer({
    onError: (error) => {
      toast.error(error, { position: 'top-center' });
    }
  });

  const handleView = () => {
    toast.success('Ouverture du catalogue en mode lecture...', { 
      icon: '👀', 
      position: 'top-center' 
    });
    openInModal(pdfUrl);
  };

  const handleDownload = () => {
    toast.success('Téléchargement du catalogue en cours...', { 
      icon: '📥', 
      position: 'top-center' 
    });
    downloadViaDom(pdfUrl, filename);
  };

  const handleNewTab = () => {
    toast.success('Ouverture dans un nouvel onglet...', { 
      icon: '🔗', 
      position: 'top-center' 
    });
    openInNewTab(pdfUrl);
  };

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {showViewButton && (
        <Button
          onClick={handleView}
          disabled={isOpening}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <Eye className="h-5 w-5 mr-2" />
          {isOpening ? 'Chargement...' : 'Consulter le catalogue'}
        </Button>
      )}

      {showDownloadButton && (
        <Button
          onClick={handleDownload}
          disabled={isOpening}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <Download className="h-5 w-5 mr-2" />
          {isOpening ? 'Préparation...' : 'Télécharger PDF'}
        </Button>
      )}

      {showNewTabButton && (
        <Button
          onClick={handleNewTab}
          disabled={isOpening}
          variant="outline"
          className="border-2 border-blue-500/50 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          {isOpening ? 'Ouverture...' : 'Ouvrir dans un onglet'}
        </Button>
      )}
    </div>
  );
};

// Composant spécialisé pour les modales/sections du dashboard
export const DashboardPdfButtons: React.FC<{
  pdfUrl: string;
  filename?: string;
}> = ({ pdfUrl, filename }) => (
  <AntiIdmButtons
    pdfUrl={pdfUrl}
    filename={filename}
    showViewButton={true}
    showDownloadButton={true}
    showNewTabButton={false}
    className="mt-4"
  />
);

// Composant spécialisé pour la page publique du catalogue
export const PublicCatalogueButtons: React.FC<{
  pdfUrl: string;
  filename?: string;
}> = ({ pdfUrl, filename }) => (
  <AntiIdmButtons
    pdfUrl={pdfUrl}
    filename={filename}
    showViewButton={true}
    showDownloadButton={true}
    showNewTabButton={true}
    className="flex-wrap gap-6"
  />
);
