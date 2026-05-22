"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Search, 
  Filter, 
  Download, 
  Grid, 
  TableProperties, 
  CloudLightning, 
  FileSpreadsheet, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Heart,
  HelpCircle,
  FileCheck,
  User,
  Users
} from "lucide-react";

export default function ApplicantsDirectory() {
  const { applicants, verifyApplicant, rejectApplicant, deleteApplicant } = usePPDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [majorFilter, setMajorFilter] = useState("ALL");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [activeTab, setActiveTab] = useState("biodata");
  
  // New Interactive Spreadsheet Mode State
  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState(false);
  const [activeCell, setActiveCell] = useState(null); // { row, col }

  // Simulated Google Sheets Webhook Sync States
  const [syncStatus, setSyncStatus] = useState("IDLE"); // 'IDLE' | 'SYNCING' | 'SUCCESS'
  const [syncProgress, setSyncProgress] = useState(0);

  const majorsList = [
    "Rekayasa Perangkat Lunak",
    "Teknik Jaringan Komputer & Telekomunikasi",
    "Desain Komunikasi Visual",
    "Broadcasting & Perfilman",
    "Teknik Elektronika",
    "Animasi"
  ];

  // Filtering Logic
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nisn?.includes(searchTerm) ||
      (a.sekolah_asal || a.sekolahAsal)?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      a.status === statusFilter ||
      (statusFilter === "Pending" && (!a.status || a.status === "Pending"));

    const matchesMajor =
      majorFilter === "ALL" ||
      a.jurusan_1 === majorFilter ||
      a.jurusan1 === majorFilter;

    return matchesSearch && matchesStatus && matchesMajor;
  });

  // Simulated Google Sheets Webhook Sync trigger
  const triggerGoogleSheetsSync = () => {
    if (filteredApplicants.length === 0) return;
    setSyncStatus("SYNCING");
    setSyncProgress(0);
  };

  useEffect(() => {
    let interval;
    if (syncStatus === "SYNCING") {
      interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSyncStatus("SUCCESS");
            setTimeout(() => setSyncStatus("IDLE"), 4000);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [syncStatus]);

  // Export to CSV Function with Auto-Formatting
  const exportToCSV = () => {
    if (filteredApplicants.length === 0) return;

    const headers = [
      "Nama Lengkap",
      "NISN",
      "NIK",
      "Asal Sekolah",
      "Program Studi Pilihan 1",
      "Program Studi Pilihan 2",
      "No. WhatsApp",
      "Email",
      "Status Verifikasi",
      "Tanggal Mendaftar"
    ];

    const rows = filteredApplicants.map((a) => [
      `"${a.nama || ''}"`,
      `"${a.nisn || ''}"`,
      `"${a.nik || ''}"`,
      `"${a.sekolah_asal || a.sekolahAsal || ''}"`,
      `"${a.jurusan_1 || a.jurusan1 || ''}"`,
      `"${a.jurusan_2 || a.jurusan2 || ''}"`,
      `"${a.whatsapp || ''}"`,
      `"${a.email || ''}"`,
      `"${a.status || 'Pending'}"`,
      `"${a.tgl_daftar || a.createdAt || ''}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ppdb_taruna_bhakti_spreadsheet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // spreadsheet columns description helper
  const spreadsheetCols = [
    { label: "NAMA LENGKAP", accessor: (a) => a.nama },
    { label: "NISN", accessor: (a) => a.nisn, mono: true },
    { label: "ASAL SEKOLAH", accessor: (a) => a.sekolah_asal || a.sekolahAsal },
    { label: "JURUSAN UTAMA", accessor: (a) => a.jurusan_1 || a.jurusan1 },
    { label: "NO. WHATSAPP", accessor: (a) => a.whatsapp, mono: true },
    { label: "STATUS", accessor: (a) => a.status || "Pending" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      
      {/* Search, Filter & Spreadsheet Toggle Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">
        
        {/* Search Field */}
        <div className="relative w-full xl:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pendaftar, NISN, atau sekolah asal..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
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

          {/* Togle View: Standard Table vs Excel Spreadsheet Grid */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 shrink-0 shadow-inner">
            <button
              onClick={() => setIsSpreadsheetMode(false)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                !isSpreadsheetMode
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isSpreadsheetMode
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm border border-slate-200/40 dark:border-white/5"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
              title="Tampilan Spreadsheet Google Sheets"
            >
              <FileSpreadsheet size={14} className="text-emerald-500" />
              <span className="hidden sm:inline text-emerald-500">Spreadsheet</span>
            </button>
          </div>

          {/* Google Sheets Sync Webhook Action Trigger */}
          <button
            onClick={triggerGoogleSheetsSync}
            disabled={filteredApplicants.length === 0 || syncStatus === "SYNCING"}
            className={`px-4 py-3 bg-gradient-to-tr transition-all rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 shadow-sm flex items-center gap-2 border ${
              syncStatus === "SUCCESS"
                ? "from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                : syncStatus === "SYNCING"
                ? "from-blue-500 to-sky-400 text-white opacity-80 cursor-wait border-blue-600"
                : "from-blue-50/50 to-blue-50 dark:from-slate-950 dark:to-slate-950 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 border-blue-500/10 dark:border-white/5"
            }`}
          >
            <CloudLightning size={14} className={syncStatus === "SYNCING" ? "animate-bounce" : ""} />
            <span>
              {syncStatus === "SYNCING" 
                ? `Syncing (${syncProgress}%)` 
                : syncStatus === "SUCCESS"
                ? "Auto-Synced!"
                : "Sheets Sync"}
            </span>
          </button>

          {/* Export formatted CSV/Spreadsheet button */}
          <button
            onClick={exportToCSV}
            disabled={filteredApplicants.length === 0}
            className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/50 hover:bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            <span>Export XLS</span>
          </button>
        </div>
      </div>

      {/* Primary Data Grid (Standard vs Spreadsheet Mode views) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl backdrop-blur-md overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        
        {!isSpreadsheetMode ? (
          /* STANDARD TABLE VIEW */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-slate-650 dark:text-slate-350">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/15">
                  <th className="py-4 px-6 pl-8">Nama Calon Siswa</th>
                  <th className="py-4 px-6">NISN / NIK</th>
                  <th className="py-4 px-6">Asal Sekolah</th>
                  <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right pr-8">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredApplicants.map((a, idx) => (
                  <tr
                    key={a.id || idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-all group cursor-pointer"
                    onDoubleClick={() => setSelectedApplicant(a)}
                  >
                    <td className="py-4 px-6 pl-8">
                      <div className="font-extrabold text-slate-850 dark:text-white text-sm">{a.nama}</div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold tracking-wide uppercase mt-0.5 block">
                        Daftar: {new Date(a.tgl_daftar || a.createdAt || Date.now()).toLocaleDateString("id-ID")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">{a.nisn}</div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono font-semibold tracking-wide">{a.nik || "NIK Kosong"}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">{a.sekolah_asal || a.sekolahAsal}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50/70 dark:bg-blue-950/40 text-blue-550 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 font-extrabold text-[9px] uppercase tracking-wide">
                        {a.jurusan_1 || a.jurusan1}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                          a.status === "Approved"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                            : a.status === "Rejected"
                            ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                            : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right pr-8 shrink-0">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedApplicant(a)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-350 hover:text-slate-850 dark:hover:text-white rounded-xl transition-all border border-slate-200/50 dark:border-white/5"
                          title="Lihat Detail Form"
                        >
                          <Eye size={13} />
                        </button>

                        {a.status !== "Approved" && (
                          <button
                            onClick={() => verifyApplicant(a.id)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl transition-all border border-emerald-250 dark:border-emerald-500/20"
                            title="Setujui & Verifikasi"
                          >
                            <Check size={13} />
                          </button>
                        )}

                        {a.status !== "Rejected" && (
                          <button
                            onClick={() => rejectApplicant(a.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all border border-rose-250 dark:border-rose-500/20"
                            title="Tolak Pendaftaran"
                          >
                            <X size={13} />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm("Apakah Anda yakin ingin menghapus data pendaftar ini secara permanen?")) {
                              deleteApplicant(a.id);
                            }
                          }}
                          className="p-2 bg-slate-100 hover:bg-rose-500/10 dark:bg-slate-950/20 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 hover:border-rose-500/25"
                          title="Hapus Permanen"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Tidak ditemukan data calon siswa yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* INTERACTIVE EXCEL SPREADSHEET GRID VIEW */
          <div className="overflow-x-auto">
            <div className="bg-[#f8fafc] dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 p-2.5 text-[10px] font-bold font-mono tracking-widest flex items-center justify-between shrink-0">
              <span className="flex items-center gap-2">
                <FileSpreadsheet size={13} className="text-emerald-500" />
                <span>SHEETS1 : PPDB_SMK_TARUNABHAKTI_2026.XLSX</span>
              </span>
              <span className="text-slate-400 dark:text-slate-650">Buka baris dengan double-click untuk Verifikasi Dokumen</span>
            </div>
            
            <table className="w-full text-left text-xs font-semibold text-slate-650 dark:text-slate-350 border-collapse table-fixed">
              <thead>
                {/* Column Headers (Alphabetical A-G) */}
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/60 font-mono text-[10px] tracking-wide text-slate-500">
                  <th className="py-2 px-2 text-center w-12 border-r border-slate-200 dark:border-slate-800">#</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 w-8 flex-none text-center">A</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[220px]">B (NAMA_LENGKAP)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[120px] text-center">C (NISN)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[200px]">D (ASAL_SEKOLAH)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[180px]">E (JURUSAN_UTAMA)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[130px] text-center">F (NO_WA)</th>
                  <th className="py-2 px-4 w-[120px] text-center">G (STATUS)</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a, rowIdx) => (
                  <tr
                    key={a.id || rowIdx}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-colors duration-150"
                    onDoubleClick={() => setSelectedApplicant(a)}
                  >
                    {/* Row Index Number */}
                    <td className="py-2.5 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-slate-400 font-bold">
                      {rowIdx + 1}
                    </td>

                    {/* Checkbox A */}
                    <td className="py-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 w-3 h-3 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    {/* Column B: Nama */}
                    <td 
                      onClick={() => setActiveCell({ row: rowIdx, col: 1 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white font-extrabold text-sm ${
                        activeCell?.row === rowIdx && activeCell?.col === 1 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                      }`}
                    >
                      {a.nama}
                    </td>

                    {/* Column C: NISN */}
                    <td 
                      onClick={() => setActiveCell({ row: rowIdx, col: 2 })}
                      className={`py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-slate-650 dark:text-slate-300 text-[11px] ${
                        activeCell?.row === rowIdx && activeCell?.col === 2 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                      }`}
                    >
                      {a.nisn}
                    </td>

                    {/* Column D: Sekolah */}
                    <td 
                      onClick={() => setActiveCell({ row: rowIdx, col: 3 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 font-semibold ${
                        activeCell?.row === rowIdx && activeCell?.col === 3 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                      }`}
                    >
                      {a.sekolah_asal || a.sekolahAsal}
                    </td>

                    {/* Column E: Jurusan */}
                    <td 
                      onClick={() => setActiveCell({ row: rowIdx, col: 4 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[10px] ${
                        activeCell?.row === rowIdx && activeCell?.col === 4 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                      }`}
                    >
                      {a.jurusan_1 || a.jurusan1}
                    </td>

                    {/* Column F: WA */}
                    <td 
                      onClick={() => setActiveCell({ row: rowIdx, col: 5 })}
                      className={`py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-slate-650 dark:text-slate-300 text-[11px] ${
                        activeCell?.row === rowIdx && activeCell?.col === 5 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                      }`}
                    >
                      {a.whatsapp || "-"}
                    </td>

                    {/* Column G: Status */}
                    <td 
                      onClick={() => setActiveCell({ row: rowIdx, col: 6 })}
                      className={`py-2.5 px-4 text-center text-[10px] font-extrabold uppercase tracking-widest ${
                        a.status === "Approved"
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                          : a.status === "Rejected"
                          ? "text-rose-600 dark:text-rose-400 bg-rose-500/5"
                          : "text-amber-600 dark:text-amber-400 bg-amber-500/5"
                      } ${
                        activeCell?.row === rowIdx && activeCell?.col === 6 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                      }`}
                    >
                      {a.status || "Pending"}
                    </td>
                  </tr>
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-12 font-mono text-slate-450 italic uppercase bg-slate-50/50 dark:bg-slate-950/20">
                      Zero lines of data found. Filter criteria matches nothing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Google Sheets Sync Simulation progress banner overlay */}
      {syncStatus === "SYNCING" && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161f2e] border border-blue-500/30 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] w-80 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 mb-2">
            <CloudLightning className="text-blue-400 animate-bounce shrink-0" size={18} />
            <h4 className="text-xs font-black uppercase text-white tracking-widest leading-none">Auto-Syncing Sheets</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold pl-7 mb-3 leading-snug">Menyinkronkan data PPDB siswa ke Google Spreadsheet...</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden pl-7">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${syncProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Beautiful Rich Detail Modal (13 Wizard Steps tabs overlay) */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/15">
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                  <span>{selectedApplicant.nama}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                      selectedApplicant.status === "Approved"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : selectedApplicant.status === "Rejected"
                        ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                        : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-1">NISN: {selectedApplicant.nisn} · Asal: {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white flex items-center justify-center transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-950/10 px-6 overflow-x-auto shrink-0 scrollbar-none">
              {[
                { id: "biodata", label: "Bio Diri & Kontak" },
                { id: "periodik", label: "Periodik & Kesehatan" },
                { id: "bantuan", label: "Bantuan & Prestasi" },
                { id: "orangtua", label: "Orang Tua / Wali" },
                { id: "akademik", label: "Akademik & Jurusan" },
                { id: "pernyataan", label: "Komitmen & Janji" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-3.5 text-xs font-black whitespace-nowrap transition-all border-b-2 uppercase tracking-wider ${
                    activeTab === t.id
                      ? "border-blue-500 text-blue-600 dark:text-white"
                      : "border-transparent text-slate-450 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-8 text-xs leading-relaxed text-slate-650 dark:text-slate-350 font-bold max-h-[50vh] transition-colors duration-300">
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Identitas Diri
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white text-sm font-extrabold">{selectedApplicant.nama}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span> <span className="text-slate-800 dark:text-white font-mono font-extrabold">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tempat, Tanggal Lahir</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jenis Kelamin / Agama</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Info size={12} className="text-blue-500" /> Alamat & Kontak
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">WhatsApp / Email</span> <span className="text-blue-600 dark:text-blue-400 text-sm font-mono font-extrabold">{selectedApplicant.whatsapp} / {selectedApplicant.email}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Alamat Tempat Tinggal</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Kelurahan / Kecamatan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tinggal Dengan / Transportasi</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Calendar size={12} className="text-blue-500" /> Data Fisik & Periodik
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Heart size={12} className="text-blue-500" /> Kondisi Kesehatan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span> <span className="text-slate-800 dark:text-white font-extrabold uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span></div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block mb-1.5 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase">{k}</span>
                          )) : <span className="text-slate-450 italic font-semibold">Tidak Ada</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bantuan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <HelpCircle size={12} className="text-blue-500" /> Jaminan Sosial / Bantuan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Prestasi & Beasiswa
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ayah Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pendidikan_ayah || selectedApplicant.pendidikanAyah || "-"} / {selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ibu Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Users size={12} className="text-blue-500" /> Wali & Kontak Darurat
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span> <span className="text-blue-600 dark:text-blue-450 font-mono text-sm font-extrabold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Info size={12} className="text-blue-500" /> Pendidikan Asal
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span> <span className="text-slate-850 dark:text-white text-sm font-extrabold">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span> <span className="text-slate-800 dark:text-white font-mono font-extrabold">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Pilihan Minat Studi
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Utama</span> <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Cadangan</span> <span className="text-slate-500 dark:text-slate-400 text-sm font-extrabold uppercase">{selectedApplicant.jurusan_2 || selectedApplicant.jurusan2}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pernyataan" && (
                <div className="space-y-6">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileCheck size={12} className="text-blue-500" /> Komitmen & Janji Kedisiplinan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
                    <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Calon Taruna Baru:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-650 dark:text-slate-350">
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15 flex items-center justify-between shrink-0">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">ID_SISWA: #{selectedApplicant.id}</span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-350 hover:text-slate-850 dark:hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-white/5"
                >
                  Tutup
                </button>

                {selectedApplicant.status !== "Approved" && (
                  <button
                    onClick={() => {
                      verifyApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                  >
                    Verifikasi Lolos
                  </button>
                )}

                {selectedApplicant.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      rejectApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] flex items-center gap-1.5"
                  >
                    Tolak / Gugurkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
