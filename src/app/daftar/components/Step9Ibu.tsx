"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step9IbuProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step9Ibu({ formData, handleInputChange }: Step9IbuProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 9: Data Ibu Kandung</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi identitas lengkap ibu kandung sesuai dokumen resmi (KK/KTP).</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">I</span>
                Data Ibu Kandung
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KTP/KK" value={formData.namaIbu} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tempatLahirIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahirIbu} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Agama</label>
                  <select name="agamaIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agamaIbu} onChange={handleInputChange}>
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
                  <select name="kewarganegaraanIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.kewarganegaraanIbu} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Pekerjaan" value={formData.pekerjaanIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.penghasilanIbu} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatIbu} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">RT/RW</label>
                    <input type="text" name="rtrwIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.rtrwIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kelurahanIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kecamatanIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.kodePosIbu} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusIbu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.statusIbu} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
  );
}
