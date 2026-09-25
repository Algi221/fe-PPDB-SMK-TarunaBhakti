"use client";

import React from "react";
import { PPDBFormData } from "../types";

interface Step12BudiPekertiProps {
  formData: PPDBFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step12BudiPekerti({ formData, handleInputChange }: Step12BudiPekertiProps) {
  return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 12: Data Budi Pekerti & Ekonomi</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Pernyataan kepribadian serta data bantuan sosial (jika ada).</p>

            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">M</span>
                Data Budi Pekerti
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">1. Perkelahian antar Pelajar</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.perkelahian === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="perkelahian" value={option} checked={formData.perkelahian === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Kalau Pernah Dimana dan Kapan :</span>
                  <input type="text" name="ketPerkelahian" className="flex-1 bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100" value={formData.ketPerkelahian} onChange={handleInputChange} disabled={formData.perkelahian !== "Pernah"} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">2. Obat Terlarang, Minuman Keras, Narkotika</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.narkoba === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="narkoba" value={option} checked={formData.narkoba === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Kalau Pernah atau Masih, Berikan Alasannya :</span>
                  <input type="text" name="ketNarkoba" className="flex-1 bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100" value={formData.ketNarkoba} onChange={handleInputChange} disabled={formData.narkoba !== "Pernah"} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">3. Pelanggaran Tingkah Laku Sosial</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.pelanggaranLain === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                      <input type="radio" name="pelanggaranLain" value={option} checked={formData.pelanggaranLain === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Bentuk Pelanggaran :</span>
                  <input type="text" name="ketPelanggaranLain" className="flex-1 bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-100" value={formData.ketPelanggaranLain} onChange={handleInputChange} disabled={formData.pelanggaranLain !== "Pernah"} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">4. Apakah anda sanggup mentaati tata tertib yang berlaku di SMK Taruna Bhakti Depok ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiTaat === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiTaat" value={option} checked={formData.janjiTaat === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">5. Apakah anda sanggup dikenakan sangsi apabila melanggar tata tertib peraturan sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiSanksi === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiSanksi" value={option} checked={formData.janjiSanksi === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">6. Apakah Anda Sanggup Untuk Menjalin Keakraban dengan Sesama Rekan di Sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiAkrab === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiAkrab" value={option} checked={formData.janjiAkrab === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">7. Apakah anda sanggup belajar sungguh-sungguh ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiBelajar === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiBelajar" value={option} checked={formData.janjiBelajar === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">8. Apakah anda sanggup menjaga nama baik sekolah baik didalam maupun diluar sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiNamaBaik === option ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                        <input type="radio" name="janjiNamaBaik" value={option} checked={formData.janjiNamaBaik === option} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">N</span>
                Data Ekonomi Keluarga
              </h4>

              <div className="space-y-6">
                <div className="form-group">
                  <div className="flex text-xs font-bold text-slate-600 mb-1.5">
                    <span className="mr-2">1.</span>
                    <div>
                      <p>Apakah Orang Tua Mempunyai / Memiliki /</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="w-70">Penerima Kartu Perlindungan Sosial (KPS)</p>
                        <span>:</span>
                        <div className="flex gap-4 ml-2">
                          {["Ya", "Tidak"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="radio" name="punyaKPS" value={option} checked={formData.punyaKPS === option} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 mt-2 ml-4 pl-1.5">
                    <div className="w-70">
                      <p>Jika Ya, Sebutkan Nomor KPS-nya, dan</p>
                      <p>Lampirkan Fotocopy Kartu KPS-nya</p>
                    </div>
                    <span>:</span>
                    <div className="flex items-center gap-2 ml-2 flex-1">
                      <span>Nomor :</span>
                      <input type="text" name="noKPS" className="flex-1 bg-white border border-slate-300 shadow-sm rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" value={formData.noKPS} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex text-xs font-bold text-slate-600 mb-1.5">
                    <span className="mr-2">2.</span>
                    <div>
                      <p>Apakah Orang Tua Mempunyai / Memiliki /</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="w-70">Penerima Kartu Indonesia Pintar (KIP)</p>
                        <span>:</span>
                        <div className="flex gap-4 ml-2">
                          {["Ya", "Tidak"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="radio" name="punyaKIP" value={option} checked={formData.punyaKIP === option} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 mt-2 ml-4 pl-1.5">
                    <div className="w-70">
                      <p>Jika Ya, Sebutkan Nomor KIP-nya, dan</p>
                      <p>Lampirkan Fotocopy Kartu KIP-nya</p>
                    </div>
                    <span>:</span>
                    <div className="flex items-center gap-2 ml-2 flex-1">
                      <span>No :</span>
                      <input type="text" name="noKIP" className="flex-1 bg-white border border-slate-300 shadow-sm rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" value={formData.noKIP} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}
