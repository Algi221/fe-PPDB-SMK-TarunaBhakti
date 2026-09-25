"use client";

import React from "react";
import { PPDBFormData } from "../types";
import { getMajorDetails, sanitizeSrc } from "../daftarUtils";

interface Step7PendidikanJurusanProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  majors: Array<{ code: string; title: string }>;
  kuotaData: any[] | null;
}

export default function Step7PendidikanJurusan({ formData, handleInputChange, majors, kuotaData }: Step7PendidikanJurusanProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 7: Data Rincian (Data Pendidikan)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Data riwayat pendidikan, status pindahan, dan peminatan kompetensi.</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">G</span>
                1. Pendidikan Sebelumnya
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">a. Lulusan dari SMP/MTs</label>
                  <input type="text" name="sekolahAsal" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nama sekolah asal" value={formData.sekolahAsal} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">b. Tanggal Lulus dari SMP/MTs</label>
                  <input type="date" name="tglLulus" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLulus} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">c. Nomor Seri Ijazah SMP/MTs</label>
                  <input type="text" name="noIjazah" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noIjazah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">d. Nomor Seri SKHUN SMP/MTs</label>
                  <input type="text" name="noSKHUN" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noSKHUN} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">e. Nomor Peserta UN SMP/MTs</label>
                  <input type="text" name="noPesertaUN" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noPesertaUN} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">f. Lama Belajar (Tahun)</label>
                  <div className="flex items-center gap-3">
                    <input type="number" name="lamaBelajar" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 3" value={formData.lamaBelajar} onChange={handleInputChange} />
                    <span className="text-sm font-bold text-slate-500">Tahun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Pindahan (Hanya Untuk Murid Pindahan)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">a. Dari SMP/MTs</label>
                  <input type="text" name="pindahanDari" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika bukan pindahan" value={formData.pindahanDari} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">b. Alasan Pindah Sekolah</label>
                  <input type="text" name="alasanPindah" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Opsional" value={formData.alasanPindah} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Diterima di Sekolah Ini
              </h4>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-3">a. Di Tingkat/Kelas</label>
                <div className="flex flex-wrap gap-3">
                  {["X (Sepuluh)", "XI (Sebelas)", "XII (Dua Belas)"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.diterimaKelas === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}>
                      <input
                        type="radio"
                        name="diterimaKelas"
                        value={option}
                        checked={formData.diterimaKelas === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-600 mb-3">b. Program Keahlian</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {majors.map((major) => {
                    const option = `${major.title} (${major.code})`;
                    const majorDetails = getMajorDetails(major.title || major.code);
                    
                    let isFull = false;
                    if (kuotaData) {
                      const k = kuotaData.find((k: any) => k.key === major.title);
                      if (k && k.target > 0) {
                        isFull = k.jumlah >= k.target;
                      }
                    }

                    return (
                      <label key={option} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                        isFull
                          ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed grayscale'
                          : formData.jurusan1 === option
                          ? `${majorDetails.bg} border-current ${majorDetails.textColor} shadow-md cursor-pointer ring-2 ring-current/20`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
                      }`}>
                        <input
                          type="radio"
                          name="jurusan1"
                          value={option}
                          checked={formData.jurusan1 === option && !isFull}
                          onChange={(e) => {
                            if (!isFull) handleInputChange(e);
                          }}
                          disabled={isFull}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 disabled:opacity-50 shrink-0"
                        />
                        {/* Logo jurusan */}
                        {majorDetails.logoPath ? (
                          <img
                            src={sanitizeSrc((major as any).logo) || majorDetails.logoPath}
                            alt={major.code}
                            className="w-9 h-9 object-contain rounded-lg shrink-0"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${majorDetails.bg}`}>
                            {majorDetails.icon}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-extrabold leading-tight">{option}</span>
                          <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                            isFull ? 'text-red-500' : majorDetails.textColor
                          }`}>
                            {isFull ? 'KUOTA PENUH' : major.code}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
  );
}
