"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step2KontakProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step2Kontak({ formData, handleInputChange }: Step2KontakProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 2: Data Tempat Tinggal</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Informasi alamat tempat tinggal dan kontak yang dapat dihubungi.</p>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Alamat Rumah (Jalan, No. Rumah)</label>
              <textarea name="alamat" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" rows={2} placeholder="Contoh: Jl. Pekapuran No. 10" value={formData.alamat} onChange={handleInputChange}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">RT / RW</label>
                <input type="text" name="rtRw" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 002/005" value={formData.rtRw} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kode Pos</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="kodePos" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 16453" value={formData.kodePos} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kelurahan</label>
                <input type="text" name="kelurahan" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Curug" value={formData.kelurahan} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kecamatan</label>
                <input type="text" name="kecamatan" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Cimanggis" value={formData.kecamatan} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor Telepon / HP Siswa</label>
                <input type="text" inputMode="tel" name="whatsapp" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 081234567890" value={formData.whatsapp} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor Telepon Orang Tua (Ayah/Ibu/Wali)</label>
                <input type="text" inputMode="tel" name="teleponOrtu" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nomor yang mudah dihubungi" value={formData.teleponOrtu} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">E-mail Pribadi Siswa</label>
                <input type="email" name="email" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="nama@email.com" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Tinggal Bersama dengan</label>
                <select name="tinggalDengan" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.tinggalDengan} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Saudara">Saudara</option>
                  <option value="Kos/Asrama">Kos / Asrama</option>
                  <option value="Wali">Wali</option>
                  <option value="Panti Asuhan">Panti Asuhan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Moda Transportasi</label>
                <select name="transportasi" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.transportasi} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Jalan Kaki">Jalan Kaki</option>
                  <option value="Angkutan Umum">Angkutan Umum</option>
                  <option value="Mobil Antar Jemput">Mobil Antar Jemput</option>
                  <option value="Kereta Api">Kereta Api</option>
                  <option value="Mobil Pribadi">Mobil Pribadi</option>
                  <option value="Sepeda Motor">Sepeda Motor</option>
                  <option value="Sepeda">Sepeda</option>
                  <option value="Ojek">Ojek</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
  );
}
