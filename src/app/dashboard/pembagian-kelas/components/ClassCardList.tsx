"use client";

import React from "react";
import { Layers, Download, X, Plus, Eye, Trash2, ChevronRight } from "lucide-react";
import { ClassItem } from "../types";

interface ClassCardListProps {
  selectedGrade: number;
  selectedMajor: string;
  handleExportAllClasses: () => void;
  handleExportAllMajors: () => void;
  isAddingClass: boolean;
  setIsAddingClass: (val: boolean) => void;
  newClassName: string;
  setNewClassName: (val: string) => void;
  handleCreateClass: (e: React.FormEvent) => void;
  classesOfSelectedMajor: ClassItem[];
  classEnrollments: Record<string, { total: number; L: number; P: number }>;
  setSelectedClassDetail: (c: ClassItem) => void;
  handleDragOver: (e: React.DragEvent, id: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, className: string) => void;
  activeDropClass: string | null;
  handleDeleteClass: (id: string, name: string) => void;
}

export default function ClassCardList({
  selectedGrade,
  selectedMajor,
  handleExportAllClasses,
  handleExportAllMajors,
  isAddingClass,
  setIsAddingClass,
  newClassName,
  setNewClassName,
  handleCreateClass,
  classesOfSelectedMajor,
  classEnrollments,
  setSelectedClassDetail,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  activeDropClass,
  handleDeleteClass,
}: ClassCardListProps) {
  return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Daftar Kelas Aktif (Tingkat {selectedGrade} Jurusan {selectedMajor})</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllClasses}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-250 dark:border-white/5 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 transition-all shadow-sm cursor-pointer"
            >
              <Download size={12} />
              <span>Ekspor Semua Kelas ({selectedMajor})</span>
            </button>
            <button
              onClick={handleExportAllMajors}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 border border-blue-250 dark:border-white/5 text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 transition-all shadow-sm cursor-pointer"
            >
              <Download size={12} />
              <span>Ekspor Semua Jurusan</span>
            </button>
            <button
              onClick={() => setIsAddingClass(!isAddingClass)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/30 border border-slate-250 dark:border-white/5 text-[10px] uppercase font-bold text-slate-655 dark:text-slate-350 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            >
              {isAddingClass ? <X size={12} /> : <Plus size={12} />}
              <span>{isAddingClass ? "Tutup Form" : "Buat Kelas Baru"}</span>
            </button>
          </div>
        </div>

        {/* Create Class Inline Form */}
        {isAddingClass && (
          <form onSubmit={handleCreateClass} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 mb-6 flex flex-wrap gap-4 items-end animate-in zoom-in-95 duration-200">
            <div className="space-y-1.5 shrink-0 w-full sm:w-auto sm:flex-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Kelas Baru</label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={`Contoh: X ${selectedMajor} 3`}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm shadow-indigo-500/10 w-full sm:w-auto cursor-pointer"
            >
              Simpan Kelas
            </button>
          </form>
        )}

        {/* Classes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {classesOfSelectedMajor.map((c) => {
            const enroll = classEnrollments[c.name] || { total: 0, L: 0, P: 0 };
            
            return (
              <div 
                key={c.id}
                onClick={() => setSelectedClassDetail(c)}
                onDragOver={(e) => handleDragOver(e, c.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, c.name)}
                className={`p-5 border rounded-3xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all relative group overflow-hidden ${
                  activeDropClass === c.id
                    ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 ring-2 ring-blue-500 scale-[1.02] shadow-lg shadow-blue-500/10"
                    : "bg-slate-50 dark:bg-slate-950/40 border-slate-200/60 dark:border-white/5 hover:border-blue-500/40"
                }`}
              >
                {/* Decorative border line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-500" />
                
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-white text-sm group-hover:text-blue-500 transition-colors">{c.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Terdaftar: {enroll.total} Siswa</span>
                    {enroll.total > 0 && (
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        (L: {enroll.L}, P: {enroll.P})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedClassDetail(c)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg transition-all"
                      title="Lihat Detail Kelas"
                    >
                      <Eye size={13} />
                    </button>
                    {enroll.total === 0 && (
                      <button
                        onClick={() => handleDeleteClass(c.id, c.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Hapus Kelas Kosong"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-blue-500">
                  <span>Lihat Daftar Kelas</span>
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {classesOfSelectedMajor.length === 0 && (
            <div className="sm:col-span-2 md:col-span-3 xl:col-span-4 text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Belum ada kelas yang terdaftar untuk jurusan {selectedMajor}. Klik "+ Buat Kelas Baru" untuk mendaftar.
            </div>
          )}
        </div>
      </div>
  );
}
