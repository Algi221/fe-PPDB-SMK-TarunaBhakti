import { useState } from "react";
import { Informasi, parseMedia, formatInputDate } from "../components/types";

export function useInformasiForm(
  adminToken: string | null,
  addToast: any,
  fetchInformasi: () => Promise<void>
) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [judul, setJudul] = useState<string>("");
  const [konten, setKonten] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string>(""); 
  const [videoUrl, setVideoUrl] = useState<string>(""); 
  const [videoName, setVideoName] = useState<string>("");
  const [dokumenUrl, setDokumenUrl] = useState<string>(""); 
  const [dokumenName, setDokumenName] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);

  const BACKEND_URL = "http://localhost:5000";

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setJudul("");
    setKonten("");
    
    const today = new Date().toISOString().split('T')[0];
    setTanggal(today);
    setFotoUrl("");
    setVideoUrl("");
    setVideoName("");
    setDokumenUrl("");
    setDokumenName("");
    setIsOpenModal(true);
  };

  const handleOpenEditModal = (fullItem: Informasi) => {
    setIsEditMode(true);
    setSelectedId(fullItem.id);
    setJudul(fullItem.judul);
    setKonten(fullItem.konten);
    setTanggal(formatInputDate(fullItem.tanggal));
    
    const media = parseMedia(fullItem.foto_url);
    setFotoUrl(media.foto);
    setVideoUrl(media.video);
    setVideoName(media.videoName);
    setDokumenUrl(media.dokumen);
    setDokumenName(media.dokumenName);
    
    setIsOpenModal(true);
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran File Terlalu Besar", "Harap pilih foto dengan ukuran di bawah 3 MB.", "warning");
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya berkas gambar/foto yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFotoUrl(reader.result); 
        if (typeof addToast === "function") {
          addToast("Foto Siap", "Foto berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processVideoFile = (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran Video Terlalu Besar", "Harap pilih video dengan ukuran di bawah 10 MB.", "warning");
      }
      return;
    }

    if (!file.type.startsWith("video/")) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya berkas video yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setVideoUrl(reader.result);
        setVideoName(file.name);
        if (typeof addToast === "function") {
          addToast("Video Siap", "Video berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const processDokumenFile = (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran Dokumen Terlalu Besar", "Harap pilih dokumen dengan ukuran di bawah 5 MB.", "warning");
      }
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ];
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(ext || "");

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya dokumen PDF, Word, Excel, atau Text yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setDokumenUrl(reader.result);
        setDokumenName(file.name);
        if (typeof addToast === "function") {
          addToast("Dokumen Siap", "Dokumen berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDokumenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processDokumenFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!judul.trim() || !konten.trim() || !tanggal) {
      if (typeof addToast === "function") {
        addToast("Gagal", "Harap lengkapi semua kolom wajib (Judul, Konten, Tanggal).", "warning");
      }
      return;
    }

    setSubmitting(true);
    const mediaObj = {
      foto: fotoUrl || "",
      video: videoUrl || "",
      video_name: videoName || "",
      dokumen: dokumenUrl || "",
      dokumen_name: dokumenName || ""
    };
    const hasMedia = fotoUrl || videoUrl || dokumenUrl;
    const payload = {
      judul: judul.trim(),
      konten: konten.trim(),
      tanggal,
      foto_url: hasMedia ? JSON.stringify(mediaObj) : null
    };

    try {
      let res;
      if (isEditMode && selectedId) {
        res = await fetch(`${BACKEND_URL}/api/informasi/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${BACKEND_URL}/api/informasi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        if (typeof addToast === "function") {
          addToast(
            "Berhasil", 
            isEditMode ? "Informasi berhasil diperbarui." : "Informasi berhasil ditambahkan.", 
            "success"
          );
        }
        setIsOpenModal(false);
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal", data.message || "Gagal menyimpan informasi.", "danger");
        }
      }
    } catch (err: any) {
      console.error("Gagal submit:", err);
      if (typeof addToast === "function") {
        addToast("Error", "Gagal menyimpan informasi ke server.", "danger");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    isOpenModal,
    setIsOpenModal,
    isEditMode,
    selectedId,
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
  };
}
