import React from 'react';

/**
 * Utilitaires pour le chargement des PDFs compatible avec IDM et autres gestionnaires de téléchargement
 */

/**
 * Charge un PDF en tant que Blob pour éviter l'interception par IDM
 * @param url URL du PDF à charger
 * @returns Blob URL du PDF ou l'URL originale en cas d'échec
 */
export const loadPdfAsBlob = async (url: string): Promise<string> => {
  try {
    console.log('🔄 Tentative de chargement PDF comme Blob pour éviter IDM:', url);
    
    // Fetch avec headers spéciaux pour éviter l'interception
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf, application/octet-stream, */*',
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        // Headers pour éviter l'interception par les gestionnaires de téléchargement
        'X-Requested-With': 'XMLHttpRequest',
        'X-PDF-Viewer': 'inline'
      },
      // Désactiver le cache pour éviter les problèmes
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Réponse PDF reçue, conversion en Blob...');
    
    // Convertir en blob
    const blob = await response.blob();
    
    // Vérifier que c'est bien un PDF
    if (!blob.type.includes('pdf') && !blob.type.includes('octet-stream')) {
      console.warn('⚠️ Type MIME suspect:', blob.type);
    }
    
    // Créer une URL blob
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    
    console.log('✅ PDF chargé comme Blob URL:', blobUrl);
    return blobUrl;
    
  } catch (error) {
    console.error('❌ Échec du chargement comme Blob, utilisation URL directe:', error);
    return url; // Fallback sur l'URL originale
  }
};

/**
 * Nettoie une Blob URL pour éviter les fuites mémoire
 * @param blobUrl URL blob à nettoyer
 */
export const cleanupBlobUrl = (blobUrl: string): void => {
  if (blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl);
    console.log('🧹 Blob URL nettoyée:', blobUrl);
  }
};

/**
 * Détecte si un gestionnaire de téléchargement interfère avec les PDFs
 * @returns true si un gestionnaire de téléchargement est détecté
 */
export const detectDownloadManager = (): boolean => {
  // Détection d'IDM
  const hasIDM = !!(window as any).external && 
                 typeof (window as any).external.AddUrlToList === 'function';
  
  // Détection d'autres gestionnaires communs
  const hasOtherManagers = !!(window as any).downloadManager || 
                          !!(window as any).fdm || 
                          !!(window as any).eagleget;
  
  const hasDownloadManager = hasIDM || hasOtherManagers;
  
  if (hasDownloadManager) {
    console.log('🔍 Gestionnaire de téléchargement détecté, utilisation du mode Blob');
  }
  
  return hasDownloadManager;
};

/**
 * Configuration PDF.js optimisée pour éviter les conflits avec IDM
 */
export const getPdfJsConfig = (url: string) => ({
  url,
  // Désactiver le streaming pour éviter les problèmes de réseau
  disableStream: true,
  disableAutoFetch: true,
  
  // Configuration avancée pour la compatibilité
  verbosity: 0, // Réduire les logs
  
  // Headers personnalisés
  httpHeaders: {
    'Accept': 'application/pdf, application/octet-stream, */*',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'X-PDF-Viewer': 'inline'
  },
  
  // Configuration des cartes de caractères
  cMapUrl: 'https://unpkg.com/pdfjs-dist@4.3.93/cmaps/',
  cMapPacked: true,
  
  // Améliorer les performances
  useWorkerFetch: false,
  isEvalSupported: false,
  maxImageSize: 16777216, // 16MB
  
  // Gestion d'erreur personnalisée
  onError: (error: Error) => {
    console.error('Erreur PDF.js:', error);
  },
  
  onProgress: (progressData: any) => {
    if (progressData.total > 0) {
      const percent = (progressData.loaded / progressData.total) * 100;
      console.log(`📥 Chargement PDF: ${percent.toFixed(1)}%`);
    }
  }
});

/**
 * Hook personnalisé pour charger un PDF de manière compatible
 */
export const usePdfLoader = (initialUrl: string) => {
  const [pdfUrl, setPdfUrl] = React.useState<string>(initialUrl);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const loadPdf = React.useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Détecter si on a besoin du mode Blob
      const needsBlobMode = detectDownloadManager();
      
      let finalUrl = url;
      if (needsBlobMode) {
        finalUrl = await loadPdfAsBlob(url);
      }
      
      // Nettoyer l'ancienne URL si c'était une blob
      if (pdfUrl !== initialUrl) {
        cleanupBlobUrl(pdfUrl);
      }
      
      setPdfUrl(finalUrl);
    } catch (error) {
      console.error('Erreur lors du chargement PDF:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setPdfUrl(url); // Fallback sur l'URL originale
    } finally {
      setIsLoading(false);
    }
  }, [pdfUrl, initialUrl]);
  
  // Charger le PDF au montage du composant
  React.useEffect(() => {
    if (initialUrl) {
      loadPdf(initialUrl);
    }
  }, [initialUrl, loadPdf]);
  
  // Nettoyer les blob URLs au démontage
  React.useEffect(() => {
    return () => {
      if (pdfUrl !== initialUrl) {
        cleanupBlobUrl(pdfUrl);
      }
    };
  }, [pdfUrl, initialUrl]);
  
  return {
    pdfUrl,
    isLoading,
    error,
    reload: () => loadPdf(initialUrl)
  };
};
