"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step10WaliProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step10Wali({ formData, handleInputChange }: Step10WaliProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 10: Data Wali (Opsional)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi identitas lengkap wali murid (jika ada) sesuai dokumen resmi (KK/KTP).</p>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">J</span>
                Data Wali Peserta Didik
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Kosongkan jika tidak ada wali" value={formData.namaWali} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tempatLahirWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahirWali} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Agama</label>
                  <select name="agamaWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agamaWali} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.kewarganegaraanWali} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Pekerjaan" value={formData.pekerjaanWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.penghasilanWali} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatWali} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">RT/RW</label>
                    <input type="text" name="rtrwWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.rtrwWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kelurahanWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kecamatanWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kodePosWali} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusWali" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.statusWali} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
  );
}
