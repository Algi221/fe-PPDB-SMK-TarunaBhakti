import dompurify from "dompurify";

export const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (e) {
    return "";
  }
};

export const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);

export interface Informasi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
  created_at?: string;
}

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

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  } catch (e) {
    return dateString;
  }
};

export const formatInputDate = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return "";
  }
};
