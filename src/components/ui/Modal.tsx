import React from 'react';
import { X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="sismo-card p-6 max-w-md w-full border border-brand-cyan/30 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          {title && <h3 className="font-extrabold text-lg text-white">{title}</h3>}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors ml-auto"
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-end justify-center">
      <div className="bg-navy-900 border-t border-brand-cyan/30 rounded-t-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2"></div>
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          {title && <h3 className="font-extrabold text-lg text-white">{title}</h3>}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 text-slate-300 flex items-center justify-center ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
