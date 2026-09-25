import React, { useState } from "react";
import { 
  X, 
  BookOpen
} from "lucide-react";
import { Applicant, formatNoPendaftaran } from "./types";
import { ActiveStudentTabs } from "./ActiveStudentTabs";

interface ActiveStudentDetailModalProps {
  selectedApplicant: Applicant;
  onClose: () => void;
  nipdMap: Map<number, string>;
  onEditClick: () => void;
}

export const ActiveStudentDetailModal: React.FC<ActiveStudentDetailModalProps> = ({
  selectedApplicant,
  onClose,
  nipdMap,
  onEditClick
}) => {
  const [activeTab, setActiveTab] = useState<string>("biodata");

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start border-b border-slate-100 dark:border-white/5">
          <div className="flex gap-5 items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/30 shrink-0">
              {(selectedApplicant.nama || "K")[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {selectedApplicant.nama}
                </h2>
                <span className="px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-full uppercase tracking-widest whitespace-nowrap">
                  Siswa Aktif
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 flex-wrap mb-2">
                <span className="text-blue-500 font-mono">
                  NIPD: {nipdMap.get(selectedApplicant.id) || selectedApplicant.nipd || "-"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur-md transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-default text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <BookOpen size={13} className="text-blue-500" />
                <span className="text-blue-500 font-mono">
                  NO. DAFTAR: {formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}
                </span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span className="text-blue-500 flex items-center gap-1">
                  NISN: {selectedApplicant.nisn}
                </span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span className="flex items-center gap-1">
                  NIK: {selectedApplicant.nik || "-"}
                </span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span>ANGKATAN: {selectedApplicant.periode || "2026-2027"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-white transition-colors shrink-0 ml-4 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 pt-4 shrink-0">
          <div className="bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl flex items-center gap-1 w-full overflow-x-auto scrollbar-none">
            {[
              { id: "biodata", label: "Biodata" },
              { id: "periodik", label: "Periodik" },
              { id: "bantuan", label: "Bantuan" },
              { id: "orangtua", label: "Orang Tua" },
              { id: "akademik", label: "Akademik" },
              { id: "pernyataan", label: "Pernyataan" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl shrink-0 transition-colors cursor-pointer ${
                  activeTab === t.id
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Tab Content Viewport */}
        <ActiveStudentTabs
          activeTab={activeTab}
          selectedApplicant={selectedApplicant}
        />

        {/* Modal Action Controls Footer */}
        <div className="px-8 py-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div>
            <button
              onClick={onEditClick}
              className="px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
            >
              Edit Data
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-white/5 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
