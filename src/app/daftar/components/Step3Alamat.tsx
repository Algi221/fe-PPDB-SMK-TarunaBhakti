"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step3AlamatProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step3Alamat({ formData, handleInputChange }: Step3AlamatProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 3: Data Rincian (Data Periodik)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Mohon isi data periodik fisik dan perjalanan Anda ke sekolah.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Tinggi Badan (Cm)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="tinggiBadan" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 165" value={formData.tinggiBadan} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Cm</span>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Berat Badan (Kg)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="beratBadan" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 55" value={formData.beratBadan} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Kg</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jarak Rumah ke Sekolah</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jarakSekolah" value="Kurang dari 1 km" checked={formData.jarakSekolah === "Kurang dari 1 km"} onChange={handleInputChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-600">Kurang dari 1 Km</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jarakSekolah" value="Lebih dari 1 km" checked={formData.jarakSekolah === "Lebih dari 1 km"} onChange={handleInputChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-600">Lebih dari 1 Km</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Sebutkan Jarak Tepatnya (Km)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="jarakKm" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 3" value={formData.jarakKm} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Km</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Waktu Tempuh ke Sekolah</label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="waktuJam" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="0" value={formData.waktuJam} onChange={handleInputChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Jam</span>
                  </div>
                  <span className="text-slate-400 font-bold">:</span>
                  <div className="relative flex-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="waktuMenit" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="25" value={formData.waktuMenit} onChange={handleInputChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Menit</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jumlah Saudara Kandung</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="jumlahSaudara" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 2" value={formData.jumlahSaudara} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Orang</span>
                </div>
              </div>
            </div>
          </div>
  );
}
