import React from "react";

export const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (e) {
    return `2627${10000 + id}`;
  }
};

export interface Applicant {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  status?: string;
  periode?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tglLahir?: string;
  [key: string]: any;
}

export interface ClassItem {
  id: string;
  name: string;
  majorCode: string;
  maxCapacity: number;
}

export const getMajorLogoUrl = (code: string) => {
  switch (code.toUpperCase()) {
    case "RPL":
      return "/assets/jurusan/pplg.png";
    case "TJKT":
      return "/assets/jurusan/tjkt.png";
    case "DKV":
      return "/assets/jurusan/dkv.png";
    case "BC":
      return "/assets/jurusan/bc.png";
    case "ANM":
      return "/assets/jurusan/animasi.png";
    case "TE":
      return "/assets/jurusan/te.png";
    default:
      return "/logo_smktb.png";
  }
};

export const getMajorLogo = (code: string, size = "w-5 h-5") => {
  const url = getMajorLogoUrl(code);
  return (
    <img
      src={url}
      alt={`Logo ${code}`}
      className={`${size} rounded-full object-cover shrink-0 border border-slate-200/80 dark:border-white/10`}
    />
  );
};
