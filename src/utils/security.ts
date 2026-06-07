
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "#";

  const cleaned = url.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "");

  if (cleaned.startsWith("/") && !cleaned.startsWith("//")) {
    return cleaned;
  }

  if (cleaned.toLowerCase().startsWith("data:")) {
    if (
      /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(cleaned) ||
      /^data:application\/pdf;base64,/i.test(cleaned)
    ) {
      return cleaned;
    }
    return "#";
  }

  if (/^(https?|mailto|tel):/i.test(cleaned)) {
    return cleaned;
  }

  return "#";
}

export function sanitizeSrc(src: string | undefined | null): string {
  if (!src) return "";
  const sanitized = sanitizeUrl(src);
  return sanitized === "#" ? "" : sanitized;
}

