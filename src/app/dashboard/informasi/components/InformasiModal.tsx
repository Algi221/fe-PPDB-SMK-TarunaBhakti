"use client";

import React from "react";
import { 
  Megaphone, 
  FileText, 
  Calendar, 
  Trash2, 
  Upload, 
  Loader2 
} from "lucide-react";
import { sanitizeSrc } from "./types";

interface InformasiModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  submitting: boolean;
  judul: string;
  setJudul: (val: string) => void;
  tanggal: string;
  setTanggal: (val: string) => void;
  konten: string;
  setKonten: (val: string) => void;
  fotoUrl: string;
  setFotoUrl: (val: string) => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  videoName: string;
  setVideoName: (val: string) => void;
  dokumenUrl: string;
  setDokumenUrl: (val: string) => void;
  dokumenName: string;
  setDokumenName: (val: string) => void;
  dragActive: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDokumenFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function InformasiModal({
  isOpen,
  isEditMode,
  submitting,
  judul,
  setJudul,
  tanggal,
  setTanggal,
  konten,
  setKonten,
  fotoUrl,
  setFotoUrl,
  videoUrl,
  setVideoUrl,
  videoName,
  setVideoName,
  dokumenUrl,
  setDokumenUrl,
  dokumenName,
  setDokumenName,
  dragActive,
  onClose,
  onSubmit,
  handleFileChange,
  handleVideoFileChange,
  handleDokumenFileChange,
  handleDrag,
  handleDrop,
}: InformasiModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-2xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 my-8 transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-150 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/15">
          <div>
            <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Megaphone size={18} className="text-blue-600 dark:text-blue-400" />
              <span>{isEditMode ? "Edit Publikasi Informasi" : "Publikasikan Informasi Baru"}</span>
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mt-1">
              Lengkapi form isian di bawah ini dengan tepat
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-none">
            
            {/* Judul Input */}
            <div className="space-y-2">
              <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Judul Pengumuman <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-550">
                  <FileText size={15} />
                </span>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul pengumuman informasi..."
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Tanggal Input */}
            <div className="space-y-2">
              <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Tanggal Publikasi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-550">
                  <Calendar size={15} />
                </span>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Konten Input */}
            <div className="space-y-2">
              <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Isi Konten Informasi <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                placeholder="Tuliskan detail pengumuman informasi secara rinci di sini..."
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-semibold leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
              />
            </div>

            {/* Premium Drag & Drop Image Uploader */}
            <div className="space-y-2">
              <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Foto / Poster Penunjang</label>
              
              {fotoUrl ? (
                <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-52 bg-slate-100 dark:bg-slate-950 group">
                  <img src={fotoUrl && /^(https?:\/\/|\/(?!\/)|data:image\/)/i.test(fotoUrl) ? fotoUrl : ""} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => setFotoUrl("")}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <Trash2 size={12} />
                      <span>Hapus Foto</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer h-52 relative overflow-hidden ${
                    dragActive
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20"
                  }`}
                >
                  <input
                    type="file"
                    id="image-file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                    <Upload size={18} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Pilih atau Seret Foto Anda</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">Format JPG, PNG, atau WEBP. Maksimum ukuran file 3 MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Media Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-150 dark:border-white/5">
              {/* Video Uploader */}
              <div className="space-y-2 text-left">
                <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Video Informasi (Maks 10MB)</label>
                
                {videoUrl ? (
                  <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-36 bg-slate-950 group flex items-center justify-center">
                    <video src={videoUrl && /^(https?:\/\/|\/(?!\/)|data:video\/)/i.test(videoUrl) ? videoUrl : ""} className="h-full w-full object-contain" />
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-200">
                      <span className="text-[9px] text-white font-extrabold uppercase tracking-wider truncate max-w-[90%]">{videoName}</span>
                      <button
                        type="button"
                        onClick={() => { setVideoUrl(""); setVideoName(""); }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
                      >
                        <Trash2 size={11} />
                        <span>Hapus Video</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-36 relative overflow-hidden">
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                      <Upload size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Pilih Berkas Video</h5>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">Format MP4 atau WEBM. Maksimal 10 MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Uploader */}
              <div className="space-y-2 text-left">
                <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Dokumen Lampiran (Maks 5MB)</label>
                
                {dokumenUrl ? (
                  <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-36 bg-slate-50 dark:bg-slate-950/40 p-4 group flex flex-col items-center justify-center text-center shadow-inner">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 mb-1">
                      <FileText size={18} />
                    </div>
                    <h6 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[90%] leading-tight">{dokumenName}</h6>
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">Dokumen Siap</span>
                    
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => { setDokumenUrl(""); setDokumenName(""); }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
                      >
                        <Trash2 size={11} />
                        <span>Hapus Berkas</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-36 relative overflow-hidden">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleDokumenFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                      <Upload size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Pilih Berkas Dokumen</h5>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">PDF, DOCX, XLSX, TXT. Maksimal 5 MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Modal Action Buttons Footer */}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-950/15 border-t border-slate-150 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-655 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(59,130,246,0.25)] active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Sedang Menyimpan...</span>
                </>
              ) : (
                <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan"}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
