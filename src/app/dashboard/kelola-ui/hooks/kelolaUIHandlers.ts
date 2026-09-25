import { AlurItem, FaqItem, MajorItem } from "../types";

export const createEmptyMajor = (): MajorItem => ({
  code: "",
  title: "",
  desc: "",
  color: "#0066ff",
  careers: [
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" }
  ],
  facilities: ["Laboratorium Praktikum Baru"],
  logo: "",
  banner: "",
  video: "",
  gallery: [
    { url: "", caption: "" },
    { url: "", caption: "" },
    { url: "", caption: "" },
    { url: "", caption: "" }
  ]
});


export const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  } catch (e) {
    return dateString;
  }
};

export const handleDragStateHelper = (
  e: React.DragEvent,
  elementId: string,
  active: boolean,
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActiveStates(prev => ({ ...prev, [elementId]: active }));
};

export const processMediaFileHelper = (
  file: File,
  type: "logo" | "banner" | "video" | "gallery-0" | "gallery-1" | "gallery-2" | "gallery-3",
  editingMajor: MajorItem | null,
  setEditingMajor: React.Dispatch<React.SetStateAction<MajorItem | null>>,
  showToastMsg: (msg: string, type?: "success" | "error" | "info") => void
) => {
  const isVideo = type === "video";
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  
  if (isVideo) {
    const allowedVideoExts = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi'];
    if (!file.type.startsWith("video/") && !allowedVideoExts.includes(fileExt)) {
      showToastMsg("Hanya berkas video (MP4/WebM/MOV/MKV) yang diperbolehkan.", "error");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToastMsg("Ukuran file video maksimal adalah 15MB.", "error");
      return;
    }
  } else {
    const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
    if (!file.type.startsWith("image/") && !allowedImgExts.includes(fileExt)) {
      showToastMsg("Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan.", "error");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToastMsg("Ukuran file gambar maksimal adalah 4MB.", "error");
      return;
    }
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target?.result as string;
    if (editingMajor) {
      setEditingMajor(prev => {
        if (!prev) return null;
        if (type === "logo") return { ...prev, logo: base64 };
        if (type === "banner") return { ...prev, banner: base64 };
        if (type === "video") return { ...prev, video: base64 };
        if (type.startsWith("gallery-")) {
          const slotIdx = parseInt(type.split("-")[1]);
          const updatedGallery = [...prev.gallery];
          if (!updatedGallery[slotIdx]) updatedGallery[slotIdx] = { url: "", caption: "" };
          updatedGallery[slotIdx] = { ...updatedGallery[slotIdx], url: base64 };
          return { ...prev, gallery: updatedGallery };
        }
        return prev;
      });
      showToastMsg(`Berkas ${type.toUpperCase()} berhasil dimuat. Klik Simpan Detail di bawah untuk menerapkan.`);
    }
  };
  reader.readAsDataURL(file);
};

export const handleSchoolLogoChangeHelper = (
  file: File,
  setSchoolLogo: (val: string) => void,
  showToastMsg: (msg: string, type?: "success" | "error" | "info") => void
) => {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
  if (!file.type.startsWith("image/") && !allowedImgExts.includes(fileExt)) {
    showToastMsg("Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan.", "error");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToastMsg("Ukuran file gambar maksimal adalah 2MB.", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target?.result as string;
    setSchoolLogo(base64);
    showToastMsg("Logo sekolah berhasil dimuat. Klik Simpan Perubahan di pojok kanan atas.");
  };
  reader.readAsDataURL(file);
};

export const alurHelpers = {
  add: (alurList: AlurItem[], setAlurList: React.Dispatch<React.SetStateAction<AlurItem[]>>) => {
    const nextId = alurList.length > 0 ? Math.max(...alurList.map(a => a.id)) + 1 : 1;
    setAlurList([...alurList, { id: nextId, title: "Langkah Baru", desc: "Deskripsi langkah pendaftaran baru..." }]);
  },
  update: (
    alurList: AlurItem[],
    setAlurList: React.Dispatch<React.SetStateAction<AlurItem[]>>,
    id: number,
    key: keyof AlurItem,
    val: string | number
  ) => {
    setAlurList(alurList.map(a => a.id === id ? { ...a, [key]: val } : a));
  },
  remove: (alurList: AlurItem[], setAlurList: React.Dispatch<React.SetStateAction<AlurItem[]>>, id: number) => {
    setAlurList(alurList.filter(a => a.id !== id).map((a, i) => ({ ...a, id: i + 1 })));
  },
  move: (alurList: AlurItem[], setAlurList: React.Dispatch<React.SetStateAction<AlurItem[]>>, index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === alurList.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...alurList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((item, idx) => ({ ...item, id: idx + 1 }));
    setAlurList(reordered);
  }
};

export const faqHelpers = {
  add: (faqList: FaqItem[], setFaqList: React.Dispatch<React.SetStateAction<FaqItem[]>>) => {
    setFaqList([...faqList, { q: "Pertanyaan Baru?", a: "Tuliskan jawaban di sini." }]);
  },
  update: (
    faqList: FaqItem[],
    setFaqList: React.Dispatch<React.SetStateAction<FaqItem[]>>,
    index: number,
    key: keyof FaqItem,
    val: string
  ) => {
    setFaqList(faqList.map((f, i) => i === index ? { ...f, [key]: val } : f));
  },
  remove: (faqList: FaqItem[], setFaqList: React.Dispatch<React.SetStateAction<FaqItem[]>>, index: number) => {
    setFaqList(faqList.filter((_, i) => i !== index));
  },
  move: (faqList: FaqItem[], setFaqList: React.Dispatch<React.SetStateAction<FaqItem[]>>, index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === faqList.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...faqList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFaqList(copy);
  }
};
