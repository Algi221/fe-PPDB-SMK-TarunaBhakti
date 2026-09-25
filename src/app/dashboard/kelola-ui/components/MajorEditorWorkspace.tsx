"use client";

import React from "react";
import { 
  Trash2, 
  ArrowLeft, 
  Check, 
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { MajorItem } from "../types";
import MajorMediaUploader from "./MajorMediaUploader";

interface MajorEditorWorkspaceProps {
  editingMajor: MajorItem;
  setEditingMajor: React.Dispatch<React.SetStateAction<MajorItem | null>>;
  isNewMajor: boolean;
  setIsNewMajor: (val: boolean) => void;
  majorsList: MajorItem[];
  setMajorsList: React.Dispatch<React.SetStateAction<MajorItem[]>>;
  dragActiveStates: Record<string, boolean>;
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleDragState: (e: React.DragEvent, elementId: string, active: boolean) => void;
  processMediaFile: (file: File, type: "logo" | "banner" | "video" | "gallery-0" | "gallery-1" | "gallery-2" | "gallery-3") => void;
  showToastMsg: (message: string, type?: "success" | "error" | "info") => void;
}

export default function MajorEditorWorkspace({
  editingMajor,
  setEditingMajor,
  isNewMajor,
  setIsNewMajor,
  majorsList,
  setMajorsList,
  dragActiveStates,
  setDragActiveStates,
  handleDragState,
  processMediaFile,
  showToastMsg,
}: MajorEditorWorkspaceProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <button
          onClick={() => {
            setEditingMajor(null);
            setIsNewMajor(false);
          }}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Kembali ke List Kartu</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="w-3 h-6 rounded-full" style={{ backgroundColor: editingMajor.color }} />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">
            {isNewMajor ? "WORKSPACE BARU JURUSAN" : `WORKSPACE EDITOR JURUSAN: ${editingMajor.code}`}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: General & Media Uploaders */}
        <MajorMediaUploader
          editingMajor={editingMajor}
          setEditingMajor={setEditingMajor}
          dragActiveStates={dragActiveStates}
          setDragActiveStates={setDragActiveStates}
          handleDragState={handleDragState}
          processMediaFile={processMediaFile}
        />

        {/* Right: Core Fields, Careers, Facilities, Gallery */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Texts */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">Informasi Umum</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[8px] uppercase font-black text-slate-450 tracking-wider">Kode Jurusan (e.g. RPL, TJKT)</label>
                <input
                  type="text"
                  value={editingMajor.code}
                  disabled={!isNewMajor}
                  onChange={(e) => setEditingMajor({ ...editingMajor, code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "") })}
                  placeholder="Masukkan kode jurusan..."
                  className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none ${!isNewMajor ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] uppercase font-black text-slate-450 tracking-wider">Nama Program Studi</label>
                <input
                  type="text"
                  value={editingMajor.title}
                  onChange={(e) => setEditingMajor({ ...editingMajor, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[8px] uppercase font-black text-slate-450 tracking-wider">Warna Hex Aksen</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingMajor.color}
                    onChange={(e) => setEditingMajor({ ...editingMajor, color: e.target.value })}
                    className="w-10 h-10 p-0 rounded-xl border-0 cursor-pointer overflow-hidden shrink-0"
                  />
                  <input
                    type="text"
                    value={editingMajor.color}
                    onChange={(e) => setEditingMajor({ ...editingMajor, color: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[8px] uppercase font-black text-slate-450 tracking-wider">Deskripsi Lengkap</label>
              <textarea
                value={editingMajor.desc}
                onChange={(e) => setEditingMajor({ ...editingMajor, desc: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-semibold text-xs focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Dynamic Gallery Slots */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">Galeri Aktivitas (4 Foto &amp; Caption)</h4>
              <span className="text-[8px] text-slate-450 font-bold block mt-1 uppercase">Ganti foto standard Unsplash menggunakan File Explorer Anda secara visual</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((slotIdx) => {
                const galItem = editingMajor.gallery[slotIdx] || { url: "", caption: "" };
                const elementId = `gallery-${slotIdx}`;
                
                return (
                  <div key={slotIdx} className="border border-slate-200/60 dark:border-white/5 p-4.5 rounded-2xl bg-white dark:bg-slate-900 flex flex-col justify-between gap-3 shadow-sm">
                    <div
                      onDragEnter={(e) => handleDragState(e, elementId, true)}
                      onDragOver={(e) => handleDragState(e, elementId, true)}
                      onDragLeave={(e) => handleDragState(e, elementId, false)}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setDragActiveStates(prev => ({ ...prev, [elementId]: false }));
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          processMediaFile(e.dataTransfer.files[0], `gallery-${slotIdx}` as any);
                        }
                      }}
                      onClick={() => document.getElementById(`picker-gallery-${slotIdx}`)?.click()}
                      className={`h-32 border border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                        dragActiveStates[elementId] 
                          ? "border-blue-500 bg-blue-50/10" 
                          : "border-slate-300 dark:border-slate-800 hover:border-blue-500/40"
                      }`}
                      style={{
                        backgroundImage: galItem.url ? `url(${galItem.url})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      <input
                        id={`picker-gallery-${slotIdx}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processMediaFile(e.target.files[0], `gallery-${slotIdx}` as any);
                          }
                        }}
                        className="hidden"
                      />
                      
                      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] opacity-80 group-hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-white p-2">
                        <ImageIcon size={18} className="text-blue-400 mb-1 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-wider">Ganti Foto Galeri #{slotIdx+1}</span>
                        <span className="text-[6px] font-bold text-slate-350 uppercase mt-0.5">Atau Klik Explorer</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={galItem.caption}
                      onChange={(e) => {
                        const updatedGallery = [...editingMajor.gallery];
                        if (!updatedGallery[slotIdx]) updatedGallery[slotIdx] = { url: "", caption: "" };
                        updatedGallery[slotIdx] = { ...updatedGallery[slotIdx], caption: e.target.value };
                        setEditingMajor({ ...editingMajor, gallery: updatedGallery });
                      }}
                      placeholder={`Caption Foto #${slotIdx+1}`}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-bold text-[10px] focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Careers */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
              Peluang Kerja / Karir Lulusan (4 Item)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((idx) => {
                const career = editingMajor.careers[idx] || { title: "", desc: "" };
                
                return (
                  <div key={idx} className="p-4 border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900 rounded-2xl space-y-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Karir Lulusan #{idx+1}</span>
                    <input
                      type="text"
                      value={career.title}
                      onChange={(e) => {
                        const updated = [...editingMajor.careers];
                        if (!updated[idx]) updated[idx] = { title: "", desc: "" };
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setEditingMajor({ ...editingMajor, careers: updated });
                      }}
                      placeholder="Nama Profesi"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-white/5 rounded-lg text-slate-850 dark:text-white font-bold text-xs focus:outline-none"
                    />
                    <textarea
                      value={career.desc}
                      onChange={(e) => {
                        const updated = [...editingMajor.careers];
                        if (!updated[idx]) updated[idx] = { title: "", desc: "" };
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setEditingMajor({ ...editingMajor, careers: updated });
                      }}
                      rows={2}
                      placeholder="Penjelasan profesi..."
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-white/5 rounded-lg text-slate-850 dark:text-white font-semibold text-[10px] focus:outline-none resize-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Laboratory Facilities */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
              Fasilitas Laboratorium &amp; Sarana Utama
            </h4>

            <div className="space-y-2.5">
              {editingMajor.facilities.map((fac, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fac}
                    onChange={(e) => {
                      const updated = [...editingMajor.facilities];
                      updated[fIdx] = e.target.value;
                      setEditingMajor({ ...editingMajor, facilities: updated });
                    }}
                    className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = editingMajor.facilities.filter((_, i) => i !== fIdx);
                      setEditingMajor({ ...editingMajor, facilities: updated });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all shrink-0 cursor-pointer"
                    title="Hapus Fasilitas"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setEditingMajor({ ...editingMajor, facilities: [...editingMajor.facilities, "Laboratorium / Sarana Baru"] });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[9px] uppercase tracking-wider font-black transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={12} />
                <span>Tambah Baris Fasilitas</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Control Footer */}
      <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-white/5 pt-4.5 mt-6">
        <button
          type="button"
          onClick={() => {
            setEditingMajor(null);
            setIsNewMajor(false);
          }}
          className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-750 dark:text-slate-300 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => {
            if (!editingMajor.code.trim()) {
              showToastMsg("Kode Jurusan wajib diisi.", "error");
              return;
            }
            if (!editingMajor.title.trim()) {
              showToastMsg("Nama Program Studi wajib diisi.", "error");
              return;
            }
            
            if (isNewMajor) {
              const exists = majorsList.some(m => m.code.toUpperCase() === editingMajor.code.toUpperCase());
              if (exists) {
                showToastMsg(`Kode Jurusan "${editingMajor.code}" sudah terdaftar.`, "error");
                return;
              }
              setMajorsList(prev => [...prev, editingMajor]);
              setIsNewMajor(false);
            } else {
              setMajorsList(prev => prev.map(m => m.code === editingMajor.code ? editingMajor : m));
            }
            
            const savedCode = editingMajor.code;
            setEditingMajor(null);
            showToastMsg(`Workspace ${savedCode} tersimpan secara lokal. Silakan klik "Simpan Perubahan" di pojok kanan atas untuk menerapkannya secara permanen.`, "success");
          }}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Check size={14} />
          <span>Simpan Detail</span>
        </button>
      </div>
    </div>
  );
}
