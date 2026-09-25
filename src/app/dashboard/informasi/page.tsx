"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Megaphone, 
  Plus, 
  Loader2, 
  Clock,
  Sparkles
} from "lucide-react";
import { 
  Informasi, 
  formatDate 
} from "./components/types";
import { InformasiCard } from "./components/InformasiCard";
import InformasiModal from "./components/InformasiModal";
import { InformasiPreviewModal } from "./components/InformasiPreviewModal";
import { InformasiDeleteModal } from "./components/InformasiDeleteModal";
import { useInformasiForm } from "./hooks/useInformasiForm";

export default function KelolaInformasi() {
  const { adminToken, addToast } = usePPDB();
  const [informasiList, setInformasiList] = useState<Informasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewItem, setPreviewItem] = useState<Informasi | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const BACKEND_URL = "http://localhost:5000";

  const fetchDetailItem = async (id: number): Promise<Informasi | null> => {
    try {
      setLoadingDetailId(id);
      const res = await fetch(`${BACKEND_URL}/api/informasi/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal Memuat Detail", "Gagal memuat detail informasi dari server.", "danger");
        }
        return null;
      }
    } catch (err: any) {
      console.error("Error fetching detail:", err);
      if (typeof addToast === "function") {
        addToast("Koneksi Error", "Gagal menghubungi server.", "danger");
      }
      return null;
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleOpenPreview = async (item: Informasi) => {
    if (loadingDetailId !== null) return;
    const fullItem = await fetchDetailItem(item.id);
    if (fullItem) {
      setPreviewItem(fullItem);
    }
  };

  const fetchInformasi = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/informasi`);
      const data = await res.json();
      if (data.success) {
        setInformasiList(data.data);
      } else {
        if (typeof addToast === "function") {
          addToast("Error", "Gagal memuat informasi dari server.", "danger");
        }
      }
    } catch (err: any) {
      console.warn("Backend offline, using fallback seeded data:", err.message);
      const fallbackData: Informasi[] = [
        {
          id: 101,
          judul: "Pendaftaran Peserta Didik Baru (PPDB) SMK Taruna Bhakti 2026/2027 Resmi Dibuka!",
          konten: "SMK Taruna Bhakti Depok resmi membuka pendaftaran bagi calon peserta didik baru untuk tahun ajaran 2026/2027. Tersedia 6 Program Keahlian unggulan yaitu Rekayasa Perangkat Lunak, Teknik Jaringan Komputer, Desain Komunikasi Visual, Broadcasting & Perfilman, Teknik Elektronika, dan Animasi. Segera lakukan registrasi online dan unggah berkas Anda sebelum kuota penuh!",
          tanggal: "2026-05-15",
          foto_url: "",
          created_at: new Date().toISOString()
        },
        {
          id: 102,
          judul: "Sosialisasi Jurusan Baru: Teknik Elektronika (TE) dengan Fokus Robotika Industri",
          konten: "Menjawab tantangan revolusi industri 4.0, SMK Taruna Bhakti menghadirkan inovasi di jurusan Teknik Elektronika. Kurikulum diperkuat dengan pemelajaran mikrokontroler, IoT, PLC, dan Robotika Industri modern. Lulusan TE siap diserap oleh industri manufaktur dan teknologi terkemuka.",
          tanggal: "2026-05-20",
          foto_url: "",
          created_at: new Date().toISOString()
        }
      ];
      setInformasiList(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInformasi();
  }, []);

  const {
    submitting,
    isOpenModal,
    setIsOpenModal,
    isEditMode,
    judul,
    setJudul,
    konten,
    setKonten,
    tanggal,
    setTanggal,
    fotoUrl,
    setFotoUrl,
    videoUrl,
    setVideoUrl,
    videoName,
    setVideoName,
    dokumenUrl,
    setDokumenUrl,
    dokumenName,
    setDokumenName,
    dragActive,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFileChange,
    handleVideoFileChange,
    handleDokumenFileChange,
    handleDrag,
    handleDrop,
    handleSubmit
  } = useInformasiForm(adminToken, addToast, fetchInformasi);

  const handleEditClick = async (item: Informasi) => {
    if (loadingDetailId !== null) return;
    const fullItem = await fetchDetailItem(item.id);
    if (fullItem) {
      handleOpenEditModal(fullItem);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/informasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (typeof addToast === "function") {
          addToast("Berhasil Dihapus", "Pengumuman berhasil dihapus.", "success");
        }
        setDeleteConfirmId(null);
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal Menghapus", data.message || "Gagal menghapus informasi.", "danger");
        }
      }
    } catch (err: any) {
      console.error("Gagal menghapus:", err);
      if (typeof addToast === "function") {
        addToast("Error", "Gagal menghubungi server untuk menghapus informasi.", "danger");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Megaphone className="text-blue-600" size={24} />
            Kelola Pengumuman &amp; Berita PPDB
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
            Publikasikan pengumuman resmi, jadwal seleksi, dan berita kegiatan untuk calon siswa baru
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Buat Pengumuman Baru
        </button>
      </div>

      {/* Konten Utama */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="text-xs font-bold uppercase tracking-wider">Memuat data pengumuman...</span>
        </div>
      ) : informasiList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-900/50">
            <Megaphone size={28} />
          </div>
          <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">
            Belum Ada Pengumuman
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Saat ini belum ada pengumuman yang aktif di publik. Silakan buat pengumuman baru untuk ditampilkan di forum informasi siswa.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            Mulai Buat Pengumuman
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-500" />
              Daftar Pengumuman Aktif ({informasiList.length})
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              Diurutkan dari yang terbaru
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {informasiList.map((item) => (
              <InformasiCard
                key={item.id}
                item={item}
                loadingDetailId={loadingDetailId}
                onPreview={handleOpenPreview}
                onEdit={handleEditClick}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal Buat / Edit */}
      <InformasiModal
        isOpen={isOpenModal}
        isEditMode={isEditMode}
        submitting={submitting}
        judul={judul}
        setJudul={setJudul}
        konten={konten}
        setKonten={setKonten}
        tanggal={tanggal}
        setTanggal={setTanggal}
        fotoUrl={fotoUrl}
        setFotoUrl={setFotoUrl}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        videoName={videoName}
        setVideoName={setVideoName}
        dokumenUrl={dokumenUrl}
        setDokumenUrl={setDokumenUrl}
        dokumenName={dokumenName}
        setDokumenName={setDokumenName}
        dragActive={dragActive}
        handleFileChange={handleFileChange}
        handleVideoFileChange={handleVideoFileChange}
        handleDokumenFileChange={handleDokumenFileChange}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        onSubmit={handleSubmit}
        onClose={() => setIsOpenModal(false)}
      />

      {/* Preview Modal */}
      <InformasiPreviewModal
        previewItem={previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={handleEditClick}
      />

      {/* Delete Confirmation Modal */}
      <InformasiDeleteModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            handleDelete(deleteConfirmId);
          }
        }}
      />
    </div>
  );
}
