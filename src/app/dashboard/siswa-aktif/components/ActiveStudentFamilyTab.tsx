import React from "react";
import { HelpCircle, Layers, User, Users } from "lucide-react";
import { Applicant } from "./types";

interface ActiveStudentFamilyTabProps {
  activeTab: string;
  selectedApplicant: Applicant;
}

export const ActiveStudentFamilyTab: React.FC<ActiveStudentFamilyTabProps> = ({
  activeTab,
  selectedApplicant,
}) => {
  if (activeTab === "bantuan") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <HelpCircle size={12} className="text-blue-500" /> Jaminan Sosial / Bantuan
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Penerima KPS
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"}{" "}
                {selectedApplicant.no_kps || selectedApplicant.noKps
                  ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})`
                  : ""}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Penerima KIP
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"}{" "}
                {selectedApplicant.no_kip || selectedApplicant.noKip
                  ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})`
                  : ""}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <Layers size={12} className="text-blue-500" /> Beasiswa & Prestasi
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Uraian Prestasi
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Uraian Beasiswa
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "orangtua") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <User size={12} className="text-blue-500" /> Ayah Kandung
          </h4>
          <div className="space-y-3.5">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Nama Lengkap
              </span>
              <span className="text-slate-850 dark:text-white font-extrabold">
                {selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Pekerjaan Ayah
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Penghasilan Bulanan
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <User size={12} className="text-blue-500" /> Ibu Kandung
          </h4>
          <div className="space-y-3.5">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Nama Lengkap
              </span>
              <span className="text-slate-850 dark:text-white font-extrabold">
                {selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Pendidikan / Pekerjaan
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} /{" "}
                {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Penghasilan Bulanan
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <Users size={12} className="text-blue-500" /> Wali & Kontak Darurat
          </h4>
          <div className="space-y-3.5">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Nama Wali
              </span>
              <span className="text-slate-850 dark:text-white font-extrabold">
                {selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                No. Telepon Orang Tua
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono text-sm font-extrabold">
                {selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
