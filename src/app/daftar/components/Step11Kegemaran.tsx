"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step11KegemaranProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<PPDBFormData>>;
}

export default function Step11Kegemaran({ formData, handleInputChange, setFormData }: Step11KegemaranProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 11: Data Kegemaran & Minat</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi data hobi, cita-cita, dan minat bakat siswa.</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">K</span>
                Data Kegemaran Peserta Didik
              </h4>
              <div className="form-group mb-5">
                <label className="block text-xs font-bold text-slate-600 mb-3">1. Hobi</label>
                <div className="flex flex-wrap gap-3">
                  {["Olahraga", "Kesenian", "Membaca", "Menulis", "Travelling", "Lainnya"].map((option) => {
                    const isChecked = formData.hobi?.includes(option) || false;
                    return (
                      <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}>
                        <input type="checkbox" checked={isChecked} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          onChange={() => setFormData(prev => {
                            const cur = prev.hobi || [];
                            return { ...prev, hobi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                          })}
                          />
                        <span className="text-xs font-bold">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-3">2. Cita-cita</label>
                <select name="citaCita" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.citaCita} onChange={handleInputChange}>
                  <option value="">-- Pilih Cita-cita --</option>
                  <option value="PNS">PNS</option>
                  <option value="TNI/POLRI">TNI/POLRI</option>
                  <option value="Guru/Dosen">Guru/Dosen</option>
                  <option value="Dokter">Dokter</option>
                  <option value="Politikus">Politikus</option>
                  <option value="Wiraswasta">Wiraswasta</option>
                  <option value="Seni Lukis/Artis">Seni Lukis/Artis/Sejenisnya</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">L</span>
                Data Minat dan Kemampuan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Nilai US (Teori)</label>
                  <input type="number" name="nilaiUSTeori" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.nilaiUSTeori} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Nilai US (Praktik)</label>
                  <input type="number" name="nilaiUSPraktik" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.nilaiUSPraktik} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Nilai Muatan Lokal</label>
                <input type="number" name="nilaiMuatanLokal" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.nilaiMuatanLokal} onChange={handleInputChange} />
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Memilih SMK Taruna Bhakti Karena</label>
                <div className="flex gap-4">
                  {["Diri Sendiri", "Orang Tua/Wali"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.alasanMemilih === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="alasanMemilih" value={option} checked={formData.alasanMemilih === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Cita-cita Setelah Lulus SMK</label>
                <input type="text" name="citaCitaSetelahLulus" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Kuliah / Bekerja di Industri" value={formData.citaCitaSetelahLulus} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Pelajaran Yg Disenangi di SMP/MTs</label>
                  <input type="text" name="pelajaranDisenangi" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Matematika" value={formData.pelajaranDisenangi} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Alasan Disenangi</label>
                  <input type="text" name="alasanDisenangi" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Alasan" value={formData.alasanDisenangi} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Kesulitan Belajar di SMP/MTs</label>
                <input type="text" name="kesulitanBelajar" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Ada hambatan/kesulitan apa?" value={formData.kesulitanBelajar} onChange={handleInputChange} />
              </div>
            </div>
          </div>
  );
}
