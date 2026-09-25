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

export const sanitizeSrc = (src: string | undefined | null): string | null => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};

export interface SyllabusItem {
  subject: string;
  desc: string;
}

export interface CareerItem {
  title: string;
  desc: string;
}

export interface GalleryItem {
  url: string;
  caption: string;
}

export interface MajorDetail {
  code: string;
  title: string;
  alias: string;
  subtitle: string;
  tagline: string;
  desc: string;
  color: string;
  accentColor: string;
  bgAccent: string;
  textAccent: string;
  glowColor: string;
  logo: string;
  banner: string;
  syllabus: SyllabusItem[];
  careers: CareerItem[];
  facilities: string[];
  gallery: GalleryItem[];
  partners: string;
}

export function hexToRgb(hex: string): string {
  try {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = (hex || "#0066ff").replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 102, 255";
  } catch (_) {
    return "0, 102, 255";
  }
}

export function getDarkerColor(hex: string, percent = 20): string {
  try {
    const cleanHex = (hex || "#0066ff").replace("#", "");
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return "#0044cc";
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    const clamp = (val: number) => val < 0 ? 0 : val > 255 ? 255 : val;
    const rHex = clamp(R).toString(16).padStart(2, "0");
    const gHex = clamp(G).toString(16).padStart(2, "0");
    const bHex = clamp(B).toString(16).padStart(2, "0");
    return `#${rHex}${gHex}${bHex}`;
  } catch (_) {
    return "#0044cc";
  }
}
