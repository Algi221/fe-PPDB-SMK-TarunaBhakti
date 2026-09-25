"use client";

import React from "react";
import { User, Info, Calendar, Heart } from "lucide-react";
import { Applicant } from "../types";

interface ApplicantBiodataPeriodikTabProps {
  activeTab: string;
  selectedApplicant: Applicant;
}

export default function ApplicantBiodataPeriodikTab({
  activeTab,
  selectedApplicant,
}: ApplicantBiodataPeriodikTabProps) {
  if (activeTab === "biodata") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <User size={12} />
            </div>
            Identitas Diri
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
              <span className="text-slate-850 dark:text-white text-sm font-black">{selectedApplicant.nama}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span>
              <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tempat, Tanggal Lahir</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Kelamin / Agama</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Info size={12} />
            </div>
            Alamat & Kontak
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">WhatsApp / Email</span>
              <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-black">{selectedApplicant.whatsapp} / {selectedApplicant.email}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alamat Tempat Tinggal</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Kelurahan / Kecamatan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
              <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggal Dengan / Transportasi</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "periodik") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Calendar size={12} />
            </div>
            Data Fisik & Periodik
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Heart size={12} />
            </div>
            Kondisi Kesehatan
          </h4>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span>
              <span className="text-slate-800 dark:text-white font-black text-xs uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span>
              <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {Array.isArray(selectedApplicant.kebutuhan_khusus) ? (
                  selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                    <span key={idx} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {k}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 italic text-xs">Tidak Ada</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
