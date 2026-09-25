import React from "react";
import dompurify from "dompurify";
import { Code, Monitor, Palette, Sparkles, Film, Cpu } from "lucide-react";

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

export const sanitizeSrc = (src: string | undefined | null): string => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};

export const getMajorDetails = (majorName: string) => {
  const nameLower = (majorName || "").toLowerCase();
  if (nameLower.includes("rekayasa") || nameLower.includes("rpl") || nameLower.includes("perangkat lunak")) {
    return {
      icon: <Code className="w-5 h-5 text-blue-500" />,
      logoText: "RPL",
      logoPath: "/assets/jurusan/pplg.png",
      bg: "bg-blue-50 dark:bg-blue-950/45",
      textColor: "text-blue-600 dark:text-sky-400"
    };
  }
  if (nameLower.includes("jaringan") || nameLower.includes("tjkt") || nameLower.includes("komputer")) {
    return {
      icon: <Monitor className="w-5 h-5 text-amber-500" />,
      logoText: "TJKT",
      logoPath: "/assets/jurusan/tjkt.png",
      bg: "bg-amber-50 dark:bg-amber-950/45",
      textColor: "text-amber-600 dark:text-amber-400"
    };
  }
  if (nameLower.includes("desain") || nameLower.includes("dkv") || nameLower.includes("visual")) {
    return {
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      logoText: "DKV",
      logoPath: "/assets/jurusan/dkv.png",
      bg: "bg-purple-50 dark:bg-purple-950/45",
      textColor: "text-purple-600 dark:text-purple-400"
    };
  }
  if (nameLower.includes("animasi") || nameLower.includes("anm")) {
    return {
      icon: <Sparkles className="w-5 h-5 text-pink-500" />,
      logoText: "ANM",
      logoPath: "/assets/jurusan/animasi.png",
      bg: "bg-pink-50 dark:bg-pink-950/45",
      textColor: "text-pink-600 dark:text-pink-400"
    };
  }
  if (nameLower.includes("broadcast") || nameLower.includes("bc") || nameLower.includes("perfilman")) {
    return {
      icon: <Film className="w-5 h-5 text-red-500" />,
      logoText: "BC",
      logoPath: "/assets/jurusan/bc.png",
      bg: "bg-red-50 dark:bg-red-950/45",
      textColor: "text-red-600 dark:text-red-400"
    };
  }
  if (nameLower.includes("elektronika") || nameLower.includes("te")) {
    return {
      icon: <Cpu className="w-5 h-5 text-emerald-500" />,
      logoText: "TE",
      logoPath: "/assets/jurusan/te.png",
      bg: "bg-emerald-50 dark:bg-emerald-950/45",
      textColor: "text-emerald-600 dark:text-emerald-400"
    };
  }
  return {
    icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    logoText: "PPDB",
    logoPath: "",
    bg: "bg-blue-50 dark:bg-blue-950/45",
    textColor: "text-blue-600 dark:text-sky-400"
  };
};
