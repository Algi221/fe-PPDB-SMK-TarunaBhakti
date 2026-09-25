"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step5PrestasiProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<PPDBFormData>>;
}

export default function Step5Prestasi({ formData, handleInputChange, setFormData }: Step5PrestasiProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 5: Data Prestasi (Opsional)</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Isi data prestasi yang pernah diraih. Klik &quot;Lewati&quot; jika tidak ada.</p>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-3">1. Jenis Prestasi</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Sains", "Seni", "Olahraga", "Lainnya"].map((option) => {
                  const isChecked = formData.jenisPrestasi?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
                      }`}>
                      <input type="checkbox" checked={isChecked} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        onChange={() => setFormData(prev => {
                          const cur = prev.jenisPrestasi || [];
                          return { ...prev, jenisPrestasi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-3">2. Tingkat</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Sekolah", "Kecamatan", "Kab/Kota", "Propinsi", "Nasional", "Internasional", "Lainnya"].map((option) => {
                  const isChecked = formData.tingkatPrestasi?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
                      }`}>
                      <input type="checkbox" checked={isChecked} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        onChange={() => setFormData(prev => {
                          const cur = prev.tingkatPrestasi || [];
                          return { ...prev, tingkatPrestasi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Uraian Prestasi</label>
                <input type="text" name="uraianPrestasi" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Juara 1 Olimpiade Matematika" value={formData.uraianPrestasi} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Tahun Prestasi</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunPrestasi" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: 2024" value={formData.tahunPrestasi} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Penyelenggara</label>
              <input type="text" name="penyelenggara" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Dinas Pendidikan Kota Depok" value={formData.penyelenggara} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Bukti Prestasi</label>
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
                <div className="shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 mb-1">Himbauan Sertifikat Prestasi</p>
                  <p className="text-xs text-amber-600 leading-relaxed">
                    Jika Anda memiliki sertifikat, piagam, atau bukti prestasi lainnya, harap <strong>membawa dokumen fisik asli ke sekolah</strong> pada saat daftar ulang. Dokumen akan diverifikasi oleh panitia PPDB secara langsung.
                  </p>
                </div>
              </div>
            </div>
          </div>
  );
}
