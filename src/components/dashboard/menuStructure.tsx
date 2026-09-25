import React from "react";
import {
  LayoutDashboard, Users, Settings,
  Megaphone, GraduationCap,
  Palette, Layers, Shield
} from "lucide-react";

export interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
  superAdminOnly?: boolean;
  subItems?: { label: string; href: string }[];
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export const menuStructure: MenuCategory[] = [
  {
    category: "Manajemen Siswa",
    items: [
      { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Ringkasan", exact: true },
      {
        href: "/dashboard/pendaftar",
        icon: <Users size={18} />,
        label: "Data Calon Siswa",
        subItems: [
          { label: "Pendaftar Reguler", href: "/dashboard/pendaftar?tab=active" },
          { label: "Pendaftar Pindahan", href: "/dashboard/pendaftar?tab=transfer" },
          { label: "Kuota & Target", href: "/dashboard/pendaftar?tab=kuota" },
          { label: "Tempat Sampah", href: "/dashboard/pendaftar?tab=trash" }
        ]
      },
      { href: "/dashboard/pembagian-kelas", icon: <Layers size={18} />, label: "Pembagian Kelas" },
      { href: "/dashboard/siswa-aktif", icon: <GraduationCap size={18} />, label: "Siswa Aktif" }
    ]
  },
  {
    category: "Konten Portal",
    items: [
      { href: "/dashboard/informasi", icon: <Megaphone size={18} />, label: "Kelola Informasi" },
      {
        href: "/dashboard/kelola-ui",
        icon: <Palette size={18} />,
        label: "Kelola UI/Data",
        subItems: [
          { label: "Hero & Kontak", href: "/dashboard/kelola-ui?tab=hero" },
          { label: "Program Keahlian", href: "/dashboard/kelola-ui?tab=majors" },
          { label: "Alur Pendaftaran", href: "/dashboard/kelola-ui?tab=alur" },
          { label: "Form & Panduan", href: "/dashboard/kelola-ui?tab=form" },
          { label: "Bank Sekolah", href: "/dashboard/kelola-ui?tab=bank" },
          { label: "Mitra Industri", href: "/dashboard/kelola-ui?tab=partners" },
          { label: "FAQ", href: "/dashboard/kelola-ui?tab=faq" },
          { label: "Riwayat Perubahan", href: "/dashboard/kelola-ui?tab=revisions" }
        ]
      }
    ]
  },
  {
    category: "Pengaturan Sistem",
    items: [
      { href: "/dashboard/admin", icon: <Shield size={18} />, label: "Manajemen Admin", superAdminOnly: true },
      { href: "/dashboard/settings", icon: <Settings size={18} />, label: "Pengaturan" }
    ]
  }
];
