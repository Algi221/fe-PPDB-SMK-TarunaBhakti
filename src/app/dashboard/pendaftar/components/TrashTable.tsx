"use client";

import React from "react";
import { Applicant } from "../types";

interface TrashTableProps {
  trashLoading: boolean;
  trashedApplicants: Applicant[];
  handleRestoreApplicant: (id: number) => void;
  handlePermanentDeleteApplicant: (id: number) => void;
}

export default function TrashTable({
  trashLoading,
  trashedApplicants,
  handleRestoreApplicant,
  handlePermanentDeleteApplicant,
}: TrashTableProps) {
  return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl backdrop-blur-md overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
          {trashLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat data sampah...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-355">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/15">
                    <th className="py-4 px-6 pl-8">Nama Calon Siswa</th>
                    <th className="py-4 px-6 text-center w-20">L/P</th>
                    <th className="py-4 px-6">Asal Sekolah</th>
                    <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                    <th className="py-4 px-6 text-center">Status Sebelumnya</th>
                    <th className="py-4 px-6 text-right pr-8">Aksi Pemulihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {trashedApplicants.map((a: Applicant, idx: number) => (
                    <tr key={a.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-all">
                      <td className="py-4 px-6 pl-8">
                        <div className="font-extrabold text-slate-850 dark:text-white text-sm">{a.nama}</div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-555 font-bold tracking-wide uppercase mt-0.5 block">
                          NISN: {a.nisn} · Lahir: {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
                          {a.deleted_by && ` · Dihapus: ${a.deleted_by}`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {(a.jenis_kelamin || a.jenisKelamin) ? (
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                            (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
                              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                          }`}>
                            {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">{a.sekolah_asal || a.sekolahAsal}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50/70 dark:bg-blue-950/40 text-blue-550 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 font-extrabold text-[9px] uppercase tracking-wide">
                          {a.jurusan_1 || a.jurusan1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${a.status === "Approved"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                              : a.status === "Rejected"
                                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                                : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                            }`}
                        >
                          {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestoreApplicant(a.id)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                            title="Pulihkan Calon Siswa"
                          >
                            Pulihkan
                          </button>
                          
                          <button
                            onClick={() => handlePermanentDeleteApplicant(a.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                            title="Hapus Permanen"
                          >
                            Hapus Permanen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {trashedApplicants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                        Tempat sampah kosong.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
  );
}
