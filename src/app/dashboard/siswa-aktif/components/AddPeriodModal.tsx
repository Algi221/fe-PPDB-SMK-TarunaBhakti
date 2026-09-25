import React from "react";

interface AddPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  getNextPeriod: () => string;
  newPeriodValue: string;
  setNewPeriodValue: (val: string) => void;
  customPeriods: string[];
  setCustomPeriods: React.Dispatch<React.SetStateAction<string[]>>;
  addToast: (title: string, message: string, type: "success" | "error" | "info" | "warning") => void;
}

export const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  isOpen,
  onClose,
  getNextPeriod,
  newPeriodValue,
  setNewPeriodValue,
  customPeriods,
  setCustomPeriods,
  addToast
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodValue.trim()) return;
    const added = [...customPeriods, newPeriodValue.trim()];
    setCustomPeriods(added);
    if (typeof window !== "undefined") {
      localStorage.setItem("ppdb_custom_periods", JSON.stringify(added));
    }
    setNewPeriodValue("");
    onClose();
    addToast("Periode Ditambahkan", `Angkatan ${newPeriodValue.trim()} berhasil dibuat!`, "success");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-sm flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15">
          <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide">
            Tambah Periode Angkatan
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-550 font-bold mt-1">
            Otomatis terisi tahun ajaran berikutnya. Bisa diubah jika perlu.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <input
              type="text"
              placeholder={getNextPeriod()}
              value={newPeriodValue}
              onChange={(e) => setNewPeriodValue(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all uppercase"
              required
            />
          </div>
          <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-355 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-white/5 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Simpan Periode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
