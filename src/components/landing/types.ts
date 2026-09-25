import dompurify from "dompurify";
import { Cpu, Layers, BookOpen, Video, Palette } from "lucide-react";

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

export interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PartnerItem {
  id: number;
  name: string;
  logo: string;
  url: string;
  h: string;
}

export interface MajorItem {
  code: string;
  title: string;
  icon: any;
  logo: string;
  desc: string;
  color: string;
  careers: string;
  facilities: string;
}

export interface GelombangConfig {
  gelombang1: { start: string; end: string };
  gelombang2: { start: string; end: string };
}

export const DEFAULT_FAQ: FaqItem[] = [
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

export const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website smktarunabhakti.net dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp" },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

export const DEFAULT_PARTNERS: PartnerItem[] = [
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

export const DEFAULT_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    icon: Cpu,
    logo: "/assets/jurusan/pplg.png",
    desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
    careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
    facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    icon: Layers,
    logo: "/assets/jurusan/tjkt.png",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
    facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    icon: BookOpen,
    logo: "/assets/jurusan/dkv.png",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
    facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
  },
  {
    code: "BC",
    title: "Broadcasting & Perfilman",
    icon: Video,
    logo: "/assets/jurusan/bc.png",
    desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
    color: "#f59e0b",
    careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
    facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
  },
  {
    code: "ANM",
    title: "Animasi",
    icon: Palette,
    logo: "/assets/jurusan/animasi.png",
    desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
    color: "#ec4899",
    careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
    facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab, Sound Recording Room"
  },
  {
    code: "TE",
    title: "Teknik Elektronika",
    icon: Cpu,
    logo: "/assets/jurusan/te.png",
    desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
    color: "#10b981",
    careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
    facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
  }
];

export const getGelombangStatus = (startStr: string, endStr: string) => {
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

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  try {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  } catch (e) {
    return dateString;
  }
};
