import React from "react";
import { User, Calendar, Heart } from "lucide-react";
import { Applicant } from "./types";

interface ActiveStudentBiodataTabProps {
  activeTab: string;
  selectedApplicant: Applicant;
}

export const ActiveStudentBiodataTab: React.FC<ActiveStudentBiodataTabProps> = ({
  activeTab,
  selectedApplicant,
}) => {
  if (activeTab === "biodata") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identitas Diri Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
              <User size={14} />
            </div>
            <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              Identitas Diri
            </h3>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Lengkap</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedApplicant.nama}</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NISN / NIK</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {selectedApplicant.nisn} / {selectedApplicant.nik || "-"}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tempat, Tanggal Lahir</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir},{" "}
              {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jenis Kelamin / Agama</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}
            </div>
          </div>
        </div>

        {/* Alamat & Kontak Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
              <span className="text-blue-500 font-bold" style={{ fontSize: "12px" }}>!</span>
            </div>
            <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              Alamat & Kontak
            </h3>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp / Email</div>
            <div className="text-sm font-bold text-blue-500">
              {selectedApplicant.whatsapp || "-"} / {selectedApplicant.email || "-"}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Tempat Tinggal</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelurahan / Kecamatan</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tinggal Dengan / Transportasi</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "periodik") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <Calendar size={12} className="text-blue-500" /> Data Fisik & Periodik
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Tinggi / Berat Badan
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm /{" "}
                {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Jarak ke Sekolah
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Waktu Tempuh Perjalanan
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam{" "}
                {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Jumlah Saudara Kandung
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
            <Heart size={12} className="text-blue-500" /> Kondisi Kesehatan
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Golongan Darah
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold uppercase">
                {selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">
                Riwayat Penyakit
              </span>
              <span className="text-slate-800 dark:text-white font-extrabold">
                {selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-550 block mb-1.5 font-bold uppercase text-[9px] tracking-wider">
                Kebutuhan Khusus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(selectedApplicant.kebutuhan_khusus) ? (
                  selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-355 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase"
                    >
                      {k}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-455 italic font-semibold">Tidak Ada</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
