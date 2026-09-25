export interface AlurItem {
  id: number;
  title: string;
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

export interface MajorItem {
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

export interface RevisionLog {
  id: number;
  changed_by: string;
  description: string;
  created_at: string;
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
  { id: 28, name: "LIGHT CODE DIGITAL", logo: "https://www.google.com/s2/favicons?domain=lightcodedigital.com&sz=256", url: "https://lightcodedigital.com/", h: "h-12" }
];

export const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website smktarunabhakti.net dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp" },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

export const DEFAULT_FAQ: FaqItem[] = [
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

export const DEFAULT_MAJORS: MajorItem[] = [
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
      "Podcast & Live Streaming Broadcasting Studio"
    ],
    logo: "/assets/jurusan/dkv.png",
    banner: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop", caption: "Proses Brainstorming Konsep Desain Identitas" },
      { url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop", caption: "Praktik Fotografi Komersil di Studio" },
      { url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop", caption: "Desain Grafis Vektor Menggunakan Pen Tablet" },
      { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop", caption: "Presentasi Karya Desain UX kepada Klien" }
    ]
  },
  {
    code: "ANIMASI",
    title: "Animasi 3D & Visual Effects",
    desc: "Menciptakan karya seni 3D, animasi karakter, visual effect (VFX) film, dan motion graphic kelas industri perfilman.",
    color: "#8b5cf6",
    careers: [
      { title: "3D Animator", desc: "Menghidupkan karakter 3D untuk produksi film, iklan TV, dan cinematic game." },
      { title: "VFX Compositor", desc: "Menggabungkan efek visual digital dengan rekaman nyata sehingga terlihat realistis." },
      { title: "Motion Graphic Designer", desc: "Membuat video explainer dan animasi teks yang dinamis untuk promosi." },
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

export const formatRupiah = (value: string) => {
  if (!value) return "Rp ";
  const clean = value.replace(/[^0-9]/g, "");
  if (!clean) return "Rp ";
  const num = parseInt(clean, 10);
  return "Rp " + num.toLocaleString("id-ID");
};

export const formatPhoneNumber = (value: string) => {
  if (!value) return "";

  let clean = value.replace(/[^\d+]/g, "");

  if (clean.startsWith("0")) {
    clean = "+62" + clean.slice(1);
  }
  else if (clean.startsWith("62")) {
    clean = "+" + clean;
  }
  else if (clean && !clean.startsWith("+62")) {
    if (clean.startsWith("+")) {
      clean = "+62" + clean.slice(1);
    } else {
      clean = "+62" + clean;
    }
  }
  
  return clean;
};
