import React from 'react';
import { X } from 'lucide-react';
import { sanitizeSrc } from './types';

interface LightboxModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

export default function LightboxModal({ imageSrc, onClose }: LightboxModalProps) {
  if (!imageSrc) return null;

  return (
    <div 
      className="fixed inset-0 z-200 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50 border border-white/10 hover:scale-105 active:scale-95"
        aria-label="Tutup"
      >
        <X size={20} />
      </button>
      
      <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img 
          src={sanitizeSrc(imageSrc) || ''} 
          alt="Detail Zoomed" 
          className="max-w-full max-h-[90vh] md:max-h-screen object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
        />
      </div>
    </div>
  );
}
