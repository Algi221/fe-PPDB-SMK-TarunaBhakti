import { usePPDB } from '@/context/PPDBContext';
import Swal from 'sweetalert2';
import React from 'react';
import { User, Info, Calendar, Heart, HelpCircle, FileCheck , Layers, Users, FileImage, FileText, Check, X, Pencil, School} from 'lucide-react';
import CustomSelect from "@/components/ui/CustomSelect";

const sanitizeUrl = (url: string) => { if (!url) return '#'; if (url.startsWith('http') || url.startsWith('data:')) return url; return `/${url}`; };

interface ApplicantDetailModalProps {
  selectedApplicant: any;
  setSelectedApplicant: (val: any) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  setIsFullscreenImageOpen: (val: boolean) => void;
  sanitizeSrc: (src: string | undefined | null) => string;
  formatNoPendaftaran: (periode: string | null | undefined, id: number) => string;
  updateApplicant: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
}

export default function ApplicantDetailModal({
  selectedApplicant,
  setSelectedApplicant,
  activeTab,
  setActiveTab,
  setIsFullscreenImageOpen,
  sanitizeSrc,
  formatNoPendaftaran,
  updateApplicant
}: ApplicantDetailModalProps) {
  const { verifyApplicant, rejectApplicant } = usePPDB();
  
  const [editApplicant, setEditApplicant] = React.useState<any>(null);
  const [editForm, setEditForm] = React.useState<any>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      await updateApplicant(editApplicant.id, editForm);
      setEditApplicant(null);
      setSelectedApplicant({ ...selectedApplicant, ...editForm });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Gagal menyimpan perubahan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  
  if (!selectedApplicant) return null;
  return (
    <>
{/* Beautiful Rich Detail Modal (13 Wizard Steps tabs overlay) */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">

            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900 relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
                           <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-2xl font-black shrink-0">
                  {selectedApplicant.nama.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                    <span>{selectedApplicant.nama}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-widest ${selectedApplicant.status === "Approved"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                          : selectedApplicant.status === "Rejected"
                            ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                            : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                        }`}
                    >
                      {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center flex-wrap gap-2">
                    <span className="text-blue-500">No. Pendaftaran:</span> <span className="font-mono text-blue-600 dark:text-blue-400">{formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span> 
                    <span className="text-blue-500">NISN:</span> {selectedApplicant.nisn} 
                    <span className="text-slate-300 dark:text-slate-700">•</span> 
                    <span className="text-blue-500">Asal:</span> {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}
                  </p>
                  {selectedApplicant.status === "Approved" && selectedApplicant.verified_by && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide mt-1">
                      ✓ Diverifikasi oleh: {selectedApplicant.verified_by}
                    </p>
                  )}
                  {selectedApplicant.status === "Rejected" && selectedApplicant.rejected_by && (
                    <div className="mt-1.5 flex flex-col gap-1.5 align-start text-left">
                      <p className="text-[10px] text-rose-650 dark:text-rose-400 font-extrabold uppercase tracking-wide">
                        ✗ Digugurkan oleh: {selectedApplicant.rejected_by}
                      </p>
                      <div className="text-[10px] p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-350 max-w-md">
                        <span className="font-extrabold uppercase tracking-wider block mb-0.5">Alasan Penolakan:</span>
                        <span className="font-bold">{selectedApplicant.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}</span>
                      </div>
                    </div>
                  )}
                  {selectedApplicant.deleted_at && selectedApplicant.deleted_by && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wide mt-1">
                      🗑️ Dihapus oleh: {selectedApplicant.deleted_by}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedApplicant(null);
                  setIsFullscreenImageOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-450 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center transition-all font-bold relative z-10 shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-white/5 shrink-0">
              <div className="flex flex-wrap bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1 w-full border border-slate-200/50 dark:border-white/5">
                {[
                  { id: "biodata", label: "Biodata" },
                  { id: "periodik", label: "Periodik" },
                  { id: "bantuan", label: "Bantuan" },
                  { id: "orangtua", label: "Orang Tua" },
                  { id: "akademik", label: "Akademik" },
                  { id: "pembayaran", label: "Pembayaran" },
                  { id: "pernyataan", label: "Pernyataan" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-2.5 text-[10px] md:text-xs font-black transition-all rounded-xl uppercase tracking-wider flex-1 text-center min-w-22.5 whitespace-nowrap ${activeTab === t.id
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10"
                        : "text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-8 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-bold max-h-[50vh] transition-colors duration-300">
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User size={12} />
                      </div>
                      Identitas Diri
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                        <span className="text-slate-850 dark:text-white text-sm font-black">{selectedApplicant.nama}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span>
                        <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tempat, Tanggal Lahir</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Kelamin / Agama</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Info size={12} />
                      </div>
                      Alamat & Kontak
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">WhatsApp / Email</span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-black">{selectedApplicant.whatsapp} / {selectedApplicant.email}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alamat Tempat Tinggal</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Kelurahan / Kecamatan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggal Dengan / Transportasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Calendar size={12} />
                      </div>
                      Data Fisik & Periodik
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Heart size={12} />
                      </div>
                      Kondisi Kesehatan
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-rose-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span>
                        <span className="text-rose-600 dark:text-rose-400 font-black text-xs uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-rose-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-rose-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-2 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase shadow-sm">{k}</span>
                          )) : <span className="text-slate-400 italic font-semibold">Tidak Ada</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bantuan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <HelpCircle size={12} />
                      </div>
                      Jaminan Sosial / Bantuan
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-amber-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-amber-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Layers size={12} />
                      </div>
                      Beasiswa & Prestasi
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{Array.isArray(selectedApplicant.jenis_prestasi) ? selectedApplicant.jenis_prestasi.join(", ") : selectedApplicant.jenisPrestasi || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tingkat Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{Array.isArray(selectedApplicant.tingkat_prestasi) ? selectedApplicant.tingkat_prestasi.join(", ") : selectedApplicant.tingkatPrestasi || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tahun Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tahun_prestasi || selectedApplicant.tahunPrestasi || "Tidak Ada"}</span>
                      </div>
                      {selectedApplicant.berkas_prestasi && (
                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                          <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Berkas Prestasi</span>
                          <a href={sanitizeSrc(selectedApplicant.berkas_prestasi)} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-600 underline text-left block w-full truncate">Lihat Sertifikat</a>
                        </div>
                      )}
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <User size={12} />
                      </div>
                      Ayah Kandung
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                        <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <User size={12} />
                      </div>
                      Ibu Kandung
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                        <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500">
                        <Users size={12} />
                      </div>
                      Wali & Kontak Darurat
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span>
                        <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span>
                        <span className="text-teal-600 dark:text-teal-400 font-mono text-sm font-black">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Info size={12} />
                      </div>
                      Pendidikan Asal
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span>
                        <span className="text-slate-850 dark:text-white text-sm font-black">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span>
                        <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Layers size={12} />
                      </div>
                      Pilihan Minat Studi
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/10 shadow-sm">
                        <span className="text-blue-500 dark:text-blue-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Utama</span>
                        <span className="text-blue-700 dark:text-blue-300 text-sm font-black uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-orange-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pembayaran" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileImage size={12} className="text-blue-500" /> Status & Bukti Pembayaran
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Metode Pembayaran</span>
                      <span className="text-slate-800 dark:text-white font-extrabold text-sm uppercase">
                        {selectedApplicant.metode_pembayaran || "Payment Gateway"}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Status Pembayaran</span>
                      <div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            selectedApplicant.payment_status === "Paid"
                              ? "bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                              : "bg-rose-50 border-rose-250 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
                          }`}
                        >
                          {selectedApplicant.payment_status === "Paid" ? "Lunas" : "Belum Lunas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Resmi Pembayaran Section */}
                  {selectedApplicant.payment_status === "Paid" && (
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="text-blue-600 dark:text-sky-400 font-black uppercase tracking-widest text-[9px] block">Invoice Resmi Pembayaran</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 leading-relaxed">
                          Invoice pendaftaran resmi telah diterbitkan dan diverifikasi untuk calon siswa ini. Klik tombol di bawah untuk melihat, mencetak, atau menyimpannya sebagai file PDF.
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(`/invoice?nisn=${selectedApplicant.nisn}`, '_blank')}
                        className="px-5 py-3 bg-linear-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 shrink-0 animate-pulse"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Cetak / Unduh Invoice</span>
                      </button>
                    </div>
                  )}

                  {/* Manual receipt slip visual display */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 space-y-4">
                    <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[9px] tracking-wider">
                      Dokumen Bukti Transfer Manual
                    </span>
                    {selectedApplicant.bukti_bayar ? (
                      <div className="flex flex-col items-center gap-4">
                        {selectedApplicant.bukti_bayar.startsWith("data:application/pdf") ? (
                          <div className="w-full py-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center border dark:border-white/5">
                            <FileText size={48} className="text-blue-500 mb-2" />
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Dokumen PDF Bukti Transfer</p>
                            <a
                              href={sanitizeUrl(selectedApplicant.bukti_bayar)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow animate-bounce"
                            >
                              Unduh / Lihat PDF
                            </a>
                          </div>
                        ) : (
                          <div className="max-w-sm rounded-xl overflow-hidden border dark:border-white/5 shadow-md">
                            <img
                              src={sanitizeSrc(selectedApplicant.bukti_bayar)}
                              alt="Bukti Transfer Manual"
                              className="max-h-64 object-contain mx-auto bg-white rounded-lg cursor-pointer hover:brightness-95 transition-all w-full"
                              onClick={() => setIsFullscreenImageOpen(true)}
                            />
                          </div>
                        )}
                        
                        {/* Panitia Action to manually mark as Paid */}
                        {selectedApplicant.payment_status !== "Paid" && (
                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: 'Konfirmasi',
                                text: "Apakah Anda yakin ingin memverifikasi bukti pembayaran ini dan menandai Lunas?",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Ya',
                                cancelButtonText: 'Batal'
                              });
                              if (result.isConfirmed) {
                                const res = await updateApplicant(selectedApplicant.id, { payment_status: "Paid" });
                                if (res?.success) {
                                  setSelectedApplicant(prev => prev ? { ...prev, payment_status: "Paid" } : null);
                                  window.location.href = `/invoice?nisn=${selectedApplicant.nisn}&isAdmin=true`;
                                } else {
                                  alert(res?.message || "Gagal memperbarui status pembayaran.");
                                }
                              }
                            }}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition"
                          >
                            <Check size={14} />
                            <span>Verifikasi Pembayaran Lunas</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-400 italic font-semibold">
                        Tidak ada bukti transfer manual yang diunggah oleh pendaftar.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "pernyataan" && (
                <div className="space-y-6">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileCheck size={12} className="text-blue-500" /> Komitmen & Janji Kedisiplinan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
                    <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Calon Taruna Baru:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/15 flex items-center justify-end shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-850 dark:hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-white/5"
                >
                  Tutup
                </button>

                {selectedApplicant.status !== "Approved" && (
                  <button
                    onClick={() => {
                      verifyApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                  >
                    Verifikasi Lolos
                  </button>
                )}

                {selectedApplicant.status !== "Rejected" && (
                  <button
                    onClick={async () => {
                      const { value: reason } = await Swal.fire({
                        title: 'Alasan Penolakan',
                        input: 'textarea',
                        inputPlaceholder: 'Tuliskan alasan penolakan...',
                        showCancelButton: true,
                        confirmButtonText: 'Tolak',
                        cancelButtonText: 'Batal'
                      });
                      if (reason) {
                        await rejectApplicant(selectedApplicant.id, reason);
                        setSelectedApplicant(null);
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] flex items-center gap-1.5"
                  >
                    Tolak / Gugurkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editApplicant && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 lg:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0 relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
              
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
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-450 mb-2 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">{f.label}</label>
                        {f.type === "select" ? (
                          <CustomSelect
                            value={(editForm as any)[f.key] || ""}
                            onChange={(val) => setEditForm((prev) => ({ ...prev, [f.key]: val }))}
                            options={(f.options || []).map((o: string) => ({ value: o, label: o }))}
                            placeholder={`Pilih ${f.label}`}
                          />
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
      )}
    </>
  );
}
