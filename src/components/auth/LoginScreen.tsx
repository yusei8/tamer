import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, Timer } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingLockout, setRemainingLockout] = useState(0);

  const { login, loginAttempts, lockoutUntil, resetLockout } = useAuthStore();

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  // Countdown pour le lockout
  useEffect(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const timer = setInterval(() => {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setRemainingLockout(0);
          resetLockout();
          clearInterval(timer);
        } else {
          setRemainingLockout(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutUntil, resetLockout]);

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4 && !lockoutUntil) {
      setPin(prev => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = async () => {
    if (pin.length === 4 && !lockoutUntil) {
      setIsLoading(true);
      setError('');
      
      try {
        const success = await login(pin);
        if (!success) {
          setError('Code PIN incorrect');
          setPin('');
        }
      } catch (error) {
        setError('Erreur de connexion');
        setPin('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Auto-submit quand 4 chiffres sont entrés
  useEffect(() => {
    if (pin.length === 4 && !lockoutUntil) {
      handleSubmit();
    }
  }, [pin]);

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/rachef-uploads/ae.jpg" 
          alt="Background ACTL"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/80 to-teal-900/90"></div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header Section - Clean & Professional */}
        <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-t-2xl border border-white/20 border-b-0 shadow-2xl">
          {/* Logo ACTL - Très Visible */}
          <div className="w-28 h-28 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <img 
              src="/rachef-uploads/895b9f7a-e550-40cd-ad1b-42bc954e2f3d.png" 
              alt="ACTL Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          {/* Titres Professionnels */}
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            ACTL Site Web Editeur
          </h1>

          {/* Badge Sécurité */}
          <div className="inline-flex items-center px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Un code pin est nécessaire pour se connecter
          </div>
        </div>

        {/* Section Code PIN - Collée au Header */}
        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-b-2xl border border-white/20 border-t-0 shadow-2xl">
          {/* Titre Code PIN */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
              <Lock className="w-6 h-6 mr-2 text-emerald-400" />
              Code PIN
            </h2>
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowPin(!showPin)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-400 transition-colors duration-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* PIN Boxes - Professional Style */}
          <div className="flex space-x-3 justify-center mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                  pin.length > index
                    ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/30 text-white/40'
                } backdrop-blur-sm`}
              >
                {showPin && pin[index] ? pin[index] : (pin.length > index ? '●' : '')}
              </div>
            ))}
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-center text-sm flex items-center justify-center"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lockout Timer */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg text-orange-200 text-center text-sm flex items-center justify-center"
              >
                <Timer className="w-4 h-4 mr-2" />
                Accès bloqué pendant {remainingLockout} secondes
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning */}
          {loginAttempts > 0 && !isLocked && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-200 text-center text-sm">
              Tentative {loginAttempts}/3 - Attention au blocage
            </div>
          )}

          {/* Pavé Numérique Ultra-Professionnel */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {digits.map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigitClick(digit)}
                disabled={isLocked || isLoading}
                className={`h-14 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isLocked || isLoading
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-600/30'
                    : 'bg-white/10 hover:bg-emerald-400/20 text-white border border-white/20 hover:border-emerald-400/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                } backdrop-blur-sm`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Action Buttons - Clean */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleBackspace}
              disabled={isLocked || isLoading || pin.length === 0}
              className={`h-12 rounded-xl font-medium text-sm transition-all duration-200 ${
                isLocked || isLoading || pin.length === 0
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-400/30 hover:border-orange-400/50'
              }`}
            >
              ⌫ Effacer
            </button>

            <button
              onClick={handleClear}
              disabled={isLocked || isLoading || pin.length === 0}
              className={`h-12 rounded-xl font-medium text-sm transition-all duration-200 ${
                isLocked || isLoading || pin.length === 0
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 hover:border-red-400/50'
              }`}
            >
              🗑️ Vider
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-white text-sm">Vérification en cours...</span>
            </div>
          )}
        </div>

        {/* Footer - Minimal */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            © 2025 ACTL - Tous droits réservés
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen; 