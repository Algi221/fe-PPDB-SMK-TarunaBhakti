"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Upload, ArrowLeft, Home, Monitor, Code, Palette, Film, Cpu } from "lucide-react";

export default function DaftarPage() {
  const [wizardStep, setWizardStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: "",
    nisn: "",
    nik: "",
    tempatLahir: "",
    tglLahir: "",
    jenisKelamin: "",
    agama: "",
    alamat: "",
    whatsapp: "",
    email: "",
    transportasi: "",
    jarak: "",
    namaAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
    teleponOrtu: "",
    sekolahAsal: "",
    jurusan1: "",
    jurusan2: "",
    citaCita: "",
    deklarasi: false,
    berkasOk: false
  });

  const majors = [
    { code: "RPL", title: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", title: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", title: "Desain Komunikasi Visual" },
    { code: "BC", title: "Broadcasting & Perfilman" },
    { code: "TE", title: "Teknik Elektronika" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (wizardStep < 5) {
      setWizardStep(prev => prev + 1);
    } else {
      setIsSuccess(true);
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Pendaftaran Sukses!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Terima kasih, <strong>{formData.nama || "Calon Bintang"}</strong>. 
            Data pendaftaran Anda telah berhasil direkam di sistem PPDB SMK Taruna Bhakti.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 text-left text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-400">NISN:</span>
              <span className="font-bold text-slate-700">{formData.nisn}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-400">Sekolah Asal:</span>
              <span className="font-bold text-slate-700">{formData.sekolahAsal}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Jurusan Utama:</span>
              <span className="font-bold text-blue-600">{formData.jurusan1 || "-"}</span>
            </div>
          </div>
          <Link href="/" className="btn-primary-pill w-full flex justify-center">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-6">
      
      <Link href="/" className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold self-start md:self-auto md:absolute md:top-8 md:left-8">
        <ArrowLeft size={20} /> Kembali ke Beranda
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Formulir Pendaftaran PPDB</h1>
        <p className="text-slate-500">SMK Taruna Bhakti Tahun Ajaran 2026/2027</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 max-w-3xl w-full">
        
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `${((wizardStep - 1) / 4) * 100}%` }}
          ></div>

          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 ${
                wizardStep === step 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110" 
                  : wizardStep > step 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-slate-400 border-2 border-slate-200"
              }`}
            >
              {wizardStep > step ? <Check size={16} /> : step}
            </div>
          ))}
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {wizardStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 1: Data Pribadi Siswa</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Masukkan informasi dasar sesuai dengan Kartu Keluarga / Akta Kelahiran.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
                <input type="text" name="nama" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai Ijazah" value={formData.nama} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jenis Kelamin</label>
                <select name="jenisKelamin" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.jenisKelamin} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">NISN (10 Digit)</label>
                <input type="number" name="nisn" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Misal: 0081234567" value={formData.nisn} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">NIK (16 Digit)</label>
                <input type="number" name="nik" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KK" value={formData.nik} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Tempat & Tanggal Lahir</label>
                <div className="flex gap-2">
                  <input type="text" name="tempatLahir" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Tempat" value={formData.tempatLahir} onChange={handleInputChange} />
                  <input type="date" name="tglLahir" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.tglLahir} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Agama</label>
                <select name="agama" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.agama} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TEMPAT TINGGAL */}
        {wizardStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 2: Alamat & Kontak</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Informasi tempat tinggal dan kontak yang dapat dihubungi.</p>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Alamat Lengkap (Jl, RT/RW, Kel, Kec)</label>
              <textarea name="alamat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" rows="3" placeholder="Sesuai domisili sekarang" value={formData.alamat} onChange={handleInputChange}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor WhatsApp Aktif</label>
                <input type="tel" name="whatsapp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="0812..." value={formData.whatsapp} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Pribadi</label>
                <input type="email" name="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="nama@email.com" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jarak Rumah ke Sekolah</label>
                <select name="jarak" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.jarak} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="<1">Kurang dari 1 KM</option>
                  <option value="1-3">1 - 3 KM</option>
                  <option value="3-5">3 - 5 KM</option>
                  <option value=">5">Lebih dari 5 KM</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Moda Transportasi</label>
                <select name="transportasi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.transportasi} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Jalan">Jalan Kaki</option>
                  <option value="Motor">Sepeda Motor</option>
                  <option value="Angkot">Angkutan Umum</option>
                  <option value="Diantar">Diantar Orang Tua</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ORANG TUA */}
        {wizardStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 3: Data Orang Tua</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Mohon isi identitas orang tua kandung atau wali murid.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Ayah Kandung</label>
                <input type="text" name="namaAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KK" value={formData.namaAyah} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Pekerjaan Ayah</label>
                <input type="text" name="pekerjaanAyah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Wiraswasta" value={formData.pekerjaanAyah} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Ibu Kandung</label>
                <input type="text" name="namaIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Sesuai KK" value={formData.namaIbu} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Pekerjaan Ibu</label>
                <input type="text" name="pekerjaanIbu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Ibu Rumah Tangga" value={formData.pekerjaanIbu} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Nomor Telepon Orang Tua / Wali</label>
              <input type="tel" name="teleponOrtu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nomor yang mudah dihubungi" value={formData.teleponOrtu} onChange={handleInputChange} />
            </div>
          </div>
        )}

        {/* STEP 4: PENDIDIKAN & JURUSAN */}
        {wizardStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 4: Pendidikan Asal & Pilihan Jurusan</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Data sekolah SMP/MTs asal dan peminatan kompetensi.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Sekolah Asal (SMP/MTs)</label>
                <input type="text" name="sekolahAsal" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: SMPN 1 Depok" value={formData.sekolahAsal} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Cita - Cita</label>
                <input type="text" name="citaCita" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Contoh: Programmer / Desainer" value={formData.citaCita} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Pilihan Jurusan Utama</label>
                <select name="jurusan1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.jurusan1} onChange={handleInputChange}>
                  <option value="">-- Pilih Jurusan --</option>
                  {majors.map(m => <option key={m.code} value={m.code}>{m.title} ({m.code})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Pilihan Jurusan Cadangan</label>
                <select name="jurusan2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none" value={formData.jurusan2} onChange={handleInputChange}>
                  <option value="">-- Pilih Jurusan --</option>
                  {majors.map(m => <option key={m.code} value={m.code}>{m.title} ({m.code})</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DEKLARASI & UPLOAD */}
        {wizardStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tahap 5: Berkas & Konfirmasi</h3>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Lengkapi dokumen terakhir dan nyatakan kebenaran data.</p>

            <div className="form-group mb-6">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Unggah Rapor / KK (Format PDF/JPG max 5MB)</label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${formData.berkasOk ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"}`}
                onClick={() => setFormData(prev => ({ ...prev, berkasOk: !prev.berkasOk }))}
              >
                <div className="mb-3">
                  {formData.berkasOk ? (
                    <Check className="text-emerald-500 mx-auto" size={32} />
                  ) : (
                    <Upload className="text-slate-400 mx-auto" size={32} />
                  )}
                </div>
                {formData.berkasOk ? (
                  <div>
                    <p className="text-emerald-700 font-bold text-sm mb-1">Berkas_Pendaftaran_PPDB.pdf</p>
                    <span className="text-xs text-slate-400">Klik lagi untuk membatalkan unggahan</span>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-700 text-sm mb-1">Klik untuk simulasi upload berkas</p>
                    <span className="text-xs text-slate-400">Dokumen pendukung untuk proses verifikasi</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-slate-50 border border-slate-100">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 accent-blue-600 rounded border-slate-300 shrink-0"
                  checked={formData.deklarasi}
                  onChange={(e) => setFormData(prev => ({ ...prev, deklarasi: e.target.checked }))}
                />
                <span className="text-sm text-slate-600 leading-relaxed">
                  <strong>Pernyataan:</strong> Saya menyatakan bahwa data yang saya isikan di formulir ini adalah benar. Apabila di kemudian hari terbukti palsu, saya bersedia menerima sanksi yang berlaku.
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
          {wizardStep > 1 ? (
            <button 
              className="px-6 py-3 rounded-full font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors" 
              onClick={prevStep}
            >
              Kembali
            </button>
          ) : (
            <div></div>
          )}
          <button 
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={nextStep}
            disabled={
              (wizardStep === 1 && (!formData.nama || !formData.nisn)) ||
              (wizardStep === 5 && !formData.deklarasi)
            }
          >
            {wizardStep === 5 ? "Selesaikan Pendaftaran" : "Selanjutnya"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
