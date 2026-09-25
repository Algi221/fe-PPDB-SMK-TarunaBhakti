"use client";

import React from "react";
import { Check, X, Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Applicant, formatNoPendaftaran } from "../types";

interface StandardTableProps {
  paginatedApplicants: Applicant[];
  filteredApplicants: Applicant[];
  handleViewDetail: (a: Applicant) => void;
  openEdit: (a: Applicant) => void;
  verifyApplicant: (id: number) => void;
  setRejectingApplicantId: (id: number) => void;
  setRejectionReasonInput: (val: string) => void;
  deleteApplicant: (id: number) => void;
}

export default function StandardTable({
  paginatedApplicants,
  filteredApplicants,
  handleViewDetail,
  openEdit,
  verifyApplicant,
  setRejectingApplicantId,
  setRejectionReasonInput,
  deleteApplicant,
}: StandardTableProps) {
  return (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-slate-650 dark:text-slate-355">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/15">
                  <th className="py-4 px-6 pl-8">No. Pendaftaran</th>
                  <th className="py-4 px-6">Nama Calon Siswa</th>
                  <th className="py-4 px-6 text-center w-20">L/P</th>
                  <th className="py-4 px-6">Asal Sekolah</th>
                  <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right pr-8">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {paginatedApplicants.map((a: Applicant, idx: number) => (
                  <tr
                    key={a.id || idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-all group cursor-pointer"
                    onDoubleClick={() => handleViewDetail(a)}
                  >
                    <td className="py-4 px-6 pl-8">
                      <div className="font-extrabold text-blue-600 dark:text-blue-400 text-sm font-mono">{formatNoPendaftaran(a.periode, a.id)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-850 dark:text-white text-sm">{a.nama}</div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-555 font-bold tracking-wide uppercase mt-0.5 block">
                        Daftar: {new Date(a.tgl_daftar || a.createdAt || Date.now()).toLocaleDateString("id-ID")} · {a.gelombang || "Gelombang 1"} · Lahir: {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
                        {a.status === "Approved" && a.verified_by && ` · Diverifikasi: ${a.verified_by}`}
                        {a.status === "Rejected" && a.rejected_by && ` · Digugurkan: ${a.rejected_by}`}
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
                    <td className="py-4 px-6 text-right pr-8 shrink-0">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetail(a)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-355 hover:text-slate-850 dark:hover:text-white rounded-xl transition-all border border-slate-200/50 dark:border-white/5"
                          title="Lihat Detail Form"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={() => openEdit(a)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all border border-blue-200/50 dark:border-blue-500/20"
                          title="Edit Data Pendaftar"
                        >
                          <Pencil size={13} />
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
                            onClick={() => {
                               setRejectingApplicantId(a.id);
                               setRejectionReasonInput("");    
                            }}
                            className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all border border-rose-250 dark:border-rose-500/20"
                            title="Tolak Pendaftaran"
                          >
                            <X size={13} />
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: 'Konfirmasi',
                              text: "Apakah Anda yakin ingin menghapus data pendaftar ini secara permanen?",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Ya',
                              cancelButtonText: 'Batal'
                            });
                            if (result.isConfirmed) {
                              deleteApplicant(a.id);
                            }
                          }}
                          className="p-2 bg-slate-100 hover:bg-rose-500/10 dark:bg-slate-955/20 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 hover:border-rose-500/25"
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
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Tidak ditemukan data calon siswa yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  );
}
