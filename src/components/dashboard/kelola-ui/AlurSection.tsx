"use client";

import React from "react";
import { Settings, Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

export interface AlurSectionProps {
  alurList: AlurItem[];
  handleAddAlur: () => void;
  handleUpdateAlur: (id: number, key: "title" | "desc", val: string) => void;
  handleMoveAlur: (index: number, direction: "up" | "down") => void;
  handleRemoveAlur: (id: number) => void;
}

export default function AlurSection(props: AlurSectionProps) {
  const { alurList, handleAddAlur, handleUpdateAlur, handleMoveAlur, handleRemoveAlur } = props;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
            <Settings size={16} className="text-blue-500" />
            <span>Tahapan Proses / Alur Pendaftaran Calon Siswa</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ubah, urutkan, tambah, atau hapus langkah pendaftaran</p>
        </div>

        <button
          onClick={handleAddAlur}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
        >
          <Plus size={14} />
          <span>Langkah Baru</span>
        </button>
      </div>

      <div className="space-y-4">
        {alurList.map((item, idx) => (
          <div 
            key={item.id}
            className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-3xl p-5 flex items-start gap-4 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow shadow-blue-500/10">
              {idx + 1}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[8px] uppercase font-black text-slate-450 tracking-wider">Judul Langkah</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdateAlur(item.id, "title", e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[8px] uppercase font-black text-slate-450 tracking-wider">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={item.desc}
                  onChange={(e) => handleUpdateAlur(item.id, "desc", e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-semibold text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Sorting & Control Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-center">
              <button
                onClick={() => handleMoveAlur(idx, "up")}
                disabled={idx === 0}
                className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-slate-900 transition-all ${
                  idx === 0 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => handleMoveAlur(idx, "down")}
                disabled={idx === alurList.length - 1}
                className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-slate-900 transition-all ${
                  idx === alurList.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => handleRemoveAlur(item.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {alurList.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Belum ada alur tahapan. Tambah tahapan baru dengan tombol diatas.
          </div>
        )}
      </div>
    </div>
  );
}
