"use client";

import React from "react";
import { Check, X, Eye, Pencil, Trash2, FileSpreadsheet } from "lucide-react";
import Swal from "sweetalert2";
import { Applicant, formatNoPendaftaran } from "../types";

interface SpreadsheetTableProps {
  paginatedApplicants: Applicant[];
  filteredApplicants: Applicant[];
  currentPage: number;
  itemsPerPage: number;
  handleViewDetail: (a: Applicant) => void;
}

export default function SpreadsheetTable({
  paginatedApplicants,
  filteredApplicants,
  currentPage,
  itemsPerPage,
  handleViewDetail,
}: SpreadsheetTableProps) {
  const [activeCell, setActiveCell] = React.useState<{ row: number; col: number } | null>(null);

  return (
          <div className="overflow-x-auto">
            <div className="bg-[#f8fafc] dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 p-2.5 text-[10px] font-bold font-mono tracking-widest flex items-center justify-between shrink-0">
              <span className="flex items-center gap-2">
                <FileSpreadsheet size={13} className="text-emerald-500" />
                <span>EXCEL MODE : PPDB_SMK_TARUNABHAKTI_2026.XLSX</span>
              </span>
              <span className="text-slate-400 dark:text-slate-655">Double-click baris untuk Verifikasi Dokumen</span>
            </div>

            <table className="w-full text-left text-xs font-semibold text-slate-650 dark:text-slate-355 border-collapse table-fixed">
              <thead>
                {/* Column Headers (Alphabetical A-G) */}
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/60 font-mono text-[10px] tracking-wide text-slate-500">
                  <th className="py-2 px-2 text-center w-12 border-r border-slate-200 dark:border-slate-800">#</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 w-8 flex-none text-center">A</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-55">B (NAMA_LENGKAP)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-50">C (ASAL_SEKOLAH)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-45">D (JURUSAN_UTAMA)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-32.5 text-center font-mono">E (NO_WA)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-30 text-center font-mono">F (STATUS)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-40 text-center font-mono">G (TANGGAL_LAHIR)</th>
                  <th className="py-2 px-4 w-15 text-center font-mono">H (L/P)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplicants.map((a: Applicant, rowIdx: number) => (
                  <tr
                    key={a.id || rowIdx}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-colors duration-150"
                    onDoubleClick={() => handleViewDetail(a)}
                  >
                    {/* Row Index Number */}
                    <td className="py-2.5 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-slate-400 font-bold">
                      {(currentPage - 1) * itemsPerPage + rowIdx + 1}
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
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white font-extrabold text-sm ${activeCell?.row === rowIdx && activeCell?.col === 1 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.nama}
                    </td>

                    {/* Column C: Sekolah */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 3 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 font-semibold ${activeCell?.row === rowIdx && activeCell?.col === 3 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.sekolah_asal || a.sekolahAsal}
                    </td>

                    {/* Column D: Jurusan */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 4 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[10px] ${activeCell?.row === rowIdx && activeCell?.col === 4 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.jurusan_1 || a.jurusan1}
                    </td>

                    {/* Column E: WA */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 5 })}
                      className={`py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-slate-655 dark:text-slate-300 text-[11px] ${activeCell?.row === rowIdx && activeCell?.col === 5 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.whatsapp || "-"}
                    </td>

                    {/* Column F: Status */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 6 })}
                      className={`py-2.5 px-4 text-center text-[10px] font-extrabold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 ${a.status === "Approved"
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                          : a.status === "Rejected"
                            ? "text-rose-600 dark:text-rose-400 bg-rose-500/5"
                            : "text-amber-600 dark:text-amber-400 bg-amber-500/5"
                        } ${activeCell?.row === rowIdx && activeCell?.col === 6 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.status || "Pending"}
                    </td>

                    {/* Column G: Tanggal Lahir */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 7 })}
                      className={`py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-600 dark:text-slate-355 ${activeCell?.row === rowIdx && activeCell?.col === 7 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.tgl_lahir || a.tglLahir || "-"}
                    </td>

                    {/* Column H: Gender */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 8 })}
                      className={`py-2.5 px-4 text-center text-xs font-mono font-bold text-slate-600 dark:text-slate-355 ${activeCell?.row === rowIdx && activeCell?.col === 8 ? "bg-blue-500/10 outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {(a.jenis_kelamin || a.jenisKelamin) ? (
                        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border shadow-sm ${
                          (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                            : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                        }`}>
                          {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                        </span>
                      ) : "-"}
                    </td>
                  </tr>
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 font-mono text-slate-450 italic uppercase bg-slate-50/50 dark:bg-slate-950/20">
                      Zero lines of data found. Filter criteria matches nothing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  );
}
