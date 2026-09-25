import React from "react";
import { Info, Layers, FileCheck } from "lucide-react";
import { Applicant } from "./types";

interface ActiveStudentAcademicTabProps {
  activeTab: string;
  selectedApplicant: Applicant;
}

export const ActiveStudentAcademicTab: React.FC<ActiveStudentAcademicTabProps> = ({
  activeTab,
  selectedApplicant,
}) => {
  if (activeTab === "akademik") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <Info size={12} className="text-blue-500" /> Pendidikan Asal
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Nama Sekolah Asal
              </span>
              <span className="text-slate-850 dark:text-white text-sm font-extrabold">
                {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                No. Ijazah / SKHUN
              </span>
              <span className="text-slate-800 dark:text-white font-mono font-extrabold">
                {selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} /{" "}
                {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Tgl Lulus / Lama Belajar
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} (
                {selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <Layers size={12} className="text-blue-500" /> Pilihan Minat Studi
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Kompetensi Keahlian / Jurusan
              </span>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold uppercase">
                {selectedApplicant.jurusan || selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Alasan Memilih Jurusan
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "pernyataan") {
    return (
      <div className="space-y-6">
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
          <FileCheck size={12} className="text-blue-500" /> Komitmen & Janji Kedisiplinan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">
              Tawuran / Perkelahian
            </span>
            <span
              className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${
                selectedApplicant.perkelahian === "Ya"
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              }`}
            >
              {selectedApplicant.perkelahian || "Tidak"}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">
              Penyalahgunaan Narkoba
            </span>
            <span
              className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${
                selectedApplicant.narkoba === "Ya"
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              }`}
            >
              {selectedApplicant.narkoba || "Tidak"}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">
              Pelanggaran Hukum Lain
            </span>
            <span
              className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${
                selectedApplicant.pelanggaran_lain === "Ya"
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              }`}
            >
              {selectedApplicant.pelanggaran_lain || "Tidak"}
            </span>
          </div>
        </div>

        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
          <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">
            Pernyataan Kesanggupan Taruna Baru:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-655 dark:text-slate-350">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
