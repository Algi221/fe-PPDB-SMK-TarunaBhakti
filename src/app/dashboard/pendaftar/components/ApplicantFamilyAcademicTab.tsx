"use client";

import React from "react";
import { HelpCircle, Layers, User, Users, Info, FileCheck } from "lucide-react";
import { Applicant } from "../types";

interface ApplicantFamilyAcademicTabProps {
  activeTab: string;
  selectedApplicant: Applicant;
}

export default function ApplicantFamilyAcademicTab({
  activeTab,
  selectedApplicant,
}: ApplicantFamilyAcademicTabProps) {
  if (activeTab === "bantuan") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
              <HelpCircle size={12} />
            </div>
            Jaminan Sosial / Bantuan
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">
                {selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">
                {selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Layers size={12} />
            </div>
            Beasiswa & Prestasi
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "orangtua") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <User size={12} />
            </div>
            Ayah Kandung
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
              <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500">
              <User size={12} />
            </div>
            Ibu Kandung
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
              <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500">
              <Users size={12} />
            </div>
            Wali & Kontak Darurat
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span>
              <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono text-sm font-black">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "akademik") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Info size={12} />
            </div>
            Pendidikan Asal
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span>
              <span className="text-slate-850 dark:text-white text-sm font-black">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span>
              <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Layers size={12} />
            </div>
            Pilihan Minat Studi
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/10 shadow-sm">
              <span className="text-blue-500 dark:text-blue-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Utama</span>
              <span className="text-blue-700 dark:text-blue-300 text-sm font-black uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-orange-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span>
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
            <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
            <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
            <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
            <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
            <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
          </div>
        </div>

        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
          <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Calon Taruna Baru:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-655 dark:text-slate-350">
            <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
