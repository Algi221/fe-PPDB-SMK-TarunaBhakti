"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface KelolaUIConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  changeDescription: string;
  setChangeDescription: (val: string) => void;
}

export default function KelolaUIConfirmModal({
  isOpen,
  onClose,
  onSubmit,
  changeDescription,
  setChangeDescription
}: KelolaUIConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form 
        onSubmit={onSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 space-y-4"
      >
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Simpan Perubahan UI</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 text-slate-450 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 leading-normal">
            Harap masukkan deskripsi singkat mengenai perubahan yang Anda lakukan. Catatan ini akan disimpan dalam database dan dapat digunakan untuk memulihkan versi ini di masa mendatang.
          </p>
          <textarea
            value={changeDescription}
            onChange={(e) => setChangeDescription(e.target.value)}
            rows={3}
            required
            placeholder="Contoh: Mengubah judul utama, memperbarui logo RPL, dan memperbarui alur langkah 3"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
          >
            <Check size={12} />
            <span>Simpan Sekarang</span>
          </button>
        </div>
      </form>
    </div>
  );
}
