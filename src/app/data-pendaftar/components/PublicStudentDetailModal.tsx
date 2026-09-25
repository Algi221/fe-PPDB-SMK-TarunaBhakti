"use client";

import React from "react";
import { User, MapPin, Phone, Mail, FileText, X, CheckCircle, Clock, XCircle } from "lucide-react";

export const StatusBadge = ({ status }: { status: string }) => {
  if (status === "Terverifikasi" || status === "Approved") return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={12}/> Terverifikasi</span>;
  if (status === "Menunggu Verifikasi" || status === "Pending") return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><Clock size={12}/> Menunggu</span>;
  if (status === "Ditolak" || status === "Rejected") return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"><XCircle size={12}/> Ditolak</span>;
  return null;
};

interface PublicStudentDetailModalProps {
  selectedStudent: any | null;
  onClose: () => void;
}

export default function PublicStudentDetailModal({
  selectedStudent,
  onClose
}: PublicStudentDetailModalProps) {
  if (!selectedStudent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <FileText size={22} /> Biodata Calon Taruna
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-blue-50 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 flex flex-col items-center justify-center shrink-0">
              <User size={40} className="text-blue-500 dark:text-slate-400 mb-1" />
              <span className="text-[10px] font-bold text-blue-600 dark:text-slate-400 uppercase tracking-wider">FOTO</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{selectedStudent.nama}</h3>
              <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1.5"><FileText size={16}/> NISN: {selectedStudent.nisn}</span>
                <span className="flex items-center gap-1.5"><MapPin size={16}/> {selectedStudent.sekolah_asal || selectedStudent.asalSekolah}</span>
              </div>
              <div className="inline-flex flex-col gap-2.5 w-full">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 w-fit">
                  SCAN QR PADA BUKTI PENDAFTARAN UNTUK CEK STATUS
                </span>
                <div className="flex gap-2 items-center text-xs font-bold text-slate-500 dark:text-slate-455 mt-1">
                  <span>STATUS:</span>
                  <StatusBadge status={selectedStudent.status} />
                </div>
                {selectedStudent.status === "Rejected" && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl w-full text-left">
                    <div className="text-xs font-black text-rose-600 dark:text-rose-455 uppercase tracking-wider mb-1">Alasan Penolakan:</div>
                    <div className="text-xs font-bold text-rose-700 dark:text-rose-300 leading-relaxed">
                      {selectedStudent.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Data Pribadi */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Data Pribadi
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-400">Jenis Kelamin</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.kelamin || (selectedStudent.jenis_kelamin === 'L' ? 'Laki-laki' : selectedStudent.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki')}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Alamat Lengkap</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{selectedStudent.alamat || "Alamat Disembunyikan (Privasi)"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Tanggal Daftar</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.tglDaftar || (selectedStudent.tgl_daftar ? new Date(selectedStudent.tgl_daftar).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : "-")}</div>
                </div>
              </div>
            </div>

            {/* Data Akademik & Pilihan */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-blue-500" /> Pilihan Program Studi
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-400">Program Studi Pilihan</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedStudent.jurusan_1 || selectedStudent.jurusan1}</div>
                </div>
              </div>
            </div>

            {/* Data Orang Tua */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Data Orang Tua
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-400">Nama Ayah</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.ayah || selectedStudent.nama_ayah || "Disembunyikan (Privasi)"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Nama Ibu</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.ibu || selectedStudent.nama_ibu || "Disembunyikan (Privasi)"}</div>
                </div>
              </div>
            </div>

            {/* Kontak */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                <Phone size={16} className="text-blue-500" /> Informasi Kontak
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-400">No. HP / WhatsApp</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.noHp || selectedStudent.whatsapp || "Disembunyikan (Privasi)"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Email</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.email || "Disembunyikan (Privasi)"}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-bold text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
