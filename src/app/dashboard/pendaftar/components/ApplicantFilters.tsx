"use client";

import React from "react";
import { Search, Filter, Layers, User, TableProperties, FileSpreadsheet, Download } from "lucide-react";

interface ApplicantFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  majorFilter: string;
  setMajorFilter: (val: string) => void;
  majorsList: string[];
  gelombangFilter: string;
  setGelombangFilter: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  isSpreadsheetMode: boolean;
  setIsSpreadsheetMode: (val: boolean) => void;
  exportToExcel: () => void;
  hasApplicants: boolean;
}

export default function ApplicantFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  majorFilter,
  setMajorFilter,
  majorsList,
  gelombangFilter,
  setGelombangFilter,
  genderFilter,
  setGenderFilter,
  isSpreadsheetMode,
  setIsSpreadsheetMode,
  exportToExcel,
  hasApplicants,
}: ApplicantFiltersProps) {
  return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">

        {/* Search Field */}
        <div className="relative w-full xl:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-550">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari: nama, jurusan, sekolah, gelombang..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-655 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
          />
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl px-3 py-1.5 shrink-0">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-350 text-xs focus:outline-none transition-all font-extrabold uppercase tracking-wide cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="Pending">Menunggu Verifikasi</option>
              <option value="Approved">Terverifikasi</option>
              <option value="Rejected">Ditolak / Gugur</option>
            </select>
          </div>

          {/* Major Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl px-3 py-1.5 shrink-0">
            <Layers size={13} className="text-slate-400" />
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-350 text-xs focus:outline-none transition-all font-extrabold uppercase tracking-wide cursor-pointer max-w-[160px]"
            >
              <option value="ALL">Semua Jurusan</option>
              {majorsList.map((m, idx) => (
                <option key={idx} value={m}>
                  {m.replace("Teknik ", "").replace("Komunikasi ", "")}
                </option>
              ))}
            </select>
          </div>

          {/* Gelombang Filter Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-955 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5 shrink-0 shadow-inner">
            {[
              { id: "ALL", label: "Semua Gelombang" },
              { id: "Gelombang 1", label: "Gelombang 1" },
              { id: "Gelombang 2", label: "Gelombang 2" }
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGelombangFilter(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  gelombangFilter === g.id
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm border border-slate-200/40 dark:border-white/5"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl px-3 py-1.5 shrink-0">
            <User size={13} className="text-slate-400" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-350 text-xs focus:outline-none transition-all font-extrabold uppercase tracking-wide cursor-pointer max-w-[140px]"
            >
              <option value="ALL">Semua Gender</option>
              <option value="L">Laki-Laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Toggle View: Standard Table vs Excel Spreadsheet Grid */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 shrink-0 shadow-inner">
            <button
              onClick={() => setIsSpreadsheetMode(false)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${!isSpreadsheetMode
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm border border-slate-200/40 dark:border-white/5"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              title="Tampilan Tabel Standard"
            >
              <TableProperties size={14} />
              <span className="hidden sm:inline">Standard</span>
            </button>
            <button
              onClick={() => setIsSpreadsheetMode(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isSpreadsheetMode
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm border border-slate-200/40 dark:border-white/5"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              title="Tampilan Excel Sheet Mode"
            >
              <FileSpreadsheet size={14} className="text-emerald-500" />
              <span className="hidden sm:inline text-emerald-500">Excel Mode</span>
            </button>
          </div>

          {/* Export formatted CSV/Spreadsheet button */}
          <button
            onClick={exportToExcel}
            disabled={!hasApplicants}
            className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/50 hover:bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            <span>Export XLS</span>
          </button>
        </div>
      </div>
  );
}
