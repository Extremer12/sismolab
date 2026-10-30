import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const { isDark } = useTheme();
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 ${
      isDark ? 'bg-navy-950/80' : 'bg-slate-900/40'
    }`}>
      <div className={`p-6 max-w-md w-full rounded-3xl border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
        isDark ? 'sismo-card border-brand-cyan/30 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        <div className={`flex justify-between items-center pb-2 border-b ${
          isDark ? 'border-white/10' : 'border-slate-100'
        }`}>
          {title && <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>}
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-auto ${
              isDark ? 'bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const { isDark } = useTheme();
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-end justify-center ${
      isDark ? 'bg-navy-950/80' : 'bg-slate-900/40'
    }`}>
      <div className={`rounded-t-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t ${
        isDark ? 'bg-navy-900 border-brand-cyan/30 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`w-12 h-1.5 rounded-full mx-auto mb-2 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}></div>
        <div className={`flex justify-between items-center pb-2 border-b ${
          isDark ? 'border-white/10' : 'border-slate-100'
        }`}>
          {title && <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>}
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center ml-auto transition-colors ${
              isDark ? 'bg-navy-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:text-slate-950'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
