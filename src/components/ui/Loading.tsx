import React from 'react';
import { Activity } from 'lucide-react';
import { Button } from './Button';

export const Loading: React.FC<{ text?: string }> = ({ text = 'Cargando experiencia...' }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none space-y-4">
      {/* Animated Seismic Wave Radar */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-brand-cyan/15 animate-seismic-pulse"></div>
        <div className="w-14 h-14 rounded-full bg-navy-850 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glow-cyan">
          <Activity className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="font-extrabold text-xl text-white tracking-wider">
          SISMO LAB
        </h2>
        <p className="text-xs text-accent-gray font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{ onRetry?: () => void; message?: string }> = ({
  onRetry,
  message = 'No pudimos cargar esta información.'
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-accent-error/15 border border-accent-error/30 text-accent-error flex items-center justify-center text-3xl">
        ⚠️
      </div>

      <div className="space-y-1 max-w-xs">
        <h2 className="font-extrabold text-xl text-white tracking-tight uppercase">
          ALGO SALIÓ MAL
        </h2>
        <p className="text-xs text-accent-gray leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          REINTENTAR
        </Button>
      )}
    </div>
  );
};

export const OfflineState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center text-3xl">
        📡
      </div>

      <div className="space-y-1 max-w-xs">
        <h2 className="font-extrabold text-xl text-white tracking-tight uppercase">
          SIN CONEXIÓN
        </h2>
        <p className="text-xs text-accent-gray leading-relaxed">
          Podés seguir explorando algunas experiencias locales. Los resultados se sincronizarán cuando vuelva la conexión.
        </p>
      </div>

      {onRetry && (
        <Button variant="gold" size="md" onClick={onRetry}>
          REINTENTAR
        </Button>
      )}
    </div>
  );
};
