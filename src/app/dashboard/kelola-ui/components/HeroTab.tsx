"use client";

import React from "react";
import { Building, Upload, FileText, Info, Calendar } from "lucide-react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import DOMPurify from "dompurify";
import { formatPhoneNumber } from "../types";

interface HeroTabProps {
  schoolLogo: string;
  setSchoolLogo: (val: string) => void;
  schoolTitle: string;
  setSchoolTitle: (val: string) => void;
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroTitleSub: string;
  setHeroTitleSub: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  schoolPeriod: string;
  setSchoolPeriod: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  waGroupUrl: string;
  setWaGroupUrl: (val: string) => void;
  waAdmin: string;
  setWaAdmin: (val: string) => void;
  gelombangConfig: {
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  };
  setGelombangConfig: React.Dispatch<React.SetStateAction<{
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  }>>;
  g1Error: string | null;
  setG1Error: (val: string | null) => void;
  g2Error: string | null;
  setG2Error: (val: string | null) => void;
  dragActiveStates: Record<string, boolean>;
  handleDragState: (e: React.DragEvent, elementId: string, active: boolean) => void;
  handleSchoolLogoChange: (file: File) => void;
}

export default function HeroTab({
  schoolLogo,
  schoolTitle,
  setSchoolTitle,
  heroTitle,
  setHeroTitle,
  heroTitleSub,
  setHeroTitleSub,
  heroSubtitle,
  setHeroSubtitle,
  phone,
  setPhone,
  email,
  setEmail,
  schoolPeriod,
  setSchoolPeriod,
  address,
  setAddress,
  waGroupUrl,
  setWaGroupUrl,
  waAdmin,
  setWaAdmin,
  gelombangConfig,
  setGelombangConfig,
  g1Error,
  setG1Error,
  g2Error,
  setG2Error,
  dragActiveStates,
  handleDragState,
  handleSchoolLogoChange,
}: HeroTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
          <Building size={16} className="text-blue-500" />
          <span>Logo &amp; Nama Instansi (Header Website)</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-950/40 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5">
        {/* Logo Drag & Drop */}
        <div className="md:col-span-1 flex flex-col items-center gap-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Logo Instansi (Header)</label>
          <div
            className={`w-24 h-24 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all duration-300 ${
              dragActiveStates["school_logo"]
                ? "border-blue-500 bg-blue-500/5"
                : "border-slate-200 dark:border-white/10 hover:border-slate-350 dark:hover:border-white/20 bg-white dark:bg-slate-900"
            }`}
            onDragEnter={(e) => handleDragState(e, "school_logo", true)}
            onDragOver={(e) => handleDragState(e, "school_logo", true)}
            onDragLeave={(e) => handleDragState(e, "school_logo", false)}
            onDrop={(e) => {
              handleDragState(e, "school_logo", false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleSchoolLogoChange(file);
            }}
          >
            {schoolLogo ? (
              <img src={DOMPurify.sanitize(schoolLogo)} alt="Logo Sekolah" className="w-full h-full object-contain rounded-2xl" />
            ) : (
              <div className="text-center text-slate-400">
                <Upload size={20} className="mx-auto mb-1 text-slate-300" />
                <span className="text-[9px] font-bold">Upload Logo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSchoolLogoChange(file);
              }}
            />
          </div>
        </div>

        {/* Nama Sekolah / Title */}
        <div className="md:col-span-2 space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Nama Instansi / Singkatan (Header)</label>
            <input
              type="text"
              value={schoolTitle}
              onChange={(e) => setSchoolTitle(e.target.value)}
              placeholder="Contoh: PPDB SMK TB"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-white/5 pb-4 mt-8 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
          <FileText size={16} className="text-blue-500" />
          <span>Hero Section &amp; Header Utama</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Hero Title (Judul Utama)</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Contoh: Penerimaan Siswa Baru"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Hero Sub-Title (Judul Pelengkap)</label>
          <input
            type="text"
            value={heroTitleSub}
            onChange={(e) => setHeroTitleSub(e.target.value)}
            placeholder="Contoh: Portal PPDB SMK Taruna Bhakti"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Hero Subtitle (Deskripsi Paragraf)</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={3}
            placeholder="Tuliskan deskripsi singkat mengenai portal pendaftaran di halaman utama..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-white/5 pb-4 mt-8 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
          <Info size={16} className="text-blue-500" />
          <span>Informasi Sekolah &amp; Kontak</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Nomor Telepon Sekolah</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder="Contoh: +62218740756"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Email Resmi Sekolah</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Contoh: info@smktarunabhakti.sch.id"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Tahun Pelajaran Terbit (Periode)</label>
          <input
            type="text"
            value={schoolPeriod}
            onChange={(e) => setSchoolPeriod(e.target.value)}
            placeholder="Contoh: 2026-2027"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2 md:col-span-3">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Alamat Fisik Sekolah</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap sekolah..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Link Grup WhatsApp PPDB Calon Siswa</label>
          <input
            type="text"
            value={waGroupUrl}
            onChange={(e) => setWaGroupUrl(e.target.value)}
            placeholder="Contoh: https://chat.whatsapp.com/..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Nomor WhatsApp Tim PPDB (Konsultasi)</label>
          <input
            type="text"
            value={waAdmin}
            onChange={(e) => setWaAdmin(formatPhoneNumber(e.target.value))}
            placeholder="Contoh: +6281292244456"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Gelombang Pendaftaran Section */}
      <div className="border-t border-slate-100 dark:border-white/5 pt-8 mt-8 pb-4 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
          <Calendar size={16} className="text-indigo-500" />
          <span>Rentang Tanggal Gelombang Pendaftaran</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Konfigurasikan masa aktif Gelombang 1 dan Gelombang 2 untuk portal pendaftaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gelombang 1 */}
        <DateRangeCalendar
          label="Gelombang 1"
          startValue={gelombangConfig.gelombang1.start}
          endValue={gelombangConfig.gelombang1.end}
          onSelectRange={(start, end) => {
            setGelombangConfig(prev => ({
              ...prev,
              gelombang1: { start, end }
            }));
          }}
          excludeRange={gelombangConfig.gelombang2.start && gelombangConfig.gelombang2.end ? gelombangConfig.gelombang2 : null}
          error={g1Error}
          setError={setG1Error}
        />

        {/* Gelombang 2 */}
        <DateRangeCalendar
          label="Gelombang 2"
          startValue={gelombangConfig.gelombang2.start}
          endValue={gelombangConfig.gelombang2.end}
          onSelectRange={(start, end) => {
            setGelombangConfig(prev => ({
              ...prev,
              gelombang2: { start, end }
            }));
          }}
          excludeRange={gelombangConfig.gelombang1.start && gelombangConfig.gelombang1.end ? gelombangConfig.gelombang1 : null}
          error={g2Error}
          setError={setG2Error}
        />
      </div>
    </div>
  );
}
