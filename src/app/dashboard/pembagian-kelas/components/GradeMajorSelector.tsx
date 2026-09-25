"use client";

import React from "react";
import { getMajorLogo } from "../types";

interface GradeMajorSelectorProps {
  activeMajors: Array<{ code: string; name: string }>;
  selectedMajor: string;
  setSelectedMajor: (val: string) => void;
  setSelectedStudentIds: (val: number[]) => void;
  setAssignmentFilter: (val: any) => void;
  selectedGrade: 10 | 11 | 12;
  setSelectedGrade: (val: 10 | 11 | 12) => void;
}

export default function GradeMajorSelector({
  activeMajors,
  selectedMajor,
  setSelectedMajor,
  setSelectedStudentIds,
  setAssignmentFilter,
  selectedGrade,
  setSelectedGrade,
}: GradeMajorSelectorProps) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-slate-200/80 dark:border-slate-800/40 pb-6">
        {activeMajors.map((m) => (
          <button
            key={m.code}
            onClick={() => {
              setSelectedMajor(m.code);
              setSelectedStudentIds([]);
              setAssignmentFilter("ALL");
            }}
            className={`flex flex-col items-center justify-center text-center p-6 rounded-3xl transition-all border duration-300 hover:scale-[1.03] group cursor-pointer ${
              selectedMajor === m.code
                ? "bg-linear-to-tr from-indigo-600 to-blue-600 border-indigo-600/85 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                : "bg-white border-slate-200 hover:border-indigo-500/40 hover:bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-450 dark:hover:text-white shadow-sm"
            }`}
          >
            {getMajorLogo(m.code, "w-12 h-12 shadow-md")}
            <span className={`mt-3 text-[9px] font-black uppercase tracking-widest leading-normal ${
              selectedMajor === m.code ? "text-white" : "text-slate-700 dark:text-slate-350"
            }`}>
              {m.name}
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 ${
              selectedMajor === m.code ? "text-blue-100" : "text-slate-400"
            }`}>
              ({m.code})
            </span>
          </button>
        ))}
      </div>

      {/* Pilihan Tingkat Kelas (Grade Tabs) */}
      <div className="flex bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 p-1.5 rounded-2xl shadow-sm justify-start gap-2 max-w-lg transition-colors duration-300">
        {([10, 11, 12] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setSelectedGrade(g);
              setSelectedStudentIds([]);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedGrade === g
                ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                : "text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Kelas {g} {g === 10 ? "(Baru Masuk)" : ""}
          </button>
        ))}
      </div>
    </>
  );
}
