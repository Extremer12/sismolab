import React from 'react';

interface UiverseLoaderProps {
  text?: string;
  className?: string;
}

export const UiverseLoader: React.FC<UiverseLoaderProps> = ({
  text,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 p-6 ${className}`}>
      {/* From Uiverse.io by gharsh11032000 */}
      <div className="loader" />

      {text && (
        <span className="text-xs font-black text-brand-cyan uppercase tracking-[0.2em] animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};
