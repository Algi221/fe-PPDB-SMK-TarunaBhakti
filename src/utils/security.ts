/**
 * Sanitasi URL untuk mencegah DOM-based XSS (CWE-79).
 * Hanya mengizinkan skema http, https, mailto, tel, dan data URI gambar/PDF yang aman.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "#";
  const trimmed = url.trim();

  // Izinkan path lokal relatif yang aman
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  // Izinkan data URIs untuk gambar dan PDF yang aman
  if (trimmed.startsWith("data:")) {
    if (
      /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(trimmed) ||
      /^data:application\/pdf;base64,/i.test(trimmed)
    ) {
      return trimmed;
    }
    return "#";
  }

  // Hanya izinkan skema http, https, mailto, tel
  if (/^(https?|mailto|tel):/i.test(trimmed)) {
    return trimmed;
  }

  return "#";
}

/**
 * Sanitasi src untuk tag img, iframe, dan video.
 * Jika URL tidak aman, mengembalikan string kosong untuk mencegah pemuatan.
 */
export function sanitizeSrc(src: string | undefined | null): string {
  if (!src) return "";
  const sanitized = sanitizeUrl(src);
  return sanitized === "#" ? "" : sanitized;
}
