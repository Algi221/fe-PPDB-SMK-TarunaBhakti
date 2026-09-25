"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Breadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const paths = pathname.split("/").filter((p) => p);
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    admin: "Manajemen Admin",
    pendaftar: "Data Calon Siswa",
    "siswa-aktif": "Siswa Aktif",
    informasi: "Kelola Informasi",
    "kelola-ui": "Kelola UI/Data",
    "pembagian-kelas": "Pembagian Kelas",
    settings: "Pengaturan",
    profile: "Profil Saya",
  };

  const breadcrumbs: { label: string; href: string }[] = [];
  paths.forEach((path, idx) => {
    const label = labelMap[path] || path;
    const href = "/" + paths.slice(0, idx + 1).join("/");
    breadcrumbs.push({ label, href });
  });

  if (pathname === "/dashboard/admin" && activeTab === "trash")
    breadcrumbs.push({ label: "Sampah", href: "/dashboard/admin?tab=trash" });
  else if (pathname === "/dashboard/pendaftar" && activeTab === "trash")
    breadcrumbs.push({ label: "Sampah", href: "/dashboard/pendaftar?tab=trash" });

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide select-none">
      {breadcrumbs.map((bc, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-300 dark:text-slate-700">›</span>}
            {isLast ? (
              <span className="text-slate-650 dark:text-slate-300 font-semibold">{bc.label}</span>
            ) : (
              <Link href={bc.href} className="hover:text-slate-650 dark:hover:text-slate-350 transition-colors">
                {bc.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
