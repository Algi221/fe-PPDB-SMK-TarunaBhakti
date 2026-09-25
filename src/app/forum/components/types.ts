import dompurify from "dompurify";

export const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    }) || null;
  } catch (e) {
    return null;
  }
};

export const sanitizeSrc = (src: string | undefined | null): string | null => sanitizeUrl(src);

export interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

export const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateShort = (dateStr: string | null | undefined) => {
  if (!dateStr) return { day: '-', month: '---' };
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return { day: d.getDate(), month: months[d.getMonth()] };
};

export const timeAgo = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari yang lalu`;
};

export const parseMedia = (raw: string | null | undefined) => {
  if (!raw) return { foto: "", video: "", videoName: "", dokumen: "", dokumenName: "" };
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      return {
        foto: parsed.foto || "",
        video: parsed.video || "",
        videoName: parsed.video_name || "",
        dokumen: parsed.dokumen || "",
        dokumenName: parsed.dokumen_name || ""
      };
    } catch (e) {
      // fallback
    }
  }
  return { foto: raw, video: "", videoName: "", dokumen: "", dokumenName: "" };
};
