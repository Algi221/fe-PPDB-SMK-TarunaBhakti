"use client";

import React, { useState, useEffect } from "react";
import { Pencil, X, User, School, Heart, Layers, Users } from "lucide-react";
import Swal from "sweetalert2";
import { Applicant, EditFormState } from "../types";

interface EditApplicantModalProps {
  editApplicant: Applicant | null;
  setEditApplicant: React.Dispatch<React.SetStateAction<Applicant | null>>;
  updateApplicant: (id: number, data: any) => Promise<any>;
  fetchAdminApplicants?: () => Promise<void>;
}

export default function EditApplicantModal({
  editApplicant,
  setEditApplicant,
  updateApplicant,
  fetchAdminApplicants,
}: EditApplicantModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<EditFormState>>({});

  useEffect(() => {
    if (editApplicant) {
      setEditForm({
        nama: editApplicant.nama || "",
        nisn: editApplicant.nisn || "",
        nik: editApplicant.nik || "",
        tempat_lahir: editApplicant.tempat_lahir || editApplicant.tempatLahir || "",
        tgl_lahir: editApplicant.tgl_lahir || editApplicant.tglLahir || "",
        jenis_kelamin: editApplicant.jenis_kelamin || editApplicant.jenisKelamin || "",
        agama: editApplicant.agama || "",
        alamat: editApplicant.alamat || "",
        rt_rw: editApplicant.rt_rw || editApplicant.rtRw || "",
        kelurahan: editApplicant.kelurahan || "",
        kecamatan: editApplicant.kecamatan || "",
        kode_pos: editApplicant.kode_pos || editApplicant.kodePos || "",
        whatsapp: editApplicant.whatsapp || "",
        email: editApplicant.email || "",
        tinggal_dengan: editApplicant.tinggal_dengan || editApplicant.tinggalDengan || "",
        transportasi: editApplicant.transportasi || "",
        tinggi_badan: String(editApplicant.tinggi_badan || editApplicant.tinggiBadan || ""),
        berat_badan: String(editApplicant.berat_badan || editApplicant.beratBadan || ""),
        golongan_darah: editApplicant.golongan_darah || editApplicant.golonganDarah || "",
        sekolah_asal: editApplicant.sekolah_asal || editApplicant.sekolahAsal || "",
        tgl_lulus: editApplicant.tgl_lulus || editApplicant.tglLulus || "",
        jurusan_1: editApplicant.jurusan_1 || editApplicant.jurusan1 || "",
        nama_ayah: editApplicant.nama_ayah || editApplicant.namaAyah || "",
        pekerjaan_ayah: editApplicant.pekerjaan_ayah || editApplicant.pekerjaanAyah || "",
        penghasilan_ayah: editApplicant.penghasilan_ayah || editApplicant.penghasilanAyah || "",
        nama_ibu: editApplicant.nama_ibu || editApplicant.namaIbu || "",
        pekerjaan_ibu: editApplicant.pekerjaan_ibu || editApplicant.pekerjaanIbu || "",
        penghasilan_ibu: editApplicant.penghasilan_ibu || editApplicant.penghasilanIbu || "",
        telepon_ortu: editApplicant.telepon_ortu || editApplicant.teleponOrtu || "",
        cita_cita: editApplicant.cita_cita || editApplicant.citaCita || "",
        alasan_memilih: editApplicant.alasan_memilih || editApplicant.alasanMemilih || "",
      });
    }
  }, [editApplicant]);

  if (!editApplicant) return null;

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateApplicant(editApplicant.id, editForm);
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Disimpan",
          text: "Data calon siswa berhasil diperbarui!",
          confirmButtonColor: "#3b82f6",
        });
        setEditApplicant(null);
        if (fetchAdminApplicants) {
          fetchAdminApplicants();
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: res?.message || "Terjadi kesalahan saat menyimpan data.",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: e.message || "Terjadi kesalahan pada sistem.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm shrink-0">
                  <Pencil size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white uppercase tracking-wide">
                    Edit Data — {editApplicant.nama}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                    <span className="text-blue-500">NISN:</span> {editApplicant.nisn}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditApplicant(null)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-all relative z-10 shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable form */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 hide-scrollbar">
              {[
                {
                  section: "Identitas Diri", icon: <User size={14} />, fields: [
                    { label: "Nama Lengkap", key: "nama" },
                    { label: "NISN", key: "nisn" },
                    { label: "NIK", key: "nik" },
                    { label: "Tempat Lahir", key: "tempat_lahir" },
                    { label: "Tanggal Lahir", key: "tgl_lahir", type: "date" },
                    { label: "Jenis Kelamin", key: "jenis_kelamin", type: "select", options: ["L", "P", "Laki-laki", "Perempuan"] },
                    { label: "Agama", key: "agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
                    { label: "Golongan Darah", key: "golongan_darah", type: "select", options: ["A", "B", "AB", "O", "-"] },
                  ]
                },
                {
                  section: "Alamat & Kontak", icon: <School size={14} />, fields: [
                    { label: "Alamat", key: "alamat" },
                    { label: "RT/RW", key: "rt_rw" },
                    { label: "Kelurahan", key: "kelurahan" },
                    { label: "Kecamatan", key: "kecamatan" },
                    { label: "Kode Pos", key: "kode_pos" },
                    { label: "WhatsApp", key: "whatsapp" },
                    { label: "Email", key: "email" },
                    { label: "Tinggal Dengan", key: "tinggal_dengan" },
                    { label: "Transportasi", key: "transportasi" },
                  ]
                },
                {
                  section: "Data Fisik", icon: <Heart size={14} />, fields: [
                    { label: "Tinggi Badan (cm)", key: "tinggi_badan", type: "number" },
                    { label: "Berat Badan (kg)", key: "berat_badan", type: "number" },
                  ]
                },
                {
                  section: "Akademik & Jurusan", icon: <Layers size={14} />, fields: [
                    { label: "Sekolah Asal", key: "sekolah_asal" },
                    { label: "Tanggal Lulus", key: "tgl_lulus", type: "date" },
                    { label: "Gelombang", key: "gelombang", type: "select", options: ["Gelombang 1", "Gelombang 2"] },
                    { label: "Program Studi Pilihan Utama", key: "jurusan_1", type: "select", options: ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"] },
                    { label: "Alasan Memilih", key: "alasan_memilih" },
                    { label: "Cita-cita", key: "cita_cita" },
                  ]
                },
                {
                  section: "Data Orang Tua", icon: <Users size={14} />, fields: [
                    { label: "Nama Ayah", key: "nama_ayah" },
                    { label: "Pekerjaan Ayah", key: "pekerjaan_ayah" },
                    { label: "Penghasilan Ayah", key: "penghasilan_ayah" },
                    { label: "Nama Ibu", key: "nama_ibu" },
                    { label: "Pekerjaan Ibu", key: "pekerjaan_ibu" },
                    { label: "Penghasilan Ibu", key: "penghasilan_ibu" },
                    { label: "Telepon Orang Tua", key: "telepon_ortu" },
                  ]
                },
                {
                  section: "Prestasi & Beasiswa", icon: <Layers size={14} />, fields: [
                    { label: "Uraian Prestasi", key: "uraian_prestasi" },
                    { label: "Tahun Prestasi", key: "tahun_prestasi" },
                    { label: "Uraian Beasiswa", key: "uraian_beasiswa" },
                  ]
                }
              ].map((section) => (
                <div key={section.section} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      {section.icon}
                    </div>
                    {section.section}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.fields.map((f) => (
                      <div key={f.key} className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-455 dark:text-slate-450 mb-2 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">{f.label}</label>
                        {f.type === "select" ? (
                          <select
                            value={(editForm as any)[f.key] || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all cursor-pointer"
                          >
                            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={f.type || "text"}
                            value={(editForm as any)[f.key] || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-end gap-4 shrink-0">
              <button
                onClick={() => setEditApplicant(null)}
                className="px-6 py-3 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-white/5"
              >
                Batal
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex items-center gap-2"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
  );
}
