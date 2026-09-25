import React from "react";
import { Search, Filter, Download } from "lucide-react";
import { Applicant } from "./types";

interface ActiveStudentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  majorFilter: string;
  setMajorFilter: (major: string) => void;
  classFilter: string;
  setClassFilter: (cls: string) => void;
  genderFilter: string;
  setGenderFilter: (gender: string) => void;
  uniqueClasses: string[];
  classStats: Record<string, { L: number; P: number; total: number }>;
  onAddPeriodClick: () => void;
  onExportAllClick: () => void;
  filteredApplicants: Applicant[];
}

export const ActiveStudentFilters: React.FC<ActiveStudentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  majorFilter,
  setMajorFilter,
  classFilter,
  setClassFilter,
  genderFilter,
  setGenderFilter,
  uniqueClasses,
  classStats,
  onAddPeriodClick,
  onExportAllClick,
  filteredApplicants
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">
      <div className="w-full xl:w-auto flex flex-col md:flex-row items-center gap-3 flex-1">
        {/* Universal Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={16} />
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau asal sekolah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all"
          />
        </div>

        {/* Major/Prodi selection dropdown */}
        <div className="relative w-full md:w-80">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer uppercase tracking-wider"
          >
            <option value="ALL">Semua Jurusan</option>
            <option value="Rekayasa Perangkat Lunak">RPL / PPLG</option>
            <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT / TKJ</option>
            <option value="Desain Komunikasi Visual">DKV</option>
            <option value="Animasi">Animasi</option>
            <option value="Broadcasting & Perfilman">Broadcasting / BCF</option>
            <option value="Teknik Elektronika">Teknik Elektronika / TE</option>
          </select>
        </div>

        {/* Class selection dropdown */}
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer tracking-wider"
          >
            <option value="ALL">Semua Kelas</option>
            {uniqueClasses.map((kls) => (
              <option key={kls} value={kls}>
                {kls} (L: {classStats[kls].L}, P: {classStats[kls].P})
              </option>
            ))}
          </select>
        </div>

        {/* Gender selection dropdown */}
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer tracking-wider"
          >
            <option value="ALL">Semua Gender</option>
            <option value="L">Laki-Laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 w-full xl:w-auto">
        {/* Add Period Button */}
        <button
          onClick={onAddPeriodClick}
          className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          + Tambah Periode
        </button>

        {/* Global Export active students */}
        <button
          onClick={onExportAllClick}
          disabled={filteredApplicants.length === 0}
          className={`w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm ${
            filteredApplicants.length === 0
              ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border-transparent cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 hover:border-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.15)] cursor-pointer"
          }`}
        >
          <Download size={14} />
          Ekspor Semua Siswa
        </button>
      </div>
    </div>
  );
};
