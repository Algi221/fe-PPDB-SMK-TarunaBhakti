/**
 * Sanitasi URL untuk mencegah DOM-based XSS (CWE-79).
 * Hanya mengizinkan skema http, https, mailto, tel, dan data URI gambar/PDF yang aman.
 * 
 * NOTE: Snyk static analysis may flag elements receiving values sanitized by this function
 * because static analyzers trace the dataflow from state/API variables to the DOM sink (src/href)
 * without evaluating the safety checks inside custom functions. These warnings are False Positives.
 * Safe protocols are strictly verified, preventing any 'javascript:' or arbitrary protocol execution.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "#";
  
  // Hardening: Hapus spasi dan karakter kontrol tersembunyi (seperti \u0000-\u001F, \t, \n, \r) 
  // yang sering digunakan untuk membypass deteksi protokol (misalnya 'java\tscript:')
  const cleaned = url.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "");

  // Izinkan path lokal relatif yang aman (tetapi tolak // untuk mencegah redirect eksternal terselubung)
  if (cleaned.startsWith("/") && !cleaned.startsWith("//")) {
    return cleaned;
  }

  // Izinkan data URIs untuk gambar dan PDF yang aman
  if (cleaned.toLowerCase().startsWith("data:")) {
    if (
      /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(cleaned) ||
      /^data:application\/pdf;base64,/i.test(cleaned)
    ) {
      return cleaned;
    }
    return "#";
  }

  // Hanya izinkan skema http, https, mailto, tel
  if (/^(https?|mailto|tel):/i.test(cleaned)) {
    return cleaned;
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

