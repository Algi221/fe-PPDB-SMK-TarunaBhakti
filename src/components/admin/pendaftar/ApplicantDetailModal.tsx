import { usePPDB } from '@/context/PPDBContext';
import Swal from 'sweetalert2';
import React from 'react';
import { User, Info, Calendar, Heart, HelpCircle, FileCheck, Layers, Users, FileImage, FileText, Check, X, Pencil, School } from 'lucide-react';
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
      {/* Dark Theme Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-[#091122] border border-slate-800/80 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all text-white">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/60 flex items-center justify-between shrink-0 bg-[#091122] relative">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-inner">
                  {selectedApplicant.nama?.substring(0, 1).toUpperCase() || "S"}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wide">
                    <span>{selectedApplicant.nama}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                        selectedApplicant.status === "Approved"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : selectedApplicant.status === "Rejected"
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center flex-wrap gap-2">
                    <span className="text-blue-400">NO. PENDAFTARAN:</span>
                    <span className="font-mono text-blue-400 font-extrabold">{formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-blue-400">NISN:</span>
                    <span className="font-mono text-slate-200">{selectedApplicant.nisn}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-blue-400">ASAL:</span>
                    <span className="text-slate-200">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "-"}</span>
                  </p>
                  {selectedApplicant.status === "Approved" && selectedApplicant.verified_by && (
                    <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide mt-1">
                      ✓ Diverifikasi oleh: {selectedApplicant.verified_by}
                    </p>
                  )}
                  {selectedApplicant.status === "Rejected" && selectedApplicant.rejected_by && (
                    <div className="mt-1.5 flex flex-col gap-1.5 text-left">
                      <p className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wide">
                        ✗ Digugurkan oleh: {selectedApplicant.rejected_by}
                      </p>
                      <div className="text-[10px] p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 max-w-md">
                        <span className="font-extrabold uppercase tracking-wider block mb-0.5">Alasan Penolakan:</span>
                        <span className="font-bold">{selectedApplicant.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedApplicant(null);
                  setIsFullscreenImageOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="px-6 py-3 bg-[#070d1a] border-b border-slate-800/60 shrink-0">
              <div className="flex flex-wrap bg-[#0c162b] p-1.5 rounded-2xl gap-1 w-full border border-slate-800/60">
                {[
                  { id: "biodata", label: "BIODATA" },
                  { id: "periodik", label: "PERIODIK" },
                  { id: "bantuan", label: "BANTUAN" },
                  { id: "orangtua", label: "ORANG TUA" },
                  { id: "akademik", label: "AKADEMIK" },
                  { id: "pembayaran", label: "VERIFIKASI BERKAS" },
                  { id: "pernyataan", label: "PERNYATAAN" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 text-[10px] md:text-xs font-extrabold transition-all rounded-xl uppercase tracking-wider flex-1 text-center min-w-[100px] whitespace-nowrap cursor-pointer ${
                      activeTab === t.id
                        ? "bg-[#132247] text-white shadow-sm border border-blue-500/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 text-xs leading-relaxed text-slate-300 font-bold max-h-[55vh] hide-scrollbar">
              {/* TAB 1: BIODATA */}
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <User size={14} />
                      </div>
                      IDENTITAS DIRI
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">NAMA LENGKAP</span>
                        <span className="text-white text-sm font-black">{selectedApplicant.nama}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span>
                        <span className="text-white font-mono font-bold text-xs">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">TEMPAT, TANGGAL LAHIR</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir || "-"}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">JENIS KELAMIN / AGAMA</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin || "-"} / {selectedApplicant.agama || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Info size={14} />
                      </div>
                      ALAMAT & KONTAK
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">WHATSAPP / EMAIL</span>
                        <span className="text-blue-400 text-xs font-mono font-bold">{selectedApplicant.whatsapp || "-"} / {selectedApplicant.email || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">ALAMAT TEMPAT TINGGAL</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.alamat || "-"} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw || "-"})</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">KELURAHAN / KECAMATAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.kelurahan || "-"} / {selectedApplicant.kecamatan || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">TINGGAL DENGAN / TRANSPORTASI</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan || "-"} / {selectedApplicant.transportasi || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERIODIK */}
              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Calendar size={14} />
                      </div>
                      DATA FISIK & PERIODIK
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">TINGGI / BERAT BADAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">JARAK KE SEKOLAH</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "Kurang dari 1 km"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">WAKTU TEMPUH PERJALANAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">JUMLAH SAUDARA KANDUNG</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <Heart size={14} />
                      </div>
                      KONDISI KESEHATAN
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">GOLONGAN DARAH</span>
                        <span className="text-rose-500 font-black text-xs uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">RIWAYAT PENYAKIT</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-2 font-bold uppercase text-[9px] tracking-wider">KEBUTUHAN KHUSUS</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) && selectedApplicant.kebutuhan_khusus.length > 0 ? (
                            selectedApplicant.kebutuhan_khusus.map((k: string, idx: number) => (
                              <span key={idx} className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase shadow-sm">{k}</span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic font-semibold">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BANTUAN */}
              {activeTab === "bantuan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <HelpCircle size={14} />
                      </div>
                      JAMINAN SOSIAL / BANTUAN
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">PENERIMA KPS</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} (No: {selectedApplicant.no_kps || selectedApplicant.noKps || "-"})</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">PENERIMA KIP</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} (No: {selectedApplicant.no_kip || selectedApplicant.noKip || "-"})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Layers size={14} />
                      </div>
                      BEASISWA & PRESTASI
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">JENIS PRESTASI</span>
                        <span className="text-white font-bold text-xs">{Array.isArray(selectedApplicant.jenis_prestasi) ? selectedApplicant.jenis_prestasi.join(", ") : selectedApplicant.jenisPrestasi || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">TINGKAT PRESTASI</span>
                        <span className="text-white font-bold text-xs">{Array.isArray(selectedApplicant.tingkat_prestasi) ? selectedApplicant.tingkat_prestasi.join(", ") : selectedApplicant.tingkatPrestasi || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">URAIAN PRESTASI</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORANG TUA */}
              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <User size={14} />
                      </div>
                      DATA AYAH KANDUNG
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">NAMA AYAH</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">PEKERJAAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">PENGHASILAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-pink-500/10 flex items-center justify-center text-pink-400">
                        <User size={14} />
                      </div>
                      DATA IBU KANDUNG
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">NAMA IBU</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">PEKERJAAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">PENGHASILAN</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">TELEPON ORTU</span>
                        <span className="text-blue-400 font-mono text-xs font-bold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AKADEMIK */}
              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <School size={14} />
                      </div>
                      PENDIDIKAN SEBELUMNYA
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">ASAL SEKOLAH</span>
                        <span className="text-white font-black text-xs uppercase">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">TAHUN LULUS</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">NO. IJAZAH / SKL</span>
                        <span className="text-white font-mono font-bold text-xs">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">NO. SKHUN</span>
                        <span className="text-white font-mono font-bold text-xs">{selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Layers size={14} />
                      </div>
                      PILIHAN MINAT & BAKAT
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">JURUSAN PILIHAN</span>
                        <span className="text-blue-400 font-bold text-xs uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1 || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">CITA - CITA</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.cita_cita || selectedApplicant.citaCita || "-"}</span>
                      </div>
                      <div className="bg-[#0c162c] rounded-2xl p-3.5 border border-slate-800/80">
                        <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">ALASAN MEMILIH</span>
                        <span className="text-white font-bold text-xs">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: VERIFIKASI BERKAS */}
              {activeTab === "pembayaran" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h4 className="text-white font-black uppercase tracking-widest border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <FileCheck size={14} />
                    </div>
                    STATUS VERIFIKASI BERKAS FISIK
                  </h4>

                  <div className="bg-[#0c162c] border border-slate-800/80 rounded-3xl p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                          <Check size={16} className="stroke-[3]" />
                        </div>
                        <div>
                          <h5 className="text-white font-black uppercase tracking-wider text-xs">CHECKLIST BERKAS FISIK</h5>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Tandai dokumen yang telah diserahkan secara fisik ke sekolah.</p>
                        </div>
                      </div>
                      <span className="px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        BELUM LENGKAP
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Fotokopi Kartu Keluarga (KK)",
                        "Fotokopi KTP Orang Tua (Ayah & Ibu)",
                        "Akta Kelahiran asli & 1 Fotokopi",
                        "Fotokopi Ijazah / SKL legalisir",
                        "Pas foto berwarna 3x4 (3 lembar)",
                        "Bukti Pembayaran Pendaftaran"
                      ].map((item, idx) => (
                        <div key={idx} className="bg-[#070d1a] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 flex items-center gap-3 transition-all">
                          <div className="w-5 h-5 rounded-lg border border-slate-700/80 bg-slate-900/60 flex items-center justify-center shrink-0">
                            {/* Unchecked state style matching reference */}
                          </div>
                          <span className="text-slate-200 font-bold text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Invoice Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-[#0c162c] border border-slate-800/80 rounded-2xl">
                      <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">METODE PEMBAYARAN</span>
                      <span className="text-white font-extrabold text-xs uppercase">
                        {selectedApplicant.metode_pembayaran || "Payment Gateway"}
                      </span>
                    </div>
                    <div className="p-4 bg-[#0c162c] border border-slate-800/80 rounded-2xl">
                      <span className="text-slate-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">STATUS PEMBAYARAN</span>
                      <div>
                        <span
                          className={`inline-flex px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            selectedApplicant.payment_status === "Paid"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          }`}
                        >
                          {selectedApplicant.payment_status === "Paid" ? "Lunas" : "Belum Lunas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedApplicant.payment_status === "Paid" && (
                    <div className="p-5 bg-blue-950/30 border border-blue-900/40 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[9px] block">Invoice Resmi Pembayaran</span>
                        <p className="text-[11px] text-slate-300 font-bold mt-1 leading-relaxed">
                          Invoice pendaftaran resmi telah diterbitkan dan diverifikasi untuk calon siswa ini.
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(`/invoice?nisn=${selectedApplicant.nisn}`, '_blank')}
                        className="px-5 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Cetak / Unduh Invoice</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: PERNYATAAN */}
              {activeTab === "pernyataan" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h4 className="text-white font-black uppercase tracking-widest border-b border-slate-800/80 pb-3 text-[11px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <FileText size={14} />
                    </div>
                    KOMITMEN & JANJI KEDISIPLINAN
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#0c162c] border border-slate-800/80 rounded-2xl flex flex-col justify-between min-h-[90px]">
                      <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider mb-2">TAWURAN / PERKELAHIAN</span>
                      <div>
                        <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {selectedApplicant.perkelahian || "TIDAK"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-[#0c162c] border border-slate-800/80 rounded-2xl flex flex-col justify-between min-h-[90px]">
                      <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider mb-2">PENYALAHGUNAAN NARKOBA</span>
                      <div>
                        <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {selectedApplicant.narkoba || "TIDAK"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-[#0c162c] border border-slate-800/80 rounded-2xl flex flex-col justify-between min-h-[90px]">
                      <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider mb-2">PELANGGARAN HUKUM LAIN</span>
                      <div>
                        <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {selectedApplicant.pelanggaran_lain || "TIDAK"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#0c162c] border border-slate-800/80 rounded-3xl space-y-4">
                    <span className="text-blue-400 font-extrabold uppercase tracking-wider text-[10px] block">
                      PERNYATAAN KESANGGUPAN CALON TARUNA BARU:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs font-bold text-slate-200">
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-black text-sm">✓</span> Patuh Aturan Sekolah
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-black text-sm">✓</span> Menerima Sanksi Sekolah
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-black text-sm">✓</span> Hubungan Akrab Taruna
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-black text-sm">✓</span> Belajar Dengan Tekun
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-black text-sm">✓</span> Menjaga Nama Baik Almamater
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="p-6 border-t border-slate-800/60 bg-[#070d1a] flex items-center justify-end shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-6 py-3 bg-[#1a2638] hover:bg-[#233249] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-700/50 cursor-pointer"
                >
                  TUTUP
                </button>

                {selectedApplicant.status !== "Approved" && (
                  <button
                    onClick={() => {
                      verifyApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    VERIFIKASI LOLOS
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
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
                  >
                    TOLAK / GUGURKAN
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
          <div className="bg-[#091122] border border-slate-800/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all text-white">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-800/60 flex items-start justify-between bg-[#091122] shrink-0 relative">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Pencil size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                    Edit Data — {editApplicant.nama}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                    <span className="text-blue-400">NISN:</span> {editApplicant.nisn}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditApplicant(null)} className="w-10 h-10 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition-all relative z-10 shrink-0 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable form */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#070d1a] hide-scrollbar">
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
                <div key={section.section} className="bg-[#0c162c] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3 border-b border-slate-800/80 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {section.icon}
                    </div>
                    {section.section}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.fields.map((f) => (
                      <div key={f.key} className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-blue-400 transition-colors">{f.label}</label>
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
                            className="w-full bg-[#070d1a] border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800/60 bg-[#070d1a] flex items-center justify-end gap-4 shrink-0">
              <button
                onClick={() => setEditApplicant(null)}
                className="px-6 py-3 bg-[#1a2638] hover:bg-[#233249] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-700/50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
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
