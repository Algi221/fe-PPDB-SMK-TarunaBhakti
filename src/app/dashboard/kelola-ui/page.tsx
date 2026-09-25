"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import HeroSection from "@/components/dashboard/kelola-ui/HeroSection";
import MajorsSection from "@/components/dashboard/kelola-ui/MajorsSection";
import AlurSection from "@/components/dashboard/kelola-ui/AlurSection";
import FormSection from "@/components/dashboard/kelola-ui/FormSection";
import FAQSection from "@/components/dashboard/kelola-ui/FAQSection";
import RevisionsSection from "@/components/dashboard/kelola-ui/RevisionsSection";
import BankSection from "@/components/dashboard/kelola-ui/BankSection";
import PartnersSection from "@/components/dashboard/kelola-ui/PartnersSection";
import { 
  Palette, 
  Settings, 
  HelpCircle, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Info,
  Clock,
  RotateCcw,
  FileText,
  Video,
  Eye,
  GraduationCap,
  Briefcase,
  ArrowLeft,
  Calendar,
  Database,
  Building
} from "lucide-react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { sanitizeSrc } from "@/utils/security";
import DOMPurify from "dompurify";
import Swal from 'sweetalert2';


interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

interface CareerItem {
  title: string;
  desc: string;
}

interface GalleryItem {
  url: string;
  caption: string;
}

interface MajorItem {
  code: string;
  title: string;
  desc: string;
  color: string;
  careers: CareerItem[];
  facilities: string[];
  logo: string;
  banner: string;
  video: string;
  gallery: GalleryItem[];
}

interface RevisionLog {
  id: number;
  changed_by: string;
  description: string;
  created_at: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface PartnerItem {
  id: number;
  name: string;
  logo: string;
  url: string;
  h: string;
}

const DEFAULT_PARTNERS: PartnerItem[] = [
  { id: 1, name: "TOA", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/PT-TOA.png", url: "https://toa.co.id/", h: "h-8" },
  { id: 2, name: "Biznet", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/biznet_vertical_logo.png", url: "https://www.biznetnetworks.com/", h: "h-20" },
  { id: 3, name: "Icon+", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/56e83c6db8cd5587e87161281dfba75b.webp", url: "https://plniconplus.co.id/", h: "h-14" },
  { id: 4, name: "MD Animation", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Logo_md_animation.png", url: "https://mdentertainment.com/", h: "h-8" },
  { id: 5, name: "Hompimpa Animworks", logo: "https://www.google.com/s2/favicons?domain=hompimpa.co.id&sz=256", url: "https://hompimpa.co.id/", h: "h-12" },
  { id: 6, name: "Monsterdata", logo: "https://www.google.com/s2/favicons?domain=monsterdata.asia&sz=256", url: "https://monsterdata.asia/?utm_source=chatgpt.com", h: "h-12" },
  { id: 7, name: "Ciptadrasoft", logo: "https://www.google.com/s2/favicons?domain=citcom.id&sz=256", url: "https://citcom.id/", h: "h-12" },
  { id: 8, name: "Assemblr", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/6156e76e275fa19ed9a33fa3_Group-33959.png", url: "https://assemblrworld.com/", h: "h-20" },
  { id: 9, name: "Daun Biru Engineering", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/E-Learning-5.png", url: "https://daunbiru.co.id/", h: "h-12" },
  { id: 10, name: "Citra Film School", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/cropped-Logo-baru-citra.png", url: "https://citrafilmschool.net/", h: "h-20" },
  { id: 11, name: "Prasimax", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Prasimax_Logo.png", url: "https://prasimax.com/", h: "h-10" },
  { id: 12, name: "Panasonic", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/8225.png", url: "https://www.panasonic.com/id/", h: "h-8" },
  { id: 13, name: "LUWES INOVASI MANDIRI", logo: "https://luwesinovasimandiri.com/_astro/logo.DBn-6O1s.webp", url: "https://luwesinovasimandiri.com/", h: "h-12" },
  { id: 14, name: "PUDAK SCIENTIFIC", logo: "https://www.google.com/s2/favicons?domain=pudak-scientific.com&sz=256", url: "https://www.pudak-scientific.com/", h: "h-12" },
  { id: 15, name: "Pupuk Kujang Cikampek", logo: "https://www.google.com/s2/favicons?domain=pupuk-kujang.co.id&sz=256", url: "https://www.pupuk-kujang.co.id/", h: "h-12" },
  { id: 16, name: "Rasil AM 720", logo: "https://www.google.com/s2/favicons?domain=radiosilaturahim.com&sz=256", url: "https://www.radiosilaturahim.com/", h: "h-12" },
  { id: 17, name: "Beyond Films", logo: "https://www.google.com/s2/favicons?domain=beyondfilms.co.id&sz=256", url: "http://www.beyondfilms.co.id", h: "h-12" },
  { id: 18, name: "POSTPLAY", logo: "https://www.google.com/s2/favicons?domain=linktr.ee&sz=256", url: "https://linktr.ee/postplayindonesia?utm_source=chatgpt.com", h: "h-12" },
  { id: 19, name: "VISI 8", logo: "https://www.google.com/s2/favicons?domain=visi8.com&sz=256", url: "https://visi8.com/", h: "h-12" },
  { id: 20, name: "MEMENTO", logo: "https://www.google.com/s2/favicons?domain=mementoworks.id&sz=256", url: "https://mementoworks.id", h: "h-12" },
  { id: 21, name: "SKYNET", logo: "https://www.google.com/s2/favicons?domain=sky.net.id&sz=256", url: "https://sky.net.id/?utm_source=chatgpt.com", h: "h-12" },
  { id: 22, name: "Museum Nasional Indonesia", logo: "https://www.google.com/s2/favicons?domain=museumnasional.or.id&sz=256", url: "https://www.museumnasional.or.id/", h: "h-12" },
  { id: 23, name: "ANIMO", logo: "https://www.google.com/s2/favicons?domain=fiverr.com&sz=256", url: "https://www.fiverr.com/animo_studio?utm_source=chatgpt.com", h: "h-12" },
  { id: 24, name: "PIONICON", logo: "/partners/pionicon.jpg", url: "https://pionicon.com/", h: "h-12" },
  { id: 25, name: "Circle Logo", logo: "https://www.google.com/s2/favicons?domain=seamolec.org&sz=256", url: "https://seamolec.org/", h: "h-12" },
  { id: 26, name: "mvnet", logo: "https://www.google.com/s2/favicons?domain=mvnet.co.id&sz=256", url: "https://mvnet.co.id/", h: "h-12" },
  { id: 27, name: "SADA TECHNOLOGY", logo: "https://www.google.com/s2/favicons?domain=sada.id&sz=256", url: "https://sada.id/", h: "h-12" },
  { id: 28, name: "LIGHT CODE DIGITAL", logo: "https://www.google.com/s2/favicons?domain=lightcodedigital.com&sz=256", url: "https://lightcodedigital.com/", h: "h-12" },
];

const formatRupiah = (value: string) => {
  if (!value) return "Rp ";
  const clean = value.replace(/[^0-9]/g, "");
  if (!clean) return "Rp ";
  const num = parseInt(clean, 10);
  return "Rp " + num.toLocaleString("id-ID");
};

const formatPhoneNumber = (value: string) => {
  if (!value) return "";

  let clean = value.replace(/[^\d+]/g, "");

  if (clean.startsWith("0")) {
    clean = "+62" + clean.slice(1);
  }
  // If it starts with '62', prepend '+'
  else if (clean.startsWith("62")) {
    clean = "+" + clean;
  }
  // If it doesn't start with '+62' and isn't empty, prepend '+62'
  else if (clean && !clean.startsWith("+62")) {
    if (clean.startsWith("+")) {
      clean = "+62" + clean.slice(1);
    } else {
      clean = "+62" + clean;
    }
  }
  
  return clean;
};

const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website smktarunabhakti.net dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp" },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembayaran biaya pendaftaran?",
    a: "Pembayaran administrasi pendaftaran dapat diselesaikan melalui Transfer Bank Manual ke rekening resmi yayasan sekolah. Setelah melakukan transfer, harap unggah bukti transfer di portal pendaftaran untuk divalidasi oleh panitia."
  },
  {
    q: "Apa saja berkas persyaratan fisik yang wajib dibawa ke sekolah?",
    a: "Calon peserta didik baru diimbau membawa berkas asli and fotokopi berupa: 1) Kartu Keluarga (KK), 2) KTP Orang Tua (Ayah & Ibu), 3) Akta Kelahiran, 4) Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL) resmi dilegalisir, dan 5) Pas foto berwarna terbaru ukuran 3x4 sebanyak 3 lembar."
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

const DEFAULT_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
    careers: [
      { title: "Fullstack Web Developer", desc: "Merancang dan membangun arsitektur frontend dan backend aplikasi web modern." },
      { title: "Mobile Application Developer", desc: "Mengembangkan aplikasi mobile berkinerja tinggi untuk iOS dan Android." },
      { title: "Game Programmer", desc: "Menulis kode logika interaktif, AI musuh, dan fisika game menggunakan engine Unity." },
      { title: "Cloud Integration Specialist", desc: "Mengelola arsitektur server awan yang aman, andal, dan skalabel dengan AWS." }
    ],
    facilities: [
      "iMac Core-i9 Software Developer Lab",
      "ASUS ROG Game & Production Lab",
      "Smart Interactive Classroom (Smartboard Integrated)",
      "AWS Cloud Academy Learning Station",
      "Google Developer Partner Studio Lab"
    ],
    logo: "/assets/jurusan/pplg.png",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop", caption: "Sesi Kolaborasi UI/UX & Coding Project" },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", caption: "Peer Programming Workshop Siswa RPL" },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", caption: "Praktik Penulisan Kode Algoritma Kompleks" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop", caption: "Presentasi Pitching Project Akhir Semester" }
    ]
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: [
      { title: "Network Engineer", desc: "Merancang, memasang, dan memelihara sistem jaringan korporasi multi-lokasi." },
      { title: "Cybersecurity Analyst", desc: "Melindungi aset data digital perusahaan dari ancaman hacker dan intrusi jaringan." },
      { title: "System Administrator", desc: "Menjamin kestabilan, performa, dan pencadangan data otomatis di server perusahaan." },
      { title: "Fiber Optic Specialist", desc: "Menginstalasi dan menyambung infrastruktur kabel serat optik kecepatan tinggi." }
    ],
    facilities: [
      "CISCO Academy Network Design Lab",
      "Mikrotik Academy Certified Lab",
      "Cyber Security Operations Center (CSOC) Lab",
      "FTTH & Fiber Optic Splicing Lab",
      "Virtualization & Private Cloud Server Sandbox"
    ],
    logo: "/assets/jurusan/tjkt.png",
    banner: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop", caption: "Perawatan Server & Switch di Rack Data Center" },
      { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop", caption: "Konfigurasi Router & Debugging Jaringan" },
      { url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop", caption: "Penyambungan Kabel FO menggunakan Fusion Splicer" },
      { url: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=600&auto=format&fit=crop", caption: "Simulasi Pertahanan Cyber & Ethical Hacking" }
    ]
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: [
      { title: "UI/UX Designer", desc: "Merancang pengalaman pengguna dan tampilan visual aplikasi agar mudah dan indah." },
      { title: "Graphic Designer", desc: "Membuat konsep dan eksekusi visual promosi, brosur, media sosial, dan materi cetak." },
      { title: "Brand Identity Specialist", desc: "Membangun sistem identitas visual yang khas dan kuat untuk klien bisnis global." },
      { title: "Commercial Photographer", desc: "Mengambil gambar produk bernilai tinggi untuk katalog e-commerce dan periklanan." }
    ],
    facilities: [
      "Wacom Creative Illustration Lab",
      "Professional Photography & Studio Lighting Room",
      "UI/UX Prototyping Sandbox Lab",
      "Adobe Certified Professional Lab",
      "Large-Format Digital Printing Center"
    ],
    logo: "/assets/jurusan/dkv.png",
    banner: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=600&auto=format&fit=crop", caption: "Kolaborasi Pembuatan Wireframe di Figma" },
      { url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop", caption: "Praktik Menggambar Karakter dengan Wacom Tablet" },
      { url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop", caption: "Seni Pengambilan Gambar Produk Komersial" },
      { url: "https://images.unsplash.com/photo-1534972195531-d756b9bda9f2?q=80&w=600&auto=format&fit=crop", caption: "Penyuntingan Aset Visual & Layout Kreatif" }
    ]
  },
  {
    code: "BC",
    title: "Broadcasting & Perfilman",
    desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
    color: "#f59e0b",
    careers: [
      { title: "Video Editor & Colorist", desc: "Merangkai potongan klip, menata warna visual, serta audio di industri periklanan & film." },
      { title: "Director of Photography (DoP)", desc: "Menentukan sudut kamera, pencahayaan, dan menangkap gambar sinematik." },
      { title: "Broadcast Systems Operator", desc: "Mengoperasikan switcher dan audio console pada penyiaran TV atau event live stream." },
      { title: "Creative Content Producer", desc: "Merancang ide segar dan memproduksi acara talkshow, video pendek, atau podcast." }
    ],
    facilities: [
      "iMac Video Editing Suite Lab (DaVinci Certified)",
      "Green Screen Virtual Studio Room",
      "TV Control Room with Professional Switchers",
      "Soundproof Podcasting & Sound Design Studio",
      "High-End Camera Equipment Gear Room"
    ],
    logo: "/assets/jurusan/bc.png",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop", caption: "Pengoperasian Kamera Sinema & Lensa Manual" },
      { url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop", caption: "Sesi Rekaman Podcast & Mixing Suara" },
      { url: "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?q=80&w=600&auto=format&fit=crop", caption: "Color Grading Sesi Video Post-Production" },
      { url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop", caption: "Syuting Film Pendek Praktik Kelas Sinematografi" }
    ]
  },
  {
    code: "ANM",
    title: "Animasi",
    desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
    color: "#ec4899",
    careers: [
      { title: "3D Animator", desc: "Menghidupkan model 3D melalui simulasi gerak realistis untuk film bioskop & game." },
      { title: "3D Modeler & Texturer", desc: "Membangun aset digital 3D, objek, bangunan, serta tekstur realistis." },
      { title: "VFX Compositor", desc: "Mengintegrasikan efek visual digital (CGI) dengan video rekaman nyata." },
      { title: "Concept & Storyboard Artist", desc: "Membuat draf sketsa visual alur cerita film sebelum masuk tahap produksi." }
    ],
    facilities: [
      "iMac Render Farm Studio Lab",
      "Wacom Cintiq Advanced Drawing Studio",
      "Full Body Motion Capture (MoCap) System Studio",
      "Professional Sound Dubbing & Sound FX Studio",
      "VFX Processing & Rendering Farm Node Cluster"
    ],
    logo: "/assets/jurusan/animasi.png",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", caption: "Proses Rigging Persendian Karakter 3D" },
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop", caption: "Digital Art & Painting Karakter Fantasi" },
      { url: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=600&auto=format&fit=crop", caption: "Pemodelan Aset Rumah 3D (3D Modeling)" },
      { url: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=600&auto=format&fit=crop", caption: "Siswa Menggunakan Baju Sensor Motion Capture" }
    ]
  },
  {
    code: "TE",
    title: "Teknik Elektronika",
    desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
    color: "#10b981",
    careers: [
      { title: "IoT Research & Developer", desc: "Merancang sirkuit dan sensor cerdas berbasis cloud untuk rumah & industri pintar." },
      { title: "Robotics Technician", desc: "Membuat, memprogram, dan memelihara robot otomatis di pabrik perakitan." },
      { title: "Industrial Automation Engineer", desc: "Mengembangkan program kontroler PLC mesin produksi agar efisien dan aman." },
      { title: "Hardware Support Specialist", desc: "Mendiagnosis kerusakan dan memperbaiki sirkuit elektronik digital tingkat lanjut." }
    ],
    facilities: [
      "Robotics Design & Assembly Workshop",
      "IoT Smart-Home Integration Prototype Lab",
      "PLC Siemens & Omron Certified Lab",
      "Precision Soldering & Osciloscope Lab Station",
      "Microcontroller sandbox environment"
    ],
    logo: "/assets/jurusan/te.png",
    banner: "https://images.unsplash.com/photo-1517055726410-dcbbb989d595?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop", caption: "Kalibrasi Sensor Lengan Robotik Cerdas" },
      { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop", caption: "Wiring Modul IoT Sensor Pintar" },
      { url: "https://images.unsplash.com/photo-1596244244153-c52734b415a0?q=80&w=600&auto=format&fit=crop", caption: "Praktik Solder Sirkuit Elektronika Analog" },
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop", caption: "Pemrograman PLC Omron untuk Mesin Konveyor" }
    ]
  }
];

export default function KelolaUserInterface() {
  const { adminToken, fetchConfigs, adminUser } = usePPDB();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "majors" | "alur" | "form" | "faq" | "revisions" | "bank" | "partners">("hero");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (adminUser && adminUser.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [adminUser, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["hero", "majors", "alur", "form", "faq", "revisions", "bank", "partners"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // ── Form Fields Config (Task 3) ───────────────────────────────────────────
  const DEFAULT_FIELDS_CONFIG_UI: Record<string, { label: string; required: boolean; active: boolean }> = {
    nama: { label: "Nama Lengkap", required: true, active: true },
    nisn: { label: "NISN", required: true, active: true },
    nik: { label: "NIK", required: true, active: true },
    tempatLahir: { label: "Tempat Lahir", required: true, active: true },
    tglLahir: { label: "Tanggal Lahir", required: true, active: true },
    jenisKelamin: { label: "Jenis Kelamin", required: true, active: true },
    agama: { label: "Agama", required: true, active: true },
    alamat: { label: "Alamat Lengkap", required: true, active: true },
    whatsapp: { label: "Nomor WhatsApp", required: true, active: true },
    email: { label: "Alamat Email", required: false, active: true },
    tinggalDengan: { label: "Tinggal Dengan", required: true, active: true },
    transportasi: { label: "Transportasi", required: true, active: true },
    tinggiBadan: { label: "Tinggi Badan (cm)", required: true, active: true },
    beratBadan: { label: "Berat Badan (kg)", required: true, active: true },
    golonganDarah: { label: "Golongan Darah", required: true, active: true },
    penyakitDiderita: { label: "Penyakit Diderita", required: false, active: true },
    kebutuhanKhusus: { label: "Berkebutuhan Khusus", required: false, active: true },
    jenisPrestasi: { label: "Jenis Prestasi", required: false, active: true },
    tingkatPrestasi: { label: "Tingkat Prestasi", required: false, active: true },
    uraianPrestasi: { label: "Uraian Prestasi", required: false, active: true },
    tahunPrestasi: { label: "Tahun Prestasi", required: false, active: true },
    penyelenggara: { label: "Penyelenggara Prestasi", required: false, active: true },
    jenisBeasiswa: { label: "Jenis Beasiswa", required: false, active: true },
    uraianBeasiswa: { label: "Uraian Beasiswa", required: false, active: true },
    sekolahAsal: { label: "Sekolah Asal (SMP/MTs)", required: true, active: true },
    tglLulus: { label: "Tanggal Lulus SMP", required: true, active: true },
    noIjazah: { label: "No. Seri Ijazah", required: false, active: true },
    noSKHUN: { label: "No. Seri SKHUN", required: false, active: true },
    noPesertaUN: { label: "No. Peserta UN", required: false, active: true },
    jurusan1: { label: "Program Keahlian (Jurusan)", required: true, active: true },
    alasanMemilih: { label: "Alasan Memilih Jurusan", required: false, active: true },
    namaAyah: { label: "Nama Ayah", required: true, active: true },
    pendidikanAyah: { label: "Pendidikan Ayah", required: true, active: true },
    pekerjaanAyah: { label: "Pekerjaan Ayah", required: true, active: true },
    penghasilanAyah: { label: "Penghasilan Ayah", required: true, active: true },
    namaIbu: { label: "Nama Ibu", required: true, active: true },
    pendidikanIbu: { label: "Pendidikan Ibu", required: true, active: true },
    pekerjaanIbu: { label: "Pekerjaan Ibu", required: true, active: true },
    penghasilanIbu: { label: "Penghasilan Ibu", required: true, active: true },
    namaWali: { label: "Nama Wali", required: false, active: true },
    teleponOrtu: { label: "Telepon Orang Tua", required: true, active: true },
    nilaiUSTeori: { label: "Nilai US Teori", required: false, active: true },
    nilaiUSPraktik: { label: "Nilai US Praktik", required: false, active: true },
    nilaiMuatanLokal: { label: "Nilai Muatan Lokal", required: false, active: true },
    citaCita: { label: "Cita-cita", required: false, active: true },
    hobi: { label: "Hobi", required: false, active: true },
    pelajaranDisenangi: { label: "Pelajaran Disenangi", required: false, active: true },
    kesulitanBelajar: { label: "Kesulitan Belajar", required: false, active: true },
    punyaKPS: { label: "Status KPS", required: false, active: true },
    punyaKIP: { label: "Status KIP", required: false, active: true },
  };
  const [fieldsConfigUI, setFieldsConfigUI] = useState<Record<string, { label: string; required: boolean; active: boolean }>>(DEFAULT_FIELDS_CONFIG_UI);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");

  const [heroTitle, setHeroTitle] = useState("Penerimaan Siswa Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("Portal PPDB SMK Taruna Bhakti");
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi.");
  const [phone, setPhone] = useState("(021) 8740756");
  const [email, setEmail] = useState("info@smktarunabhakti.sch.id");
  const [address, setAddress] = useState("Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
  const [mapTitle, setMapTitle] = useState("Kunjungi Kampus SMK Taruna Bhakti");
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [waAdmin, setWaAdmin] = useState("6281292244456");
  const [formGuideline, setFormGuideline] = useState("Silakan isi formulir pendaftaran calon siswa dengan lengkap dan benar. Berkas persyaratan wajib diunggah dalam format gambar (PNG/JPG) maksimal 2MB.");
  const [formFee, setFormFee] = useState("250000");
  const [schoolLogo, setSchoolLogo] = useState("/logo_smktb.png");
  const [schoolTitle, setSchoolTitle] = useState("PPDB SMK TB");

  const [gelombangConfig, setGelombangConfig] = useState({
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  });
  const [g1Error, setG1Error] = useState<string | null>(null);
  const [g2Error, setG2Error] = useState<string | null>(null);

  const [bankConfigList, setBankConfigList] = useState<Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>>([
    {
      bankName: "Bank Mandiri",
      accountNumber: "157-00-0174092-2",
      accountHolder: "Yayasan Taruna Bhakti"
    }
  ]);

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [majorsList, setMajorsList] = useState<MajorItem[]>(DEFAULT_MAJORS);
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [revisions, setRevisions] = useState<RevisionLog[]>([]);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState("Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru SMK Taruna Bhakti.");
  const [faqList, setFaqList] = useState<FaqItem[]>([]);

  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [isNewMajor, setIsNewMajor] = useState(false);
  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});

  const emptyMajor = (): MajorItem => ({
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

  useEffect(() => {
    setMounted(true);
    fetchCurrentConfig();
    fetchRevisions();
  }, []);

  // Auto-save unsaved draft to localStorage whenever form states change
  useEffect(() => {
    if (!mounted || loading) return;

    const draft = {
      ppdb_hero_title: heroTitle,
      ppdb_hero_title_sub: heroTitleSub,
      ppdb_hero_subtitle: heroSubtitle,
      ppdb_phone: phone,
      ppdb_email: email,
      ppdb_address: address,
      ppdb_map_title: mapTitle,
      ppdb_map_url: mapUrl,
      ppdb_school_period: schoolPeriod,
      ppdb_wa_group_url: waGroupUrl,
      ppdb_wa_admin: waAdmin,
      ppdb_form_guideline: formGuideline,
      ppdb_form_fee: formFee,
      ppdb_gelombang_config: gelombangConfig,
      ppdb_bank_config: bankConfigList,
      ppdb_alur_config: alurList,
      ppdb_majors_config: majorsList,
      ppdb_faq_config: faqList,
      ppdb_partners_config: partnersList,
      ppdb_logo_url: schoolLogo,
      ppdb_title: schoolTitle,
    };

    localStorage.setItem("ppdb_ui_editor_draft", JSON.stringify(draft));
  }, [
    mounted,
    loading,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    phone,
    email,
    address,
    schoolPeriod,
    waGroupUrl,
    waAdmin,
    formGuideline,
    formFee,
    gelombangConfig,
    bankConfigList,
    alurList,
    majorsList,
    faqList,
    partnersList,
  ]);

  const showToastMsg = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  async function fetchCurrentConfig() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/config");
      const json = await res.json();
      const config = (json.success && json.data) ? json.data : {};

      // Load draft from localStorage if present
      const savedDraft = localStorage.getItem("ppdb_ui_editor_draft");
      let draft: any = null;
      if (savedDraft) {
        try {
          draft = JSON.parse(savedDraft);
        } catch (_) {}
      }

      const activeConfig = draft ? { ...config, ...draft } : config;

      if (activeConfig.ppdb_hero_title) setHeroTitle(activeConfig.ppdb_hero_title);
      if (activeConfig.ppdb_hero_title_sub) setHeroTitleSub(activeConfig.ppdb_hero_title_sub);
      if (activeConfig.ppdb_hero_subtitle) setHeroSubtitle(activeConfig.ppdb_hero_subtitle);
      if (activeConfig.ppdb_phone) setPhone(formatPhoneNumber(activeConfig.ppdb_phone));
      if (activeConfig.ppdb_email) setEmail(activeConfig.ppdb_email);
      if (activeConfig.ppdb_address) setAddress(activeConfig.ppdb_address);
        if (activeConfig.ppdb_map_title) setMapTitle(activeConfig.ppdb_map_title);
        if (activeConfig.ppdb_map_url) setMapUrl(activeConfig.ppdb_map_url);
      if (activeConfig.ppdb_school_period) setSchoolPeriod(activeConfig.ppdb_school_period);
        if (activeConfig.ppdb_faq_title) setFaqTitle(activeConfig.ppdb_faq_title);
        if (activeConfig.ppdb_faq_subtitle) setFaqSubtitle(activeConfig.ppdb_faq_subtitle);
      if (activeConfig.ppdb_wa_group_url) setWaGroupUrl(activeConfig.ppdb_wa_group_url);
      if (activeConfig.ppdb_wa_admin) setWaAdmin(formatPhoneNumber(activeConfig.ppdb_wa_admin));
      if (activeConfig.ppdb_form_guideline) setFormGuideline(activeConfig.ppdb_form_guideline);
      if (activeConfig.ppdb_form_fee) setFormFee(activeConfig.ppdb_form_fee);
      if (activeConfig.ppdb_logo_url) setSchoolLogo(activeConfig.ppdb_logo_url);
      if (activeConfig.ppdb_title) setSchoolTitle(activeConfig.ppdb_title);
      
      if (activeConfig.ppdb_alur_config && Array.isArray(activeConfig.ppdb_alur_config)) {
        setAlurList(activeConfig.ppdb_alur_config);
      }
      if (activeConfig.ppdb_faq_config && Array.isArray(activeConfig.ppdb_faq_config)) {
        setFaqList(activeConfig.ppdb_faq_config);
      } else {
        setFaqList(DEFAULT_FAQ);
      }
      if (activeConfig.ppdb_partners_config && Array.isArray(activeConfig.ppdb_partners_config)) {
        setPartnersList(activeConfig.ppdb_partners_config);
      } else {
        setPartnersList(DEFAULT_PARTNERS);
      }
      if (activeConfig.ppdb_majors_config && Array.isArray(activeConfig.ppdb_majors_config)) {
        const dbMajors = activeConfig.ppdb_majors_config;
        const mergedMajors: MajorItem[] = [];
        
        dbMajors.forEach((dbMajor: any) => {
          const defMajor = DEFAULT_MAJORS.find(d => d.code === dbMajor.code);
          mergedMajors.push({
            code: dbMajor.code,
            title: dbMajor.title || "",
            desc: dbMajor.desc || "",
            color: dbMajor.color || (defMajor?.color || "#0066ff"),
            careers: Array.isArray(dbMajor.careers) ? dbMajor.careers : (defMajor?.careers || []),
            facilities: Array.isArray(dbMajor.facilities) ? dbMajor.facilities : (defMajor?.facilities || []),
            logo: dbMajor.logo || (defMajor?.logo || ""),
            banner: dbMajor.banner || (defMajor?.banner || ""),
            video: dbMajor.video || (defMajor?.video || ""),
            gallery: Array.isArray(dbMajor.gallery) ? dbMajor.gallery : (defMajor?.gallery || [])
          });
        });
        
        DEFAULT_MAJORS.forEach(def => {
          if (!mergedMajors.some(m => m.code === def.code)) {
            mergedMajors.push(def);
          }
        });
        
        setMajorsList(mergedMajors);
      }
      if (activeConfig.ppdb_gelombang_config) {
        setGelombangConfig(activeConfig.ppdb_gelombang_config);
      }
      if (activeConfig.ppdb_bank_config) {
        const bankData = activeConfig.ppdb_bank_config;
        if (Array.isArray(bankData)) {
          setBankConfigList(bankData);
        } else if (bankData && typeof bankData === "object") {
          setBankConfigList([bankData]);
        }
      }
      if (activeConfig.ppdb_fields_config && typeof activeConfig.ppdb_fields_config === "object") {
        setFieldsConfigUI(prev => ({ ...prev, ...activeConfig.ppdb_fields_config }));
      }

      if (draft) {
        showToastMsg("Draf perubahan berhasil dipulihkan dari sesi sebelumnya.", "info");
      }
    } catch (e) {
      console.error("Gagal mengambil konfigurasi UI:", e);
      showToastMsg("Koneksi gagal, memuat konfigurasi cadangan.", "info");
    } finally {
      setLoading(false);
    }
  };

  async function fetchRevisions() {
    try {
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch("http://localhost:5000/api/config/revisions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setRevisions(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil riwayat perubahan:", e);
    }
  };

  const handleDragState = (e: React.DragEvent, elementId: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates(prev => ({ ...prev, [elementId]: active }));
  };

  const processMediaFile = (file: File, type: "logo" | "banner" | "video" | "gallery-0" | "gallery-1" | "gallery-2" | "gallery-3") => {
    const isVideo = type === "video";
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (isVideo) {
      const allowedVideoExts = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi'];
      if (!file.type.startsWith("video/") && !allowedVideoExts.includes(fileExt)) {
        showToastMsg("Hanya berkas video (MP4/WebM/MOV/MKV) yang diperbolehkan.", "error");
        return;
      }
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        showToastMsg("Ukuran file video maksimal adalah 15MB.", "error");
        return;
      }
    } else {
      const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
      if (!file.type.startsWith("image/") && !allowedImgExts.includes(fileExt)) {
        showToastMsg("Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan.", "error");
        return;
      }
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for banners/gallery
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

  const handleSchoolLogoChange = (file: File) => {
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

  const handleAddAlur = () => {
    const nextId = alurList.length > 0 ? Math.max(...alurList.map(a => a.id)) + 1 : 1;
    setAlurList([...alurList, { id: nextId, title: "Langkah Baru", desc: "Deskripsi langkah pendaftaran baru..." }]);
  };

  const handleUpdateAlur = (id: number, key: keyof AlurItem, val: string | number) => {
    setAlurList(alurList.map(a => a.id === id ? { ...a, [key]: val } : a));
  };

  const handleRemoveAlur = (id: number) => {
    setAlurList(alurList.filter(a => a.id !== id).map((a, i) => ({ ...a, id: i + 1 })));
  };

  const handleMoveAlur = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === alurList.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...alurList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((item, idx) => ({ ...item, id: idx + 1 }));
    setAlurList(reordered);
  };

  const handleAddFaq = () => {
    setFaqList([...faqList, { q: "Pertanyaan Baru?", a: "Tuliskan jawaban di sini." }]);
  };

  const handleUpdateFaq = (index: number, key: keyof FaqItem, val: string) => {
    setFaqList(faqList.map((f, i) => i === index ? { ...f, [key]: val } : f));
  };

  const handleRemoveFaq = (index: number) => {
    setFaqList(faqList.filter((_, i) => i !== index));
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === faqList.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...faqList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFaqList(copy);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDescription.trim()) {
      showToastMsg("Deskripsi catatan wajib diisi.", "error");
      return;
    }

    try {
      setSaving(true);
      setShowConfirmModal(false);

      let finalMajors = [...majorsList];
      if (editingMajor) {
        finalMajors = finalMajors.map(m => m.code === editingMajor.code ? editingMajor : m);
        setMajorsList(finalMajors);
        setEditingMajor(null);
      }

      const configsPayload = {
        ppdb_hero_title: heroTitle,
        ppdb_hero_title_sub: heroTitleSub,
        ppdb_hero_subtitle: heroSubtitle,
        ppdb_phone: phone,
        ppdb_email: email,
        ppdb_address: address,
      ppdb_map_title: mapTitle,
      ppdb_map_url: mapUrl,
        ppdb_school_period: schoolPeriod,
        ppdb_wa_group_url: waGroupUrl,
        ppdb_wa_admin: waAdmin,
        ppdb_form_guideline: formGuideline,
        ppdb_form_fee: formFee,
        ppdb_alur_config: alurList,
        ppdb_majors_config: finalMajors,
        ppdb_faq_config: faqList,
        ppdb_gelombang_config: gelombangConfig,
        ppdb_bank_config: bankConfigList,
        ppdb_partners_config: partnersList,
        ppdb_logo_url: schoolLogo,
        ppdb_title: schoolTitle,
        ppdb_fields_config: fieldsConfigUI
      };

      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch("http://localhost:5000/api/config/save-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          configs: configsPayload,
          description: changeDescription.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        showToastMsg("Semua perubahan UI berhasil disimpan dan tercatat.");
        setChangeDescription("");
        localStorage.removeItem("ppdb_ui_editor_draft");
        fetchConfigs().catch(console.error);
        
        try {
          localStorage.setItem("ppdb_majors_config", JSON.stringify(finalMajors));
          localStorage.setItem("ppdb_alur_config", JSON.stringify(alurList));
          localStorage.setItem("ppdb_faq_config", JSON.stringify(faqList));
            localStorage.setItem("ppdb_faq_title", faqTitle);
            localStorage.setItem("ppdb_faq_subtitle", faqSubtitle);
          localStorage.setItem("ppdb_partners_config", JSON.stringify(partnersList));
          localStorage.setItem("ppdb_reg_cost", formFee);
          localStorage.setItem("ppdb_school_period", schoolPeriod);
            localStorage.setItem("ppdb_map_title", mapTitle);
            localStorage.setItem("ppdb_map_url", mapUrl);
          localStorage.setItem("ppdb_wa_group_url", waGroupUrl);
          localStorage.setItem("ppdb_wa_admin", waAdmin);
          localStorage.setItem("ppdb_bank_config", JSON.stringify(bankConfigList));
          localStorage.setItem("ppdb_gelombang_config", JSON.stringify(gelombangConfig));
          const existingClasses = localStorage.getItem("ppdb_classes_config");
          if (!existingClasses) {
            localStorage.setItem("ppdb_classes_config", JSON.stringify(
              finalMajors.map(m => ({ id: `X-${m.code}-1`, name: `X ${m.code} 1`, majorCode: m.code, maxCapacity: 100 }))
            ));
          }
        } catch (storageErr) {
          console.warn("Storage quota exceeded or unavailable. LocalStorage cache sync bypassed.", storageErr);
        }

        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal menyimpan perubahan.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToastMsg("Terjadi kesalahan server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (revId: number) => {
    if (!confirm(`Apakah Anda yakin ingin memulihkan semua konfigurasi UI ke versi riwayat #${revId}?`)) {
      return;
    }

    try {
      setSaving(true);
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch("http://localhost:5000/api/config/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ revisionId: revId })
      });

      const json = await res.json();
      if (json.success) {
        showToastMsg(`Sukses memulihkan tampilan ke versi #${revId}!`);
        localStorage.removeItem("ppdb_ui_editor_draft");
        await fetchCurrentConfig();
        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal melakukan pemulihan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal menghubungi server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
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

  if (!mounted) return null;
  if (!adminUser || adminUser.role !== 'superadmin') return null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-250 dark:border-emerald-900" 
            : toast.type === "error"
            ? "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-250 dark:border-rose-900"
            : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-300 border-indigo-250 dark:border-indigo-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <X size={16} /> : <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full mx-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Menyimpan Perubahan...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Menulis riwayat ke database</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Palette size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Kelola User Interface</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">Edit Semua Foto, Teks, Jurusan, dan Formulir PPDB secara Real-time</p>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          {mounted && typeof window !== "undefined" && localStorage.getItem("ppdb_ui_editor_draft") && (
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Konfirmasi',
                  text: "Apakah Anda yakin ingin membatalkan semua draf perubahan yang belum disimpan dan memuat ulang data asli dari server?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Ya',
                  cancelButtonText: 'Batal'
                });
                if (result.isConfirmed) {
                  localStorage.removeItem("ppdb_ui_editor_draft");
                  fetchCurrentConfig();
                }
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Draf</span>
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Capsule Container & Asymmetric Dynamic Leaf-like Design */}
      <div className="bg-slate-100/50 dark:bg-slate-950 p-1.5 rounded-[22px] border border-slate-200/70 dark:border-slate-800/40 flex flex-wrap gap-1 shadow-inner mb-6 transition-all duration-300">
        {[
          { id: "hero", label: "Hero, Kontak & Gelombang", icon: FileText },
          { id: "majors", label: "Program Keahlian (Jurusan)", icon: GraduationCap },
          { id: "alur", label: "Alur Pendaftaran", icon: Settings },
          { id: "form", label: "Form & Panduan", icon: Info },
          { id: "bank", label: "Rekening Bank Sekolah", icon: Database },
          { id: "faq", label: "Pertanyaan (FAQ)", icon: HelpCircle },
          { id: "partners", label: "Partner Industri", icon: Briefcase },
          { id: "revisions", label: "Riwayat Perubahan", icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              disabled={editingMajor !== null && tab.id !== "majors"}
              onClick={() => {
                setActiveTab(tab.id as any);
                router.push(`?tab=${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-transparent ${
                editingMajor !== null && tab.id !== "majors" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              } ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 rounded-[16px_6px_16px_6px] scale-[1.02] -translate-y-[0.5px]"
                  : "text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900/80 rounded-xl hover:rounded-[16px_6px_16px_6px] hover:border-indigo-500/30"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memuat Konfigurasi...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: Hero & Kontak */}
            {activeTab === "hero" && (
              <HeroSection
                schoolLogo={schoolLogo}
                handleSchoolLogoChange={handleSchoolLogoChange}
                dragActiveStates={dragActiveStates}
                handleDragState={handleDragState}
                schoolTitle={schoolTitle}
                setSchoolTitle={setSchoolTitle}
                heroTitle={heroTitle}
                setHeroTitle={setHeroTitle}
                heroTitleSub={heroTitleSub}
                setHeroTitleSub={setHeroTitleSub}
                heroSubtitle={heroSubtitle}
                setHeroSubtitle={setHeroSubtitle}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                schoolPeriod={schoolPeriod}
                setSchoolPeriod={setSchoolPeriod}
                address={address}
                setAddress={setAddress}
                waGroupUrl={waGroupUrl}
                setWaGroupUrl={setWaGroupUrl}
                waAdmin={waAdmin}
                setWaAdmin={setWaAdmin}
                gelombangConfig={gelombangConfig}
                setGelombangConfig={setGelombangConfig}
                g1Error={g1Error}
                setG1Error={setG1Error}
                g2Error={g2Error}
                setG2Error={setG2Error}
              />
            )}

            {/* TAB 2: Program Keahlian (Jurusan) */}
            {activeTab === "majors" && (
              <MajorsSection
                editingMajor={editingMajor}
                setEditingMajor={setEditingMajor}
                isNewMajor={isNewMajor}
                setIsNewMajor={setIsNewMajor}
                majorsList={majorsList}
                setMajorsList={setMajorsList}
                emptyMajor={emptyMajor}
                dragActiveStates={dragActiveStates}
                setDragActiveStates={setDragActiveStates}
                handleDragState={handleDragState}
                processMediaFile={processMediaFile}
                showToastMsg={showToastMsg}
              />
            )}

            {/* TAB 3: Alur Pendaftaran */}
            {activeTab === "alur" && (
              <AlurSection
                alurList={alurList}
                handleAddAlur={handleAddAlur}
                handleUpdateAlur={handleUpdateAlur}
                handleMoveAlur={handleMoveAlur}
                handleRemoveAlur={handleRemoveAlur}
              />
            )}

            {/* TAB 4: Form & Panduan */}
            {activeTab === "form" && (
              <FormSection
                formFee={formFee}
                setFormFee={setFormFee}
                formatRupiah={formatRupiah}
                formGuideline={formGuideline}
                setFormGuideline={setFormGuideline}
                fieldsConfigUI={fieldsConfigUI}
                setFieldsConfigUI={setFieldsConfigUI}
                DEFAULT_FIELDS_CONFIG_UI={DEFAULT_FIELDS_CONFIG_UI}
              />
            )}

            {/* TAB 5: FAQ Management */}
            {activeTab === "faq" && (
              <FAQSection
                faqList={faqList}
                handleAddFaq={handleAddFaq}
                handleUpdateFaq={handleUpdateFaq}
                handleMoveFaq={handleMoveFaq}
                handleRemoveFaq={handleRemoveFaq}
              />
            )}

            {/* TAB 6: Riwayat Perubahan (Revisions) */}
            {activeTab === "revisions" && (
              <RevisionsSection
                revisions={revisions}
                formatDate={formatDate}
                handleRestore={handleRestore}
              />
            )}

            {/* TAB 7: Rekening Bank Sekolah */}
            {activeTab === "bank" && (
              <BankSection
                bankConfigList={bankConfigList}
                setBankConfigList={setBankConfigList}
              />
            )}

            {/* TAB 8: Partner Industri */}
            {activeTab === "partners" && (
              <PartnersSection
                partnersList={partnersList}
                setPartnersList={setPartnersList}
              />
            )}
          </>
        )}
      </div>

      {/* CONFIRMATION & NOTE MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveAll}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Simpan Perubahan UI</h3>
              <button 
                type="button" 
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-slate-450 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                Harap masukkan deskripsi singkat mengenai perubahan yang Anda lakukan. Catatan ini akan disimpan dalam database dan dapat digunakan untuk memulihkan versi ini di masa mendatang.
              </p>
              <textarea
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                rows={3}
                required
                placeholder="Contoh: Mengubah judul utama, memperbarui logo RPL, dan memperbarui alur langkah 3"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-xl text-slate-850 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1"
              >
                <Check size={12} />
                <span>Simpan Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
