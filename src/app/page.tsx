"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  ArrowRight,
  X,
  GraduationCap,
  FileText,
  Award,
  Milestone,
  Check,
  Upload,
  User,
  MapPin,
  Calendar,
  Bell,
  ArrowLeft,
  HelpCircle,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Cpu,
  Layers,
  Video,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Users,
  Phone,
  Megaphone,
  Clock,
  Radio,
  Search,
  School
} from "lucide-react";

import DataPendaftarTable from "../components/DataPendaftarTable";
import ShinyText from "../components/ShinyText";
import ScrollFloat from "../components/ScrollFloat";
import dompurify from "dompurify";
import { usePPDB } from "@/context/PPDBContext";

const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    }) || null;
  } catch (e) {
    return null;
  }
};

const sanitizeSrc = (src: string | undefined | null): string | null => sanitizeUrl(src);

interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembayaran biaya pendaftaran?",
    a: "Pembayaran administrasi pendaftaran dapat diselesaikan melalui Transfer Bank Manual ke rekening resmi yayasan sekolah. Setelah melakukan transfer, harap unggah bukti transfer di portal pendaftaran untuk divalidasi oleh panitia."
  },
  {
    q: "Apa saja berkas persyaratan fisik yang wajib dibawa ke sekolah?",
    a: "Calon peserta didik baru diimbau membawa berkas asli dan fotokopi berupa: 1) Kartu Keluarga (KK), 2) KTP Orang Tua (Ayah & Ibu), 3) Akta Kelahiran, 4) Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL) resmi dilegalisir, dan 5) Pas foto berwarna terbaru ukuran 3x4 sebanyak 3 lembar."
  },
  {
    q: "Apakah ada batasan kuota pendaftaran untuk masing-masing jurusan?",
    a: "Ya, setiap program kompetensi keahlian memiliki batas kuota tampung maksimal yang diselaraskan dengan ketersediaan fasilitas laboratorium praktikum (misal 100 siswa per jurusan). Pendaftaran untuk jurusan tertentu akan ditutup otomatis ketika kuota terpenuhi. Selesaikan pembayaran segera untuk mengamankan kuota Anda."
  },
  {
    q: "Apakah ada tes seleksi masuk di SMK Taruna Bhakti?",
    a: "Ya, calon peserta didik baru akan mengikuti seleksi potensi akademik, tes minat bakat, serta wawancara kompetensi keahlian secara terjadwal setelah menyelesaikan pengisian formulir pendaftaran dan pembayaran biaya administrasi."
  }
];

const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website smktarunabhakti.net dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp" },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

interface Partner {
  name: string;
  sector: string;
  color: string;
  accent: string;
  url: string;
  iconType: string;
}

const PARTNERS_DATA: Partner[] = [
  { name: "TOA", sector: "Industry & Electronics", color: "#e11d48", accent: "rgba(225,29,72,0.15)", url: "https://toa.co.id/", iconType: "toa" },
  { name: "Biznet", sector: "Telecommunication & ISP", color: "#f97316", accent: "rgba(249,115,22,0.15)", url: "https://www.biznetnetworks.com/", iconType: "biznet" },
  { name: "Infection Studio", sector: "Creative & Animation", color: "#6366f1", accent: "rgba(99,102,241,0.15)", url: "https://infectionstudio.com/", iconType: "infection" },
  { name: "Icon+", sector: "Telecommunication & Network", color: "#14b8a6", accent: "rgba(20,184,166,0.15)", url: "https://iconnet.id/", iconType: "iconplus" },
  { name: "MD Animation", sector: "Creative & Animation", color: "#ef4444", accent: "rgba(239,68,68,0.15)", url: "https://mdentertainment.com/id/md-animations/", iconType: "mdanimation" },
  { name: "Hompimpa Animworks", sector: "Creative & Animation", color: "#9333ea", accent: "rgba(147,51,234,0.15)", url: "https://hompimpastudio.com/", iconType: "hompimpa" },
  { name: "Monsterdata", sector: "Technology & Data", color: "#06b6d4", accent: "rgba(6,182,212,0.15)", url: "https://monsterdata.co.id/", iconType: "monsterdata" },
  { name: "Ciptadrasoft", sector: "Software Development", color: "#3b82f6", accent: "rgba(59,130,246,0.15)", url: "https://ciptadrasoft.com/", iconType: "ciptadrasoft" },
  { name: "Assemblr", sector: "Augmented Reality & IT", color: "#8b5cf6", accent: "rgba(139,92,246,0.15)", url: "https://www.assemblrworld.com/", iconType: "assemblr" },
  { name: "Beyond Education Indonesia", sector: "Education & Training", color: "#4f46e5", accent: "rgba(79,70,229,0.15)", url: "https://beyondeducation.id/", iconType: "beyondeducation" },
  { name: "Daun Biru Engineering", sector: "Technology & Engineering", color: "#10b981", accent: "rgba(16,185,129,0.15)", url: "https://www.daunbiru.co.id/", iconType: "daunbiru" },
  { name: "Citra Film School", sector: "Broadcasting & Film", color: "#f59e0b", accent: "rgba(245,158,11,0.15)", url: "https://citrafilmschool.net/", iconType: "cfs" },
  { name: "Prasimax", sector: "Technology & IoT", color: "#dc2626", accent: "rgba(220,38,38,0.15)", url: "https://prasimax.com/", iconType: "prasimax" },
  { name: "Panasonic", sector: "Electronics & Industry", color: "#2563eb", accent: "rgba(37,99,235,0.15)", url: "https://www.panasonic.com/id/", iconType: "panasonic" },
  { name: "LUWES Inovasi Mandiri", sector: "Technology & Automation", color: "#f97316", accent: "rgba(249,115,22,0.15)", url: "https://luwes.id/", iconType: "luwes" },
  { name: "Pudak Scientific", sector: "Science & Education", color: "#22c55e", accent: "rgba(34,197,94,0.15)", url: "https://www.pudak-scientific.com/", iconType: "pudak" },
  { name: "Pupuk Kujang", sector: "Industry & Agriculture", color: "#84cc16", accent: "rgba(132,204,22,0.15)", url: "https://pupuk-kujang.co.id/", iconType: "pupukkujang" },
  { name: "Radio Rasil am720", sector: "Broadcasting & Media", color: "#0d9488", accent: "rgba(13,148,136,0.15)", url: "https://radiosilaturahim.com/", iconType: "rasil" },
  { name: "Beyond Films", sector: "Broadcasting & Film", color: "#7c3aed", accent: "rgba(124,58,237,0.15)", url: "https://beyondfilms.gr/", iconType: "beyondfilms" },
  { name: "POSTPLAY", sector: "Creative & Animation", color: "#d946ef", accent: "rgba(217,70,239,0.15)", url: "https://postplay.id/", iconType: "postplay" },
  { name: "Visi 8", sector: "Creative & Animation", color: "#ea580c", accent: "rgba(234,88,12,0.15)", url: "https://visi8.com/", iconType: "visi8" },
  { name: "Memento", sector: "Creative & Animation", color: "#fbbf24", accent: "rgba(251,191,36,0.15)", url: "https://memento.id/", iconType: "memento" },
  { name: "Skynet", sector: "Telecommunication & ISP", color: "#0ea5e9", accent: "rgba(14,165,233,0.15)", url: "https://sky.net.id/", iconType: "skynet" },
  { name: "Ristek", sector: "Technology & Education", color: "#3b82f6", accent: "rgba(59,130,246,0.15)", url: "https://ristek.id/", iconType: "ristek" },
  { name: "Museum Nasional Indonesia", sector: "Art, History & Gov", color: "#d97706", accent: "rgba(217,119,6,0.15)", url: "https://www.museumnasional.or.id/", iconType: "museumnasional" },
  { name: "ANIMO", sector: "Creative & Animation", color: "#f43f5e", accent: "rgba(244,63,94,0.15)", url: "https://animo.id/", iconType: "animo" },
  { name: "Pionicon", sector: "Creative & IP Dev", color: "#ea580c", accent: "rgba(234,88,12,0.15)", url: "https://pionicon.com/", iconType: "pionicon" },
  { name: "LSP SMK Taruna Bhakti", sector: "Certification & Edu", color: "#2563eb", accent: "rgba(37,99,235,0.15)", url: "https://smktarunabhakti.sch.id/", iconType: "lspsmktb" },
  { name: "MVNET", sector: "Telecommunication & ISP", color: "#06b6d4", accent: "rgba(6,182,212,0.15)", url: "https://mvnet.id/", iconType: "mvnet" },
  { name: "Sada Technology", sector: "Software & Integrator", color: "#4f46e5", accent: "rgba(79,70,229,0.15)", url: "https://sadata.id/", iconType: "sada" },
  { name: "Light Code Digital", sector: "Software & Digital Agency", color: "#9333ea", accent: "rgba(147,51,234,0.15)", url: "https://lightcodedigital.com/", iconType: "lightcodedigital" }
];

const renderPartnerSVG = (type: string, color: string) => {
  const strokeColor = color;
  const fillColor = `${color}20`; // 12.5% opacity for fill
  
  switch (type) {
    case "toa":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 6L6 38H42L24 6Z" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
          <path d="M20 26L24 30L28 26" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="24" y1="18" x2="24" y2="24" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "biznet":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 24C16 19.58 19.58 16 24 16C28.42 16 32 19.58 32 24C32 28.42 28.42 32 24 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M32 24C32 28.42 35.58 32 40 32C44.42 32 48 28.42 48 24C48 19.58 44.42 16 40 16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M8 24C8 19.58 11.58 16 16 16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="24" r="4" fill={strokeColor} />
          <circle cx="40" cy="24" r="4" fill={strokeColor} />
          <circle cx="8" cy="24" r="4" fill={strokeColor} />
        </svg>
      );
    case "infection":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L40 14V34L24 44L8 34V14L24 4Z" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
          <circle cx="24" cy="24" r="7" stroke={strokeColor} strokeWidth="3" />
          <path d="M24 17V8" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M18 27.5L10 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M30 27.5L38 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "iconplus":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M26 10L16 26H25L22 38L32 22H23L26 10Z" fill={strokeColor} />
        </svg>
      );
    case "mdanimation":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="10" width="36" height="28" rx="6" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M14 18V30H18L22 22L26 30H30V18" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 18C36 18 38 20 38 24C38 28 36 30 34 30" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "hompimpa":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="14" width="36" height="20" rx="10" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M16 24H20M18 22V26" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="28" cy="24" r="2.5" fill={strokeColor} />
          <circle cx="34" cy="24" r="2.5" fill={strokeColor} />
          <path d="M12 34L16 38" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M36 34L32 38" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "monsterdata":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="32" height="32" rx="8" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <circle cx="18" cy="20" r="3" fill={strokeColor} />
          <circle cx="30" cy="20" r="3" fill={strokeColor} />
          <path d="M16 30C19 33 29 33 32 30" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M12 6L16 10M36 6L32 10" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "ciptadrasoft":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L40 8V22C40 32.5 33 41.5 24 44C15 41.5 8 32.5 8 22V8L24 4Z" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
          <path d="M18 20L13 24L18 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30 20L35 24L30 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 18L22 30" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "assemblr":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 6L40 14L24 22L8 14L24 6Z" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" fill={fillColor} />
          <path d="M8 22L24 30L40 22" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M8 30L24 38L40 30" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 22V38" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );
    case "beyondeducation":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8L8 16L24 24L40 16L24 8Z" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
          <path d="M14 21V30C14 34 18 36 24 36C30 36 34 34 34 30V21" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
          <path d="M38 18V32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="32" r="2" fill={strokeColor} />
        </svg>
      );
    case "daunbiru":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4C35 4 40 12 40 24C40 36 35 44 24 44C13 44 8 36 8 24C8 12 13 4 24 4Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M24 4V44" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
          <path d="M14 24C16 18 20 16 24 16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M34 24C32 30 28 32 24 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "cfs":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="14" width="36" height="26" rx="4" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M6 22H42" stroke={strokeColor} strokeWidth="3" />
          <path d="M12 14L16 22M22 14L26 22M32 14L36 22" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "prasimax":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="28" height="28" rx="4" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M6 18H10M6 30H10M38 18H42M38 30H42M18 6V10M30 6V10M18 38V42M30 38V42" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="24" r="6" stroke={strokeColor} strokeWidth="3" />
        </svg>
      );
    case "panasonic":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="12" width="36" height="24" rx="4" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M14 18H22C24 18 26 19 26 21.5C26 24 24 25 22 25H18V30H14V18ZM18 22H22C23 22 23.5 21.8 23.5 21.5C23.5 21.2 23 21 22 21H18V22Z" fill={strokeColor} />
          <path d="M30 18L34 30M34 18L30 30" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "luwes":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 16C8.48 16 4 20.48 4 26C4 31.52 8.48 36 14 36C19.52 36 24 26 24 26C24 26 28.48 16 34 16C39.52 16 44 20.48 44 26C44 31.52 39.52 36 34 36C28.48 36 24 26 24 26C24 26 19.52 16 14 16Z" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
        </svg>
      );
    case "pudak":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C12 12 16 20 24 20C32 20 36 28 36 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M36 12C36 12 32 20 24 20C16 20 12 28 12 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="12" cy="12" r="4" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
          <circle cx="36" cy="12" r="4" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
          <circle cx="12" cy="28" r="4" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
          <circle cx="36" cy="28" r="4" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
          <line x1="24" y1="12" x2="24" y2="28" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );
    case "pupukkujang":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4C18 10 14 18 14 26C14 34.5 20 40 24 44C28 40 34 34.5 34 26C34 18 30 10 24 4Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M24 12V36M24 20L20 24M24 28L28 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "rasil":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 40L20 16L24 4L28 16L24 40Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <circle cx="24" cy="4" r="2" fill={strokeColor} />
          <path d="M16 12C12 16 12 24 16 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M32 12C36 16 36 24 32 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M10 6C4 12 4 28 10 34" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 6C44 12 44 28 38 34" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "beyondfilms":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="16" width="22" height="18" rx="4" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M28 21L40 15V35L28 29" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
          <circle cx="12" cy="10" r="4" stroke={strokeColor} strokeWidth="3" />
          <circle cx="22" cy="10" r="4" stroke={strokeColor} strokeWidth="3" />
        </svg>
      );
    case "postplay":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,10 38,24 16,38" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
          <path d="M6 10V38" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "visi8":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 24C6 24 14 10 24 10C34 10 42 24 42 24C42 24 34 38 24 38C14 38 6 24 6 24Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <circle cx="24" cy="24" r="6" stroke={strokeColor} strokeWidth="3" />
          <circle cx="26" cy="22" r="2.5" fill={strokeColor} />
        </svg>
      );
    case "memento":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8H36" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M12 40H36" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M14 8L22 22L14 36C14 38 16 40 18 40H30C32 40 34 38 34 36L26 22L34 8" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
          <circle cx="24" cy="32" r="3" fill={strokeColor} />
        </svg>
      );
    case "skynet":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 34C9.58 34 6 30.42 6 26C6 21.84 9.17 18.42 13.25 18.04C14.73 12.33 19.88 8 26 8C33.27 8 39.29 13.46 39.94 20.53C43.37 21.22 46 24.3 46 28C46 32.42 42.42 36 38 36H16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
          <circle cx="24" cy="26" r="3" fill={strokeColor} />
          <path d="M24 29V38" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="24" cy="40" r="2.5" fill={strokeColor} />
        </svg>
      );
    case "ristek":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="4" fill={strokeColor} />
          <ellipse cx="24" cy="24" rx="20" ry="7" stroke={strokeColor} strokeWidth="2.5" transform="rotate(30 24 24)" />
          <ellipse cx="24" cy="24" rx="20" ry="7" stroke={strokeColor} strokeWidth="2.5" transform="rotate(-30 24 24)" />
        </svg>
      );
    case "museumnasional":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 40H42M10 40V20M24 40V20M38 40V20M12 12L24 6L36 12" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
          <path d="M6 14H42" stroke={strokeColor} strokeWidth="3" />
        </svg>
      );
    case "animo":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 44C32.8366 44 40 36.8366 40 28C40 17 24 4 24 4C24 4 8 17 8 28C8 36.8366 15.1634 44 24 44Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M24 36C28.4183 36 32 32.4183 32 28C32 21 24 14 24 14C24 14 16 21 16 28C16 32.4183 19.5817 36 24 36Z" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );
    case "pionicon":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="14" r="8" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M16 38C16 28 32 28 32 38" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill={fillColor} />
          <rect x="12" y="38" width="24" height="4" rx="2" stroke={strokeColor} strokeWidth="3" fill={strokeColor} />
          <circle cx="22" cy="14" r="1.5" fill={strokeColor} />
          <circle cx="26" cy="14" r="1.5" fill={strokeColor} />
        </svg>
      );
    case "lspsmktb":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L38 10V22C38 32.5 32 40 24 44C16 40 10 32.5 10 22V10L24 4Z" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" fill={fillColor} />
          <path d="M18 24L22 28L30 18" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mvnet":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="14" r="4" fill={strokeColor} />
          <circle cx="38" cy="14" r="4" fill={strokeColor} />
          <circle cx="24" cy="34" r="4" fill={strokeColor} />
          <line x1="10" y1="14" x2="24" y2="34" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="38" y1="14" x2="24" y2="34" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="10" y1="14" x2="38" y2="14" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );
    case "sada":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 12C36 12 30 6 24 6C18 6 12 10 12 16C12 24 36 24 36 32C36 38 30 42 24 42C16 42 12 36 12 36" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3" fill={strokeColor} />
        </svg>
      );
    case "lightcodedigital":
      return (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 20C16 15.58 19.58 12 24 12C28.42 12 32 15.58 32 20C32 23.5 29 27.5 27 30H21C19 27.5 16 23.5 16 20Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <rect x="20" y="34" width="8" height="4" rx="2" stroke={strokeColor} strokeWidth="3" />
          <path d="M22 18H26M20 22H28" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <text x="12" y="16" textAnchor="middle" fill={strokeColor} fontSize="12" fontWeight="bold">{type.substring(0, 2).toUpperCase()}</text>
        </svg>
      );
  }
};

export default function Home() {
  const { publicApplicants, wsStatus } = usePPDB();
  
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [waAdmin, setWaAdmin] = useState("6281292244456");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqList, setFaqList] = useState<FaqItem[]>(DEFAULT_FAQ);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const [heroTitle, setHeroTitle] = useState("Penerimaan Siswa Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("Portal PPDB SMK Taruna Bhakti");
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.");
  const [phone, setPhone] = useState("(021) 8740756");
  const [email, setEmail] = useState("info@smktarunabhakti.sch.id");
  const [address, setAddress] = useState("Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [gelombangConfig, setGelombangConfig] = useState({
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  });

  const getGelombangStatus = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return { label: "Belum Diatur", color: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700", active: false };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);
    
    if (today < start) {
      return { label: "Akan Datang", color: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30", active: false };
    } else if (today >= start && today <= end) {
      return { label: "Sedang Berlangsung", color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30", active: true };
    } else {
      return { label: "Telah Ditutup", color: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/30", active: false };
    }
  };
  const [majors, setMajors] = useState([
    {
      code: "RPL",
      title: "Rekayasa Perangkat Lunak",
      icon: Cpu,
      logo: "/jurusan/pplg.png",
      desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
      color: "#0066ff",
      careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
      facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
    },
    {
      code: "TJKT",
      title: "Teknik Jaringan Komputer & Telekomunikasi",
      icon: Layers,
      logo: "/jurusan/tjkt.png",
      desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
      color: "#0ea5e9",
      careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
      facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
    },
    {
      code: "DKV",
      title: "Desain Komunikasi Visual",
      icon: BookOpen,
      logo: "/jurusan/dkv.png",
      desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
      color: "#6366f1",
      careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
      facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
    },
    {
      code: "BC",
      title: "Broadcasting & Perfilman",
      icon: Video,
      logo: "/jurusan/bc.png",
      desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
      color: "#f59e0b",
      careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
      facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
    },
    {
      code: "ANM",
      title: "Animasi",
      icon: Palette,
      logo: "/jurusan/animasi.png",
      desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
      color: "#ec4899",
      careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
      facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab, Sound Recording Room"
    },
    {
      code: "TE",
      title: "Teknik Elektronika",
      icon: Cpu,
      logo: "/jurusan/te.png",
      desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
      color: "#10b981",
      careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
      facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
    }
  ]);

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  const [loadVideo, setLoadVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ["/videos/vid1.webm", "/videos/vid2.webm"];
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log(e));
    }
  }, [currentVideo, loadVideo]);

  useEffect(() => {
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setLoadVideo(true);
      }, 3500);
      return timer;
    };

    if (document.readyState === 'complete') {
      const timer = handleLoad();
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      let timer: any;
      const onWindowLoad = () => {
        timer = handleLoad();
      };
      window.addEventListener('load', onWindowLoad);
      return () => {
        window.removeEventListener('load', onWindowLoad);
        if (timer) clearTimeout(timer);
      };
    }
  }, []);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const loadDynamicConfig = async () => {
      try {
        
        const localAlur = localStorage.getItem("ppdb_alur_config");
        if (localAlur) {
          try {
            setAlurList(JSON.parse(localAlur));
          } catch (e) {
            console.error("Gagal parse alur dari localStorage", e);
          }
        }

        const localFaq = localStorage.getItem("ppdb_faq_config");
        if (localFaq) {
          try {
            setFaqList(JSON.parse(localFaq));
          } catch (e) {
            console.error("Gagal parse FAQ dari localStorage", e);
          }
        }

        const res = await fetch("http://localhost:5000/api/config");
        const data = await res.json();

        if (data.success && data.data) {
          const config = data.data;
          if (config.ppdb_hero_title) setHeroTitle(config.ppdb_hero_title);
          if (config.ppdb_hero_title_sub) setHeroTitleSub(config.ppdb_hero_title_sub);
          if (config.ppdb_hero_subtitle) setHeroSubtitle(config.ppdb_hero_subtitle);
          if (config.ppdb_phone) setPhone(config.ppdb_phone);
          if (config.ppdb_email) setEmail(config.ppdb_email);
          if (config.ppdb_address) setAddress(config.ppdb_address);
          if (config.ppdb_school_period) setSchoolPeriod(config.ppdb_school_period);
          if (config.ppdb_wa_group_url) setWaGroupUrl(config.ppdb_wa_group_url);
          if (config.ppdb_wa_admin) setWaAdmin(config.ppdb_wa_admin);
          if (config.ppdb_alur_config) setAlurList(config.ppdb_alur_config);
          if (config.ppdb_faq_config) setFaqList(config.ppdb_faq_config);
          if (config.ppdb_gelombang_config) setGelombangConfig(config.ppdb_gelombang_config);
          if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config)) {
            const iconMap: Record<string, any> = {
              RPL: Cpu,
              TJKT: Layers,
              DKV: BookOpen,
              BC: Video,
              ANM: Palette,
              TE: Cpu
            };
            const mapped = config.ppdb_majors_config.map((m: any) => ({
              ...m,
              icon: iconMap[m.code] || Cpu
            }));
            setMajors(mapped);
          }
        }
      } catch (e) {
        console.log("Failed to load dynamic configuration from backend:", e);
      }
    };

    loadDynamicConfig();
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ppdb-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ppdb-theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMajorsVisible, setIsMajorsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMajorsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.05 }
    );
    const element = document.getElementById("majors");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">

      {/* FLOATING NAVBAR */}
      <div className="navbar-wrapper">
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <a href="#" className="logo-container">
              <Image src="/logo_smktb.png" alt="Logo SMK TB" width={36} height={36} className="w-9 h-9 object-contain" priority />
              <span className="logo-text font-extrabold">PPDB <span>SMK TB</span></span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a href="#alur" className="btn-nav-link">Alur Pendaftaran</a>
            <a href="#majors" className="btn-nav-link">Jurusan</a>
            <a href="#kemitraan" className="btn-nav-link">Mitra Industri</a>
            <Link href="/forum" className="btn-nav-link">Forum Informasi</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/daftar" className="btn-primary-pill !hidden md:!inline-flex">
              Daftar
            </Link>

            {/* Hamburger Button visible only on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-[101]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/98 backdrop-blur-2xl animate-in fade-in duration-300 md:hidden">
          {/* Close Button X in top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X size={20} />
          </button>

          {/* Decorative gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link href="#" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-6">
              <Image src="/logo_smktb.png" alt="Logo SMK TB" width={48} height={48} className="w-12 h-12 object-contain" />
              <span className="text-2xl font-black text-slate-800 dark:text-white">PPDB <span className="text-blue-600 dark:text-blue-400">SMK TB</span></span>
            </Link>

            <a
              href="#alur"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Alur Pendaftaran
            </a>
            <a
              href="#majors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Jurusan
            </a>
            <a
              href="#kemitraan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Mitra Industri
            </a>
            <Link
              href="/forum"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Forum Informasi
            </Link>

            <div className="w-full flex flex-col gap-3 mt-8">
              <Link
                href="/daftar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                Daftar Sekarang
              </Link>
              <button
                onClick={() => { toggleDark(); setMobileMenuOpen(false); }}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION WRAPPER */}
      <main className="flex-grow w-full">
        <div className="relative w-full overflow-hidden">
          {/* Video Background - Full Width */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {loadVideo && (
              <video
                ref={videoRef}
                src={videos[currentVideo]}
                autoPlay
                muted
                playsInline
                preload="none"
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover transition-opacity duration-1000"
                aria-hidden="true"
              >
                <track kind="captions" label="No captions" default />
              </video>
            )}
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/60 backdrop-blur-sm"></div>
          </div>

        {/* HERO SECTION */}
        <section className="hero">

          {/* Floating elements representing major names as requested */}
          <Link href="/jurusan/rpl" className="floating-badge badge-aset">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <Image src="/jurusan/pplg.png" alt="" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div className="badge-info">
              <span>PPLG</span>
            </div>
          </Link>

          <Link href="/jurusan/tjkt" className="floating-badge badge-peminjaman">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <Image src="/jurusan/tjkt.png" alt="" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div className="badge-info">
              <span>TJKT</span>
            </div>
          </Link>

          <Link href="/jurusan/te" className="floating-badge badge-te">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <Image src="/jurusan/te.png" alt="" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div className="badge-info">
              <span>TE</span>
            </div>
          </Link>

          <Link href="/jurusan/dkv" className="floating-badge badge-laporan">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <Image src="/jurusan/dkv.png" alt="" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div className="badge-info">
              <span>DKV</span>
            </div>
          </Link>

          <Link href="/jurusan/an" className="floating-badge badge-animasi">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <Image src="/jurusan/animasi.png" alt="" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div className="badge-info">
              <span>Animasi</span>
            </div>
          </Link>

          <Link href="/jurusan/bc" className="floating-badge badge-kelas">
            <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
              <Image src="/jurusan/bc.png" alt="" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div className="badge-info">
              <span>Broadcasting</span>
            </div>
          </Link>

          {/* Hero Copy */}
          <div className="badge-wrapper relative z-10">
            <span className="badge-pill">SMK TARUNA BHAKTI DEPOK</span>
          </div>

          <h1 className="hero-title relative z-10">
            {heroTitle} <br />
            <ShinyText 
              text={heroTitleSub} 
              speed={3} 
              delay={1} 
              color="var(--primary)" 
              shineColor="#0ea5e9" 
              spread={135} 
            />
          </h1>

          <p className="hero-subtitle relative z-10">
            {heroSubtitle}
          </p>

          <div className="hero-action">
            <Link href="/daftar" className="btn-hero-action">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          {/* APP MOCKUP WRAPPER */}
          <div className="mockup-container relative z-10">
            <div className="app-mockup">

              {/* Mockup Browser Top bar */}
              <div className="mockup-browser-bar">
                <div className="browser-dots">
                  <span className="dot-red"></span>
                  <span className="dot-yellow"></span>
                  <span className="dot-green"></span>
                </div>
                <div className="browser-address">ppdb.smktarunabhakti.sch.id/dashboard</div>
                <div className="w-4"></div>
              </div>

              {/* Data Pendaftar Table View */}
              <div className="dashboard-view block w-full p-6 h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative z-10 rounded-2xl transition-colors duration-300">
                <DataPendaftarTable />
              </div>

            </div>
          </div>

        </section>
      </div>
      {/* JADWAL GELOMBANG PENDAFTARAN */}
      <section id="gelombang" className="py-20 max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block mb-2 text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full">
            Jadwal Penerimaan · TP. {schoolPeriod}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-3 mb-3">
            Gelombang Pendaftaran PPDB
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
            Perhatikan rentang tanggal pendaftaran di setiap gelombang untuk mengamankan kuota jurusan pilihan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Gelombang 1 Card */}
          {(() => {
            const status = getGelombangStatus(gelombangConfig.gelombang1.start, gelombangConfig.gelombang1.end);
            return (
              <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border ${status.active ? 'border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5' : 'border-white/50 dark:border-slate-800'} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
                {status.active && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Periode Pertama</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 1</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
                    {status.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    {status.label}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-150 dark:border-white/5">
                    <Calendar size={18} className="text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pendaftaran</span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        {gelombangConfig.gelombang1.start ? formatDate(gelombangConfig.gelombang1.start) : "Belum diatur"} - {gelombangConfig.gelombang1.end ? formatDate(gelombangConfig.gelombang1.end) : "Belum diatur"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Gelombang 2 Card */}
          {(() => {
            const status = getGelombangStatus(gelombangConfig.gelombang2.start, gelombangConfig.gelombang2.end);
            return (
              <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border ${status.active ? 'border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5' : 'border-white/50 dark:border-slate-800'} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
                {status.active && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Periode Kedua</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 2</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
                    {status.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    {status.label}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-155 dark:border-white/5">
                    <Calendar size={18} className="text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pendaftaran</span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        {gelombangConfig.gelombang2.start ? formatDate(gelombangConfig.gelombang2.start) : "Belum diatur"} - {gelombangConfig.gelombang2.end ? formatDate(gelombangConfig.gelombang2.end) : "Belum diatur"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ALUR PENDAFTARAN */}
      <section id="alur" className="py-24 relative z-10 border-b border-slate-200/50 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <ScrollFloat
              containerClassName="inline-block mb-2"
              textClassName="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.02}
            >
              Proses Mudah &amp; Transparan · TP. {schoolPeriod}
            </ScrollFloat>
            <ScrollFloat
              containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}
            >
              Alur Pendaftaran PPDB
            </ScrollFloat>
            <ScrollFloat
              containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.01}
              textMode={false}
            >
              Ikuti 6 langkah sederhana berikut untuk menjadi bagian dari SMK Taruna Bhakti Depok.
            </ScrollFloat>
          </div>

          <div className="relative">
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-indigo-500 transform -translate-x-1/2 z-0 rounded-full opacity-70"></div>
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-white/40 dark:border-slate-950/40 transform -translate-x-1/2 z-0"></div>

            <div className="space-y-16 relative z-10 w-full">
              {alurList.map((item, index) => {
                const isLeft = index % 2 === 0;

                const styles = [
                  { color: "blue", bg: "bg-blue-600", text: "text-blue-700 dark:text-blue-300", bgLight: "bg-blue-50 dark:bg-blue-950/60", shadow: "shadow-[0_0_20px_rgba(37,99,235,0.4)]", borderHover: "hover:border-blue-500/20", icon: FileText },
                  { color: "amber", bg: "bg-amber-500", text: "text-amber-800 dark:text-amber-300", bgLight: "bg-amber-50 dark:bg-amber-950/60", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]", borderHover: "hover:border-amber-500/20", icon: CreditCard },
                  { color: "teal", bg: "bg-teal-500", text: "text-teal-700 dark:text-teal-300", bgLight: "bg-teal-50 dark:bg-teal-950/60", shadow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]", borderHover: "hover:border-teal-500/20", icon: Phone },
                  { color: "rose", bg: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", bgLight: "bg-rose-50 dark:bg-rose-950/60", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]", borderHover: "hover:border-rose-500/20", icon: Users },
                  { color: "indigo", bg: "bg-indigo-600", text: "text-indigo-700 dark:text-indigo-300", bgLight: "bg-indigo-50 dark:bg-indigo-950/60", shadow: "shadow-[0_0_20px_rgba(79,70,229,0.4)]", borderHover: "hover:border-indigo-500/20", icon: Award },
                  { color: "emerald", bg: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", bgLight: "bg-emerald-50 dark:bg-emerald-950/60", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]", borderHover: "hover:border-emerald-500/20", icon: ShieldCheck },
                ];

                const stepStyle = styles[index % styles.length];
                const Icon = stepStyle.icon;

                return (
                  <ScrollFloat
                    key={item.id}
                    containerClassName="w-full"
                    textClassName="w-full"
                    textMode={false}
                    scrollStart="top 85%"
                    scrollEnd="bottom 60%"
                  >
                    <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                      {isLeft ? (
                        <>
                          <div className="pl-20 md:pl-0 md:pr-12 md:text-right">
                            <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}>
                              <span className={`inline-block px-3 py-1 ${stepStyle.bgLight} ${stepStyle.text} rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3`}>Tahap 0{item.id}</span>
                              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                          </div>
                          <div className="hidden md:block"></div>
                        </>
                      ) : (
                        <>
                          <div className="hidden md:block"></div>
                          <div className="pl-20 md:pl-12 md:text-left">
                            <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}>
                              <span className={`inline-block px-3 py-1 ${stepStyle.bgLight} ${stepStyle.text} rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3`}>Tahap 0{item.id}</span>
                              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                          </div>
                        </>
                      )}
                      <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${stepStyle.bg} border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 ${stepStyle.shadow} transition-all duration-300`}>
                        <Icon size={22} />
                      </div>
                    </div>
                  </ScrollFloat>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM KEAHLIAN / JURUSAN GRID */}
      <section id="majors" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <ScrollFloat
            containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            Program Kompetensi Keahlian
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.01}
            textMode={false}
          >
            Tersedia 6 jurusan unggulan dengan kurikulum berstandar industri nasional maupun internasional.
          </ScrollFloat>
        </div>

        <ScrollFloat containerClassName="w-full" textClassName="w-full" textMode={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major, index) => {
            return (
              <Link
                href={`/jurusan/${major.code.toLowerCase()}`}
                key={major.code}
                className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white border border-slate-100 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/20">
                    <Image
                      src={sanitizeSrc(major.logo) || "/logo_smktb.png"}
                      alt={`Logo ${major.code}`}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-contain drop-shadow-sm"
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-blue-50');
                          parent.querySelectorAll('.fallback-code').forEach((el: any) => el.remove());
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.style.color = '#0066ff';
                          fallbackDiv.style.display = 'flex';
                          fallbackDiv.style.alignItems = 'center';
                          fallbackDiv.style.justifyContent = 'center';
                          fallbackDiv.style.width = '100%';
                          fallbackDiv.style.height = '100%';
                          fallbackDiv.style.fontWeight = '800';
                          fallbackDiv.style.fontSize = '11px';
                          fallbackDiv.textContent = major.code;
                          fallbackDiv.classList.add('fallback-code');
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-3">
                    {major.code === "AN" ? major.title : `${major.title} (${major.code})`}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{major.desc.substring(0, 105)}...</p>
                </div>
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors relative z-10">
                  Lihat Selengkapnya <ChevronRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
            );
          })}
          </div>
        </ScrollFloat>
      </section>

      {/* KEMITRAAN INDUSTRI */}
      <section id="kemitraan" className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200/30">
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="inline-block mb-2"
            textClassName="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.02}
          >
            Kemitraan Industri
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 mt-4 mb-4"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            Gerbang Karir Global Taruna Bhakti
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.01}
            textMode={false}
          >
            Kurikulum berstandar internasional yang diselaraskan langsung dengan raksasa teknologi dunia, menghasilkan lulusan berdaya saing tinggi.
          </ScrollFloat>
        </div>

        <ScrollFloat containerClassName="bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-sm w-full" textClassName="w-full" textMode={false}>
          <p className="text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">
            Mitra Hubungan Industri &amp; Sertifikasi Internasional &middot; 31 Perusahaan Utama
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {PARTNERS_DATA.map((partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-between p-5 bg-white/40 dark:bg-slate-900/40 hover:bg-white/95 dark:hover:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                title={partner.name}
              >
                {/* Brand glow overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${partner.accent} 0%, transparent 70%)`
                  }}
                />
                
                {/* SVG Icon */}
                <div className="relative z-10 flex items-center justify-center h-16 w-16 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {renderPartnerSVG(partner.iconType, partner.color)}
                </div>
                
                {/* Partner Details */}
                <div className="relative z-10 text-center w-full">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white line-clamp-1 transition-colors">
                    {partner.name}
                  </h4>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight line-clamp-1 mt-0.5">
                    {partner.sector}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </ScrollFloat>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-950 relative z-10 border-t border-slate-200/50 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollFloat
              containerClassName="inline-block mb-2"
              textClassName="text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.02}
            >
              FAQ PPDB
            </ScrollFloat>
            <ScrollFloat
            containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            Pertanyaan yang Sering Diajukan
          </ScrollFloat>
            <ScrollFloat
              containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.01}
              textMode={false}
            >
              Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru SMK Taruna Bhakti.
            </ScrollFloat>
          </div>

          <div className="space-y-6 w-full">
            {faqList.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <ScrollFloat
                  key={idx}
                  containerClassName="w-full"
                  textClassName="w-full"
                  textMode={false}
                  scrollStart="top 90%"
                  scrollEnd="bottom 75%"
                >
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-black text-sm md:text-base text-slate-800 dark:text-white focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <span className={`text-blue-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronRight size={20} className="rotate-90" />
                      </span>
                    </button>
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-60 border-t border-slate-200/50 dark:border-slate-800/50" : "max-h-0"
                      }`}
                    >
                      <p className="px-6 py-5 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </ScrollFloat>
              );
            })}
          </div>

          <div className="mt-12 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150/40 dark:border-blue-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 dark:opacity-10 pointer-events-none">
              <HelpCircle size={96} className="text-blue-600 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Masih Mengalami Kendala atau Pertanyaan Lain?</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto leading-relaxed">
              Tim panitia PPDB SMK Taruna Bhakti siap membantu Anda secara langsung. Klik tombol di bawah untuk konsultasi via WhatsApp.
            </p>
            
            <a 
              href={sanitizeUrl(`https://wa.me/${waAdmin.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                "Halo Admin PPDB SMK Taruna Bhakti, saya calon pendaftar PPDB TP 2026/2027. Saya ingin berkonsultasi mengenai proses pendaftaran karena mengalami kendala teknis."
              )}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-8 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone size={14} />
              <span>Konsultasi Lewat WA Admin</span>
            </a>
          </div>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 py-16 transition-colors duration-300 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-500 dark:text-slate-400">
            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo_smktb.png" alt="Logo SMK TB" width={48} height={48} className="w-12 h-12 object-contain shrink-0" loading="lazy" />
                <div>
                  <span className="logo-text font-black text-slate-800 dark:text-white text-lg">PPDB <span className="text-blue-600 dark:text-sky-400">SMK TB</span></span>
                  <span className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">SMK Taruna Bhakti</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global sejak 1987.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/starbhak.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link instagram"
                  title="Instagram Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@starbhak.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link youtube"
                  title="YouTube Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.399.564C.776 4.337-.026 5.141-.298 6.163 0 8.01 0 12 0 12s0 3.99.298 5.837c.272 1.022 1.074 1.826 2.099 2.099C4.45 20.5 12 20.5 12 20.5s7.55 0 9.399-.564c1.025-.273 1.827-1.077 2.099-2.099C24 15.99 24 12 24 12s0-3.99-.298-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@starbhak.official?lang=id-ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link tiktok"
                  title="TikTok Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.46-.07-.05-.13-.1-.19-.15v5.08c.03 2.76-1.11 5.46-3.21 7.15-2.3 1.88-5.5 2.5-8.29 1.63-2.93-.93-5.27-3.41-6.01-6.42-.87-3.51.52-7.46 3.49-9.56 1.86-1.32 4.17-1.83 6.41-1.42V9.3c-1.07-.34-2.28-.19-3.22.42-1.08.7-1.74 1.94-1.73 3.22.01 1.42.87 2.77 2.19 3.29 1.34.52 2.92.21 3.93-.76.92-.88 1.34-2.18 1.25-3.44V0h-.02z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/smktarunabhaktidepok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link facebook"
                  title="Facebook Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Program Keahlian</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href="/jurusan/rpl" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Rekayasa Perangkat Lunak (PPLG)</Link></li>
                <li><Link href="/jurusan/tjkt" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Jaringan Komputer &amp; Telkom (TJKT)</Link></li>
                <li><Link href="/jurusan/dkv" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Desain Komunikasi Visual (DKV)</Link></li>
                <li><Link href="/jurusan/bc" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Broadcasting &amp; Perfilman (BC)</Link></li>
                <li><Link href="/jurusan/an" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Animasi (AN)</Link></li>
                <li><Link href="/jurusan/te" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Elektronika (TE)</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Link Terkait</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Brosur PPDB {schoolPeriod.split("-")[0]}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Syarat Pendaftaran</a></li>
                <li><Link href="/forum" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Forum Informasi</Link></li>
                <li><a href="https://smktarunabhakti.sch.id/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Company Profil Sekolah</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Sekretariat PPDB</h4>
              <p className="text-xs leading-relaxed font-semibold">
                {address}
              </p>
              <div className="text-xs font-bold space-y-1">
                <div>Telp: {phone}</div>
                <div>Email: {email}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <div>© {new Date().getFullYear()} SMK Taruna Bhakti Depok. All Rights Reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
              <span>·</span>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Syarat &amp; Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL BERITA / INFORMASI DETAIL DIHAPUS KARENA TIDAK DIGUNAKAN DI LANDING PAGE */}

    </div>
  );
}
