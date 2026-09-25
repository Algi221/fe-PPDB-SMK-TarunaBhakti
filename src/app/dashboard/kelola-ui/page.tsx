"use client";

import React from "react";
import { 
  Palette, 
  Settings, 
  HelpCircle, 
  Check, 
  X, 
  Info,
  Clock,
  RotateCcw,
  FileText,
  GraduationCap,
  Briefcase,
  Database
} from "lucide-react";
import Swal from "sweetalert2";

import KelolaUITabContent from "./components/KelolaUITabContent";
import KelolaUIConfirmModal from "./components/KelolaUIConfirmModal";
import { useKelolaUIState } from "./hooks/useKelolaUIState";

const NAV_TABS = [
  { id: "hero", label: "Hero, Kontak & Gelombang", icon: FileText },
  { id: "majors", label: "Program Keahlian (Jurusan)", icon: GraduationCap },
  { id: "alur", label: "Alur Pendaftaran", icon: Settings },
  { id: "form", label: "Form & Panduan", icon: Info },
  { id: "bank", label: "Rekening Bank Sekolah", icon: Database },
  { id: "faq", label: "Pertanyaan (FAQ)", icon: HelpCircle },
  { id: "partners", label: "Partner Industri", icon: Briefcase },
  { id: "revisions", label: "Riwayat Perubahan", icon: Clock }
];

export default function KelolaUserInterface() {
  const uiState = useKelolaUIState();
  const {
    mounted,
    activeTab,
    setActiveTab,
    router,
    loading,
    saving,
    toast,
    showConfirmModal,
    setShowConfirmModal,
    changeDescription,
    setChangeDescription,
    editingMajor,
    fetchCurrentConfig,
    handleSaveAll
  } = uiState;

  if (!mounted) return null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500 relative">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-250 dark:border-emerald-900" 
            : toast.type === "error"
            ? "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-250 dark:border-rose-900"
            : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-300 border-indigo-250 dark:border-indigo-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <X size={16} /> : <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full mx-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Menyimpan Perubahan...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Menulis riwayat ke database</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Palette size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Kelola User Interface</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">Edit Semua Foto, Teks, Jurusan, dan Formulir PPDB secara Real-time</p>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          {mounted && typeof window !== "undefined" && localStorage.getItem("ppdb_ui_editor_draft") && (
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Konfirmasi',
                  text: "Apakah Anda yakin ingin membatalkan semua draf perubahan yang belum disimpan dan memuat ulang data asli dari server?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Ya',
                  cancelButtonText: 'Batal'
                });
                if (result.isConfirmed) {
                  localStorage.removeItem("ppdb_ui_editor_draft");
                  fetchCurrentConfig();
                }
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Draf</span>
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-3 bg-linear-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100/50 dark:bg-slate-950 p-1.5 rounded-[22px] border border-slate-200/70 dark:border-slate-800/40 flex flex-wrap gap-1 shadow-inner mb-6 transition-all duration-300">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              disabled={editingMajor !== null && tab.id !== "majors"}
              onClick={() => {
                setActiveTab(tab.id as any);
                router.push(`?tab=${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-transparent ${
                editingMajor !== null && tab.id !== "majors" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              } ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 rounded-[16px_6px_16px_6px] scale-[1.02] translate-y-[-0.5px]"
                  : "text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900/80 rounded-xl hover:rounded-[16px_6px_16px_6px] hover:border-indigo-500/30"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memuat Konfigurasi...</span>
          </div>
        ) : (
          <KelolaUITabContent uiState={uiState} />
        )}
      </div>

      {/* Confirmation Modal */}
      <KelolaUIConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onSubmit={handleSaveAll}
        changeDescription={changeDescription}
        setChangeDescription={setChangeDescription}
      />
    </div>
  );
}
