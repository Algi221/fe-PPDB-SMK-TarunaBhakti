"use client";

import React from "react";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Eye, 
  Image as ImageIcon 
} from "lucide-react";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import { sanitizeSrc } from "@/utils/security";
import { MajorItem } from "../types";
import MajorEditorWorkspace from "./MajorEditorWorkspace";

interface MajorsTabProps {
  majorsList: MajorItem[];
  setMajorsList: React.Dispatch<React.SetStateAction<MajorItem[]>>;
  editingMajor: MajorItem | null;
  setEditingMajor: React.Dispatch<React.SetStateAction<MajorItem | null>>;
  isNewMajor: boolean;
  setIsNewMajor: (val: boolean) => void;
  emptyMajor: () => MajorItem;
  dragActiveStates: Record<string, boolean>;
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleDragState: (e: React.DragEvent, elementId: string, active: boolean) => void;
  processMediaFile: (file: File, type: "logo" | "banner" | "video" | "gallery-0" | "gallery-1" | "gallery-2" | "gallery-3") => void;
  showToastMsg: (message: string, type?: "success" | "error" | "info") => void;
}

export default function MajorsTab({
  majorsList,
  setMajorsList,
  editingMajor,
  setEditingMajor,
  isNewMajor,
  setIsNewMajor,
  emptyMajor,
  dragActiveStates,
  setDragActiveStates,
  handleDragState,
  processMediaFile,
  showToastMsg,
}: MajorsTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. If NOT editing: Render Grid Cards */}
      {editingMajor === null ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-500" />
                <span>Kompetensi Keahlian (Jurusan)</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Klik salah satu kartu jurusan untuk membuka Workspace Editor penuh secara inline.</p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setIsNewMajor(true);
                setEditingMajor(emptyMajor());
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase font-black tracking-wider transition-all shadow-md shadow-blue-500/10 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah Jurusan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorsList.map((major) => (
              <div
                key={major.code}
                onClick={() => setEditingMajor({ ...major })}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: major.color }} />
                
                {/* Card Preview Banner Frame */}
                <div className="h-40 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b border-slate-200/60 dark:border-white/5">
                  {major.banner ? (
                    <img 
                      src={DOMPurify.sanitize(sanitizeSrc(major.banner))} 
                      alt={major.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                    />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center gap-2">
                      <ImageIcon size={32} />
                      <span className="text-[8px] font-black uppercase">Tanpa Banner</span>
                    </div>
                  )}
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase text-white rounded-full shadow" style={{ backgroundColor: major.color }}>
                    {major.code}
                  </div>

                  {/* Delete Button Overlay */}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const result = await Swal.fire({
                        title: 'Konfirmasi',
                        text: `Apakah Anda yakin ingin menghapus jurusan ${major.title} (${major.code}) secara lokal? Klik "Simpan Perubahan" di atas untuk menyimpan secara permanen.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Ya',
                        cancelButtonText: 'Batal'
                      });
                      if (result.isConfirmed) {
                        setMajorsList(prev => prev.filter(m => m.code !== major.code));
                        showToastMsg(`Jurusan ${major.code} dihapus secara lokal. Silakan klik "Simpan Perubahan" di pojok kanan atas untuk menerapkannya secara permanen.`, "info");
                      }
                    }}
                    className="absolute top-3 right-3 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl shadow-lg border border-rose-500/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 z-10 hover:scale-105 cursor-pointer"
                    title="Hapus Jurusan"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl overflow-hidden bg-white/90 p-0.5 border shadow border-white/20">
                    {major.logo ? (
                      <img src={DOMPurify.sanitize(sanitizeSrc(major.logo))} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
                        <GraduationCap size={18} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2 line-clamp-1">
                      {major.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                      {major.desc || "Belum ada deskripsi jurusan."}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-600">
                    <span>Ubah Program Studi</span>
                    <Eye size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <MajorEditorWorkspace
          editingMajor={editingMajor}
          setEditingMajor={setEditingMajor}
          isNewMajor={isNewMajor}
          setIsNewMajor={setIsNewMajor}
          majorsList={majorsList}
          setMajorsList={setMajorsList}
          dragActiveStates={dragActiveStates}
          setDragActiveStates={setDragActiveStates}
          handleDragState={handleDragState}
          processMediaFile={processMediaFile}
          showToastMsg={showToastMsg}
        />
      )}
    </div>
  );
}
