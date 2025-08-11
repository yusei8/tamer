import React from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, X, Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'idle';
  fileName?: string;
  onCancel?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  fileName,
  onCancel
}) => {
  if (status === 'idle') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Upload className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return `Upload en cours... ${Math.round(progress)}%`;
      case 'success':
        return 'Image uploadée et sauvegardée avec succès !';
      case 'error':
        return 'Erreur lors de l\'upload. Veuillez réessayer.';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full"
    >
      <div className="flex items-center gap-3 mb-2">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {fileName || 'Image'}
          </p>
          <p className="text-xs text-gray-500">
            {getStatusMessage()}
          </p>
        </div>
        {status === 'uploading' && onCancel && (
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {status === 'uploading' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getStatusColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-full bg-green-100 rounded-lg p-2 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700">Terminé !</span>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-full bg-red-100 rounded-lg p-2 flex items-center gap-2"
        >
          <X className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">Échec</span>
        </motion.div>
      )}
    </motion.div>
  );
};
