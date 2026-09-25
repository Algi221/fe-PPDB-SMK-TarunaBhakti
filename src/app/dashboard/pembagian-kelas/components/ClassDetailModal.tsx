"use client";

import React from "react";
import { Search, Download } from "lucide-react";
import { Applicant, ClassItem } from "../types";

interface ClassDetailModalProps {
  selectedClassDetail: ClassItem | null;
  onClose: () => void;
  enrolledStudentsInDetail: Applicant[];
  classSearchTerm: string;
  setClassSearchTerm: (val: string) => void;
  handleExportClassCSV: (className: string) => void;
  nipdMap: Map<number, string>;
  handleRemoveStudentFromClassDetail: (studentId: number, studentName: string) => void;
}

export default function ClassDetailModal({
  selectedClassDetail,
  onClose,
  enrolledStudentsInDetail,
  classSearchTerm,
  setClassSearchTerm,
  handleExportClassCSV,
  nipdMap,
  handleRemoveStudentFromClassDetail,
}: ClassDetailModalProps) {
  if (!selectedClassDetail) return null;

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/15">
              <div>
                <h3 className="text-base font-black text-slate-850 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                  <span>Daftar Kelas: {selectedClassDetail.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {enrolledStudentsInDetail.length} Siswa Terdaftar
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Daftar nama siswa resmi yang telah dimasukkan ke kelas ini</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white flex items-center justify-center transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Actions & Filter */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/5 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  value={classSearchTerm}
                  onChange={(e) => setClassSearchTerm(e.target.value)}
                  placeholder="Cari siswa di kelas..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <button
                onClick={() => handleExportClassCSV(selectedClassDetail.name)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border border-emerald-250 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Download size={14} />
                <span>Cetak Daftar Kelas (XLS)</span>
              </button>
            </div>

            {/* Modal Student Table */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[45vh]">
              <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-350">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest">
                    <th className="py-2.5 px-3 text-left w-12">No</th>
                    <th className="py-2.5 px-4 text-center">NIPD</th>
                    <th className="py-2.5 px-4">Nama Lengkap</th>
                    <th className="py-2.5 px-4 text-center w-16">L/P</th>
                    <th className="py-2.5 px-4 text-center">NISN</th>
                    <th className="py-2.5 px-4">Asal Sekolah</th>
                    <th className="py-2.5 px-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {enrolledStudentsInDetail.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                      <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{nipdMap.get(student.id) || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">{student.nama}</div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                          Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {(student.jenis_kelamin || student.jenisKelamin) ? (
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                            (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l")
                              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                          }`}>
                            {(student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px]">{student.nisn}</td>
                      <td className="py-3 px-4 uppercase">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleRemoveStudentFromClassDetail(student.id, student.nama)}
                          className="px-2.5 py-1 text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 transition-all"
                        >
                          Keluarkan
                        </button>
                      </td>
                    </tr>
                  ))}

                  {enrolledStudentsInDetail.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        Tidak ada data siswa yang cocok di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-slate-950/15 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
  );
}
