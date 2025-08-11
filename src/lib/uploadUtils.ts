/**
 * Utilitaires pour la gestion des uploads d'images
 */

/**
 * Génère l'URL de l'API d'upload en fonction de l'environnement
 * En local (localhost ou port 3000) : utilise le port 4000
 * En production : utilise le même port que l'application
 */
export const getUploadApiUrl = (): string => {
  const serverPort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
  
  // En développement local
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' || 
      window.location.port === '3000') {
    return `${window.location.protocol}//${window.location.hostname}:4000/api/upload`;
  }
  
  // En production
  return `${window.location.protocol}//${window.location.hostname}:${serverPort}/api/upload`;
};

/**
 * Upload une image vers le serveur avec gestion d'erreur
 */
export const uploadImage = async (file: File): Promise<{success: boolean, filename?: string, error?: string}> => {
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Veuillez sélectionner une image valide' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const apiUrl = getUploadApiUrl();
    
    console.log('Upload vers:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, filename: data.filename };
    } else {
      const error = await response.json().catch(() => ({ error: 'Erreur de connexion' }));
      console.error('Erreur upload:', response.status, error);
      return { success: false, error: error.error || 'Connexion au serveur impossible' };
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return { success: false, error: 'Erreur de connexion au serveur. Vérifiez que le serveur backend fonctionne.' };
  }
};
