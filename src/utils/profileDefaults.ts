export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface ProfileSejarahData {
  hero_title: string;
  hero_subtitle: string;
  intro_title: string;
  intro_p1: string;
  intro_p2: string;
  akreditasi: string;
  predikat_nasional: string;
  milestones: Milestone[];
}

export interface MissionItem {
  number: string;
  title: string;
  desc: string;
}

export interface ProfileVisiMisiData {
  visi: string;
  visi_desc: string;
  missions: MissionItem[];
}

export interface GoalItem {
  title: string;
  desc: string;
  badge: string;
}

export interface ProfileTujuanData {
  hero_desc: string;
  goals: GoalItem[];
  pillars: string[];
}

export interface StaffItem {
  name: string;
  role: string;
  cert: string;
  category: "pimpinan" | "produktif" | "normatif" | string;
  initials: string;
  photo?: string;
}

export interface ProfileTenagaPendidikData {
  hero_desc: string;
  stats: {
    sertifikasi: string;
    rasio: string;
    industri_tamu: string;
    dedikasi: string;
  };
  staff: StaffItem[];
}

export const DEFAULT_SEJARAH: ProfileSejarahData = {
  hero_title: "Sejarah Berdirinya SMK Taruna Bhakti",
  hero_subtitle: "Berawal dari tingginya minat siswa lulusan SMP di Kecamatan Cimanggis Depok, Yayasan Setya Bhakti mendirikan SMK Taruna Bhakti pada 16 Juni 2004 — kini berkembang menjadi sekolah vokasi teknologi unggulan dengan ribuan siswa.",
  intro_title: "Dari 3 Ruang Kelas ke Sekolah Vokasi Terdepan",
  intro_p1: "Berawal dari tingginya minat siswa lulusan SMP yang berdomisili di lingkungan Kecamatan Cimanggis Depok untuk melanjutkan pendidikan ke jenjang SMA/SMK, serta masih minimnya fasilitas SMK di wilayah tersebut. Yayasan Setya Bhakti yang telah terlebih dahulu memiliki SMP Taruna Bhakti Depok (berdiri sejak 1987) dengan sekitar 1.200 siswa, membuka jenjang pendidikan yang lebih tinggi: SMK Taruna Bhakti Depok. Harapannya, sebagian lulusan SMP Taruna Bhakti dapat tertampung di lingkungan SMK Taruna Bhakti Depok.",
  intro_p2: "Maka pada tanggal 16 Juni 2004, berdirilah SMK Taruna Bhakti Depok di Jalan Pekapuran, Kelurahan Curug, Kecamatan Cimanggis, Depok — dengan bidang studi Teknologi Informasi dan Komunikasi serta kompetensi keahlian Teknik Komputer dan Jaringan. Kini SMK Taruna Bhakti telah berkembang menjadi sekolah vokasi teknologi terdepan dengan 6 kompetensi keahlian aktif dan ribuan siswa.",
  akreditasi: "Predikat Unggul (A)",
  predikat_nasional: "Peraih Rekor MURI Bidang TIK",
  milestones: [
    {
      year: "2004",
      title: "Pendirian SMK Taruna Bhakti",
      desc: "Didirikan oleh Yayasan Setya Bhakti pada 16 Juni 2004 di Jl. Pekapuran, Cimanggis, Depok. Tahun pertama: 3 rombongan belajar, 126 siswa, 13 guru, dan 1 laboratorium komputer."
    },
    {
      year: "2005–2006",
      title: "Pertumbuhan & Tantangan Awal",
      desc: "Tahun kedua jumlah siswa sempat turun menjadi 64 akibat biaya pendidikan. Setelah perubahan sistem manajemen dari terpusat ke MBS (Manajemen Berbasis Sekolah), siswa kembali tumbuh menjadi 163 siswa (4 rombel)."
    },
    {
      year: "2008",
      title: "Akreditasi A & Rekor MURI",
      desc: "Meraih nilai Akreditasi Sekolah predikat A (Amat Baik) serta memperoleh Rekor MURI dalam bidang Teknologi Informasi dan Komunikasi. Jumlah siswa meningkat menjadi 242 (6 rombel)."
    },
    {
      year: "2009",
      title: "Pembukaan Kompetensi Multimedia",
      desc: "Dibuka kompetensi keahlian Teknik Multimedia yang masih satu rumpun dengan Teknik Komputer dan Jaringan. SMK Taruna Bhakti berkembang menjadi 9 rombongan belajar dengan 360 siswa."
    },
    {
      year: "2024 – Sekarang",
      title: "6 Program Keahlian Aktif",
      desc: "Kini mengelola 6 kompetensi keahlian: Teknik Jaringan Komputer & Telekomunikasi (12 rombel), Pengembangan Perangkat Lunak & Gim (15 rombel), Broadcasting & Perfilman (9 rombel), Animasi (5 rombel), Desain Komunikasi Visual (2 rombel), dan Teknik Elektronika (4 rombel)."
    }
  ]
};

export const DEFAULT_VISI_MISI: ProfileVisiMisiData = {
  visi: "Menghasilkan lulusan yang kompeten dalam IPTEK DAN IMTAQ, serta mampu bersaing pada tingkat nasional dan global",
  visi_desc: "Visi ini menempatkan penguasaan ilmu pengetahuan dan teknologi yang dilandasi keimanan dan ketaqwaan sebagai fondasi utama setiap lulusan SMK Taruna Bhakti Depok.",
  missions: [
    {
      number: "01",
      title: "Kreativitas & Sinergi",
      desc: "Menumbuhkan semangat kreatifitas, bersinergi dan kompetitif kepada seluruh warga sekolah."
    },
    {
      number: "02",
      title: "Kurikulum Berbasis Kompetensi",
      desc: "Melaksanakan kurikulum melalui pembelajaran dan penilaian berbasis kompetensi, berbasis wirausaha, berwawasan lingkungan, dan berlandaskan kejujuran."
    },
    {
      number: "03",
      title: "Sertifikasi Nasional & Internasional",
      desc: "Meningkatkan kualitas sumber daya manusia melalui sertifikasi Kompetensi Tingkat Nasional dan Internasional."
    },
    {
      number: "04",
      title: "Pengembangan Minat & Bakat",
      desc: "Mengembangkan potensi peserta didik melalui kegiatan Minat dan Bakat dan pembinaan kedisiplinan."
    },
    {
      number: "05",
      title: "Layanan Prima & Mutu",
      desc: "Menerapkan layanan prima dalam pengelolaan sekolah melalui Sistem Manajemen Mutu."
    }
  ]
};

export const DEFAULT_TUJUAN: ProfileTujuanData = {
  hero_desc: "Dalam mewujudkan visi dan misi, SMK Taruna Bhakti mempunyai tujuan sebagai berikut:",
  goals: [
    {
      title: "Lulusan Kompeten",
      desc: "Menghasilkan lulusan yang kompeten dalam bidang keahlian masing-masing, siap bersaing di dunia kerja maupun pendidikan tinggi.",
      badge: "Kompetensi"
    },
    {
      title: "Kualitas Pembelajaran",
      desc: "Meningkatkan kualitas pembelajaran secara berkelanjutan agar relevan dengan perkembangan teknologi dan kebutuhan industri.",
      badge: "Mutu Belajar"
    },
    {
      title: "Sikap Profesional",
      desc: "Menyiapkan peserta didik agar mampu mengembangkan sikap profesional, mampu beradaptasi dan berkompetisi di lingkungan kerja.",
      badge: "Profesionalisme"
    },
    {
      title: "Kepuasan Masyarakat",
      desc: "Meningkatkan kepuasan masyarakat untuk memperoleh layanan pendidikan yang bermutu, transparan, dan akuntabel.",
      badge: "Pelayanan Prima"
    }
  ],
  pillars: [
    "Konsistensi pelaksanaan aktifitas, kendali mutu dan jaminan mutu sekolah.",
    "Meningkatkan kesejahteraan warga sekolah."
  ]
};

export const DEFAULT_TENAGA_PENDIDIK: ProfileTenagaPendidikData = {
  hero_desc: "SMK Taruna Bhakti didukung oleh tenaga pendidik dan kependidikan yang berdedikasi — dari guru BK, kejuruan teknologi, hingga guru normatif adaptif yang membimbing seluruh potensi siswa.",
  stats: {
    sertifikasi: "30+",
    rasio: "1:20",
    industri_tamu: "6+",
    dedikasi: "100%"
  },
  staff: [
    {
      name: "Heni Siswati, S.Psi",
      role: "Guru Bimbingan dan Konseling",
      cert: "Psikologi Pendidikan",
      category: "bk",
      initials: "HS",
      photo: "/teachers/heni-siswati.jpg"
    },
    {
      name: "Kasandra Fitriani. N, S.Pd",
      role: "Guru Bimbingan dan Konseling",
      cert: "Konseling Remaja",
      category: "bk",
      initials: "KF",
      photo: "/teachers/kasandra-fitriani.png"
    },
    {
      name: "Nadya Afriliani Ariesta, S.Pd",
      role: "Guru Bimbingan dan Konseling",
      cert: "Bimbingan Karier Siswa",
      category: "bk",
      initials: "NA",
      photo: "/teachers/nadya-afriliani.png"
    },
    {
      name: "Ika Rafika, S.Pd",
      role: "Guru Bimbingan dan Konseling",
      cert: "Psikologi Pendidikan",
      category: "bk",
      initials: "IR",
      photo: "/teachers/ika-rafika.png"
    },
    {
      name: "Sheila Riani Putri, S.Psi",
      role: "Tenaga Kependidikan",
      cert: "Psikologi",
      category: "tendik",
      initials: "SP",
      photo: "/teachers/sheila-riani.png"
    },
    {
      name: "Agung Setiawan, ST",
      role: "Guru Kejuruan TJKT",
      cert: "Teknik Komputer Jaringan",
      category: "produktif",
      initials: "AS",
      photo: "/teachers/agung-setiawan.jpg"
    },
    {
      name: "Abdul Hamid",
      role: "Guru Kejuruan TJKT",
      cert: "Teknik Jaringan & Telekomunikasi",
      category: "produktif",
      initials: "AH",
      photo: "/teachers/abdul-hamid.png"
    },
    {
      name: "Yossi Triana, S.Kom",
      role: "Guru Kejuruan TJKT",
      cert: "Jaringan Komputer",
      category: "produktif",
      initials: "YT",
      photo: "/teachers/yossi-triana.png"
    },
    {
      name: "Annisa Anggi Rahayu, S.Ds",
      role: "Guru Kejuruan Animasi & PSPT",
      cert: "Desain & Animasi",
      category: "produktif",
      initials: "AA",
      photo: "/teachers/annisa-anggi.png"
    },
    {
      name: "Sinta Nur Alifah, S.IKom",
      role: "Guru Kejuruan Animasi",
      cert: "Ilmu Komunikasi & Animasi",
      category: "produktif",
      initials: "SN",
      photo: "/teachers/sinta-nur-alifah.png"
    },
    {
      name: "Miranda, S.Pd",
      role: "Guru Kejuruan RPL",
      cert: "Rekayasa Perangkat Lunak",
      category: "produktif",
      initials: "MI",
      photo: "/teachers/miranda.jpg"
    },
    {
      name: "Nur Syafitri, S.IKom",
      role: "Guru Kejuruan Broadcasting",
      cert: "Broadcasting & Perfilman",
      category: "produktif",
      initials: "NS",
      photo: "/teachers/nur-syafitri.png"
    },
    {
      name: "Rina Wastanti, S.IKom",
      role: "Guru Kejuruan Broadcasting",
      cert: "Broadcasting & Perfilman",
      category: "produktif",
      initials: "RW",
      photo: "/teachers/rina-wastanti.png"
    },
    {
      name: "Dharma Wahyu Nurhidayati, A.Md",
      role: "Guru Kejuruan Teknik Elektronika",
      cert: "Teknik Elektronika Industri",
      category: "produktif",
      initials: "DW",
      photo: "/teachers/dharma-wahyu.png"
    },
    {
      name: "Yulfani Wulan Maulita, S.Ds",
      role: "Guru Kejuruan DKV",
      cert: "Desain Komunikasi Visual",
      category: "produktif",
      initials: "YW",
      photo: "/teachers/yulfani-wulan.png"
    },
    {
      name: "Gebi Abda Mahes Multazam, S.PdI",
      role: "Guru Mapel PAI",
      cert: "Pendidikan Agama Islam",
      category: "normatif",
      initials: "GM",
      photo: "/teachers/gebi-abda.png"
    },
    {
      name: "Shova Al-Marwah, S.Pd",
      role: "Guru Mapel PAI",
      cert: "Pendidikan Agama Islam",
      category: "normatif",
      initials: "SA",
      photo: "/teachers/shova-al-marwah.png"
    },
    {
      name: "Novita Ambarwati, S.Pd",
      role: "Guru Mapel IPAS",
      cert: "Ilmu Pengetahuan Alam & Sosial",
      category: "normatif",
      initials: "NO",
      photo: "/teachers/novita-ambarwati.png"
    },
    {
      name: "Furida Lusi Siagian, M.Si",
      role: "Guru Mapel Matematika & PAK",
      cert: "Matematika",
      category: "normatif",
      initials: "FL",
      photo: "/teachers/furida-lusi.png"
    },
    {
      name: "Ratna Wati, S.E",
      role: "Guru Mapel Seni dan Budaya",
      cert: "Seni & Budaya",
      category: "normatif",
      initials: "RN",
      photo: "/teachers/ratna-wati.png"
    },
    {
      name: "Fariz Achmad",
      role: "Guru Mapel Penjas",
      cert: "Pendidikan Jasmani & Olahraga",
      category: "normatif",
      initials: "FA",
      photo: "/teachers/fariz-achmad.jpg"
    },
    {
      name: "Dwi Setiawan, S.Pd",
      role: "Guru Mapel Penjas",
      cert: "Pendidikan Jasmani & Olahraga",
      category: "normatif",
      initials: "DS",
      photo: "/teachers/dwi-setiawan.png"
    },
    {
      name: "Syamsul Ma'arif, S.Kom",
      role: "Guru Mapel Penjas & Informatika",
      cert: "Informatika & Olahraga",
      category: "normatif",
      initials: "SM",
      photo: "/teachers/syamsul-maarif.png"
    },
    {
      name: "Maesitoh, S.Pd",
      role: "Guru Mapel Bahasa Indonesia",
      cert: "Bahasa & Sastra Indonesia",
      category: "normatif",
      initials: "ME",
      photo: "/teachers/maesitoh.png"
    },
    {
      name: "Diva Sisulowati, S.Pd",
      role: "Guru Mapel Bahasa Indonesia",
      cert: "Bahasa & Sastra Indonesia",
      category: "normatif",
      initials: "DI",
      photo: "/teachers/diva-sisulowati.png"
    },
    {
      name: "Aniek Rochmawati, S.Pd",
      role: "Guru Mapel Pendidikan Pancasila & Sejarah",
      cert: "PPKn & Sejarah",
      category: "normatif",
      initials: "AR",
      photo: "/teachers/aniek-rochmawati.png"
    },
    {
      name: "Drs. Abdul Rosyid",
      role: "Guru Mapel Pendidikan Pancasila",
      cert: "Pendidikan Pancasila & Kewarganegaraan",
      category: "normatif",
      initials: "AB",
      photo: "/teachers/abdul-rosyid.png"
    },
    {
      name: "Ana Susilowati, S.Pd",
      role: "Guru Mapel Bahasa Inggris",
      cert: "Bahasa Inggris",
      category: "normatif",
      initials: "AN",
      photo: "/teachers/ana-susilowati.png"
    },
    {
      name: "Muchlas Edi Kiswanto, S.Pd",
      role: "Guru Mapel Bahasa Inggris",
      cert: "Bahasa Inggris",
      category: "normatif",
      initials: "MK",
      photo: "/teachers/muchlas-edi.png"
    },
    {
      name: "Lia Debby Juwita, S.Pd",
      role: "Guru Mapel Bahasa Inggris",
      cert: "Bahasa Inggris",
      category: "normatif",
      initials: "LD",
      photo: "/teachers/lia-debby.png"
    },
    {
      name: "Anisatum Muawanah, S.Hum",
      role: "Guru Mapel Bahasa Sunda",
      cert: "Bahasa & Sastra Sunda",
      category: "normatif",
      initials: "AM",
      photo: "/teachers/anisatum-muawanah.png"
    }
  ]
};

