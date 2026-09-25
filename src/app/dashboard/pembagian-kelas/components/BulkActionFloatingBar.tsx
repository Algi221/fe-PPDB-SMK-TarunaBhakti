"use client";

import React from "react";
import { ClassItem } from "../types";

interface BulkActionFloatingBarProps {
  selectedStudentIds: number[];
  classesOfSelectedMajor: ClassItem[];
  handleAssignSelectedToClass: (targetClass: string) => void;
}

export default function BulkActionFloatingBar({
  selectedStudentIds,
  classesOfSelectedMajor,
  handleAssignSelectedToClass,
}: BulkActionFloatingBarProps) {
  if (selectedStudentIds.length === 0) return null;

  return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] w-full max-w-3xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
              {selectedStudentIds.length}
            </span>
            <div className="text-left">
              <h5 className="text-[11px] font-black uppercase tracking-wider">Siswa Terpilih</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Tentukan kelas secara massal untuk pendaftar aktif.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Tentukan Kelas:</span>
            {classesOfSelectedMajor.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAssignSelectedToClass(c.name)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-indigo-600 shadow-sm cursor-pointer"
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => handleAssignSelectedToClass("")}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
              title="Keluarkan Siswa dari Kelas"
            >
              Keluarkan
            </button>
          </div>
        </div>
  );
}
