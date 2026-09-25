"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step4KesehatanProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (val: string) => void;
}

export default function Step4Kesehatan({ formData, handleInputChange, handleCheckboxChange }: Step4KesehatanProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 4: Data Kesehatan & Berkebutuhan Khusus</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Mohon isi data golongan darah, riwayat penyakit, serta kebutuhan khusus jika ada.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Golongan Darah</label>
                <select name="golonganDarah" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.golonganDarah} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Penyakit Yang Pernah Diderita</label>
                <input type="text" name="penyakitDiderita" className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: Asma, TBC, dll (kosongkan jika tidak ada)" value={formData.penyakitDiderita} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 mb-3">Berkebutuhan Khusus / Kelainan</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Netra",
                  "Rungu",
                  "Grahita Sedang",
                  "Grahita Ringan",
                  "Laras",
                  "Wicara",
                  "Daksa Sedang",
                  "Daksa Ringan",
                  "Autis",
                  "Indigo",
                  "Hyper Aktif",
                  "Bakat Istimewa",
                  "Cerdas Istimewa",
                  "Down Syndrome",
                  "Narkoba",
                  "Kesulitan Belajar",
                  "Lainnya"
                ].map((option) => {
                  const isChecked = formData.kebutuhanKhusus?.includes(option) || false;
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-blue-600"
                      />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
  );
}
