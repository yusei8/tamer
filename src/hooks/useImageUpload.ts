import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  fileName?: string;
}

interface UseImageUploadOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
  autoSave?: boolean;
  maxRetries?: number;
  timeout?: number;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    onSuccess,
    onError,
    autoSave = true,
    maxRetries = 3,
    timeout = 30000 // 30 secondes
  } = options;

  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: 'idle'
  });

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file) return null;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      setUploadState({ progress: 0, status: 'error' });
      onError?.('Type de fichier invalide');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('L\'image est trop volumineuse (max 10MB)');
      setUploadState({ progress: 0, status: 'error' });
      onError?.('Fichier trop volumineux');
      return null;
    }

    setUploadState({
      progress: 0,
      status: 'uploading',
      fileName: file.name
    });

    let retries = 0;
    let lastError: Error | null = null;

    while (retries < maxRetries) {
      try {
        const formData = new FormData();
        formData.append('file', file, file.name);

        const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/upload`;
        
        // Créer une promesse avec XMLHttpRequest pour suivre la progression
        const uploadPromise = new Promise<Response>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          // Timeout
          const timeoutId = setTimeout(() => {
            xhr.abort();
            reject(new Error('Timeout lors de l\'upload'));
          }, timeout);

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 90); // 90% pour l'upload
              setUploadState(prev => ({ ...prev, progress }));
            }
          });

          xhr.addEventListener('load', () => {
            clearTimeout(timeoutId);
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadState(prev => ({ ...prev, progress: 95 })); // 95% pour le traitement
              resolve(new Response(xhr.responseText, { status: xhr.status }));
            } else {
              reject(new Error(`Erreur serveur: ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', () => {
            clearTimeout(timeoutId);
            reject(new Error('Erreur de connexion'));
          });

          xhr.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new Error('Upload annulé'));
          });

          xhr.open('POST', apiUrl);
          xhr.send(formData);
        });

        const response = await uploadPromise;
        
        if (response.ok) {
          const data = await response.json();
          const imageUrl = `/rachef-uploads/${data.filename}`;
          
          setUploadState({
            progress: 100,
            status: 'success',
            fileName: file.name
          });

          // Auto-hide après 3 secondes
          setTimeout(() => {
            setUploadState({ progress: 0, status: 'idle' });
          }, 3000);

          onSuccess?.(imageUrl);
          return imageUrl;
        } else {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

      } catch (error) {
        lastError = error as Error;
        retries++;
        
        if (retries < maxRetries) {
          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          setUploadState(prev => ({ 
            ...prev, 
            progress: 0,
            status: 'uploading'
          }));
        }
      }
    }

    // Toutes les tentatives ont échoué
    setUploadState({
      progress: 0,
      status: 'error',
      fileName: file.name
    });

    const errorMessage = lastError?.message || 'Erreur inconnue';
    toast.error(`Échec de l'upload après ${maxRetries} tentatives: ${errorMessage}`);
    onError?.(errorMessage);

    // Auto-hide après 5 secondes
    setTimeout(() => {
      setUploadState({ progress: 0, status: 'idle' });
    }, 5000);

    return null;
  }, [onSuccess, onError, maxRetries, timeout]);

  const cancelUpload = useCallback(() => {
    setUploadState({ progress: 0, status: 'idle' });
  }, []);

  const resetUpload = useCallback(() => {
    setUploadState({ progress: 0, status: 'idle' });
  }, []);

  return {
    uploadImage,
    uploadState,
    cancelUpload,
    resetUpload,
    isUploading: uploadState.status === 'uploading'
  };
};
