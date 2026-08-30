import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  if (showReconnected) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 backdrop-blur-md">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{language === 'es' ? 'Conexión Restablecida' : 'Connection Restored'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="px-3.5 py-1 rounded-full bg-amber-950/90 border border-amber-400/60 text-amber-200 font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/60 backdrop-blur-md">
        <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span>{language === 'es' ? 'Modo Offline Activo · 100% Funcional' : 'Offline Mode · 100% Functional'}</span>
      </div>
    </div>
  );
};
