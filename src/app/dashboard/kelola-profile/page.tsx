"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import {
  School,
  History,
  Compass,
  Target,
  Users,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Award,
  ShieldCheck,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import {
  DEFAULT_SEJARAH,
  DEFAULT_VISI_MISI,
  DEFAULT_TUJUAN,
  DEFAULT_TENAGA_PENDIDIK,
  ProfileSejarahData,
  ProfileVisiMisiData,
  ProfileTujuanData,
  ProfileTenagaPendidikData,
  Milestone,
  MissionItem,
  GoalItem,
  StaffItem
} from "@/utils/profileDefaults";

export default function KelolaProfileSekolah() {
  const { adminToken, addToast } = usePPDB();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"sejarah" | "visi-misi" | "tujuan" | "tenaga-pendidik">("sejarah");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [sejarah, setSejarah] = useState<ProfileSejarahData>(DEFAULT_SEJARAH);
  const [visiMisi, setVisiMisi] = useState<ProfileVisiMisiData>(DEFAULT_VISI_MISI);
  const [tujuan, setTujuan] = useState<ProfileTujuanData>(DEFAULT_TUJUAN);
  const [tenagaPendidik, setTenagaPendidik] = useState<ProfileTenagaPendidikData>(DEFAULT_TENAGA_PENDIDIK);

  const BACKEND_URL = typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000`
    : "http://localhost:5000";

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["sejarah", "visi-misi", "tujuan", "tenaga-pendidik"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProfileConfigs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.ppdb_profile_sejarah) {
            setSejarah({ ...DEFAULT_SEJARAH, ...json.data.ppdb_profile_sejarah });
          }
          if (json.data.ppdb_profile_visi_misi) {
            setVisiMisi({ ...DEFAULT_VISI_MISI, ...json.data.ppdb_profile_visi_misi });
          }
          if (json.data.ppdb_profile_tujuan) {
            setTujuan({ ...DEFAULT_TUJUAN, ...json.data.ppdb_profile_tujuan });
          }
          if (json.data.ppdb_profile_tenaga_pendidik) {
            setTenagaPendidik({ ...DEFAULT_TENAGA_PENDIDIK, ...json.data.ppdb_profile_tenaga_pendidik });
          }
        }
      } catch (err) {
        console.error("Gagal memuat konfigurasi profil sekolah:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileConfigs();
  }, [BACKEND_URL]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");

      // Save all 4 sections via /api/config
      const updates = [
        { key: "ppdb_profile_sejarah", value: sejarah },
        { key: "ppdb_profile_visi_misi", value: visiMisi },
        { key: "ppdb_profile_tujuan", value: tujuan },
        { key: "ppdb_profile_tenaga_pendidik", value: tenagaPendidik },
      ];

      for (const item of updates) {
        const res = await fetch(`${BACKEND_URL}/api/config`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(item)
        });
        const resJson = await res.json();
        if (!resJson.success) {
          throw new Error(resJson.message || `Gagal menyimpan ${item.key}`);
        }
      }

      addToast("Perubahan Profile Sekolah berhasil disimpan dan aktif!", "success");
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Gagal menyimpan perubahan ke server.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Helper Milestone
  const addMilestone = () => {
    setSejarah(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { year: `${new Date().getFullYear()}`, title: "Pencapaian Baru", desc: "Deskripsi pencapaian atau peristiwa bersejarah sekolah..." }
      ]
    }));
  };

  const removeMilestone = (idx: number) => {
    setSejarah(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== idx)
    }));
  };

  const updateMilestone = (idx: number, key: keyof Milestone, val: string) => {
    setSejarah(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => i === idx ? { ...m, [key]: val } : m)
    }));
  };

  // Helper Mission
  const addMission = () => {
    const nextNum = (visiMisi.missions.length + 1).toString().padStart(2, "0");
    setVisiMisi(prev => ({
      ...prev,
      missions: [
        ...prev.missions,
        { number: nextNum, title: "Misi Baru", desc: "Penjelasan misi langkah nyata sekolah..." }
      ]
    }));
  };

  const removeMission = (idx: number) => {
    setVisiMisi(prev => ({
      ...prev,
      missions: prev.missions.filter((_, i) => i !== idx)
    }));
  };

  const updateMission = (idx: number, key: keyof MissionItem, val: string) => {
    setVisiMisi(prev => ({
      ...prev,
      missions: prev.missions.map((m, i) => i === idx ? { ...m, [key]: val } : m)
    }));
  };

  // Helper Goals & Pillars
  const addGoal = () => {
    setTujuan(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        { title: "Sasaran Baru", desc: "Deskripsi target capaian lulusan...", badge: "Target Baru" }
      ]
    }));
  };

  const removeGoal = (idx: number) => {
    setTujuan(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== idx)
    }));
  };

  const updateGoal = (idx: number, key: keyof GoalItem, val: string) => {
    setTujuan(prev => ({
      ...prev,
      goals: prev.goals.map((g, i) => i === idx ? { ...g, [key]: val } : g)
    }));
  };

  const addPillar = () => {
    setTujuan(prev => ({
      ...prev,
      pillars: [...prev.pillars, "Strategi baru pelaksanaan kurikulum dan sarana..."]
    }));
  };

  const removePillar = (idx: number) => {
    setTujuan(prev => ({
      ...prev,
      pillars: prev.pillars.filter((_, i) => i !== idx)
    }));
  };

  const updatePillar = (idx: number, val: string) => {
    setTujuan(prev => ({
      ...prev,
      pillars: prev.pillars.map((p, i) => i === idx ? val : p)
    }));
  };

  // Helper Staff
  const addStaff = () => {
    setTenagaPendidik(prev => ({
      ...prev,
      staff: [
        ...prev.staff,
        { name: "Nama Pendidik", role: "Jabatan / Mata Pelajaran", cert: "Sertifikasi Keahlian", category: "produktif", initials: "NP" }
      ]
    }));
  };

  const removeStaff = (idx: number) => {
    setTenagaPendidik(prev => ({
      ...prev,
      staff: prev.staff.filter((_, i) => i !== idx)
    }));
  };

  const updateStaff = (idx: number, key: keyof StaffItem, val: string) => {
    setTenagaPendidik(prev => ({
      ...prev,
      staff: prev.staff.map((s, i) => {
        if (i !== idx) return s;
        const updated = { ...s, [key]: val };
        if (key === "name") {
          // Auto generate initials from words
          const words = val.trim().split(" ");
          updated.initials = words.length >= 2
            ? (words[0][0] + words[1][0]).toUpperCase()
            : val.slice(0, 2).toUpperCase();
        }
        return updated;
      })
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Memuat data Profile Sekolah...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-sky-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <School size={22} />
          </div>
          <div>
            <h1 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">
              Kelola Profile Sekolah
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Edit isi Sejarah, Visi-Misi, Tujuan, dan Tenaga Pendidik secara dinamis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm("Reset seluruh data ke format awal bawaan?")) {
                setSejarah(DEFAULT_SEJARAH);
                setVisiMisi(DEFAULT_VISI_MISI);
                setTujuan(DEFAULT_TUJUAN);
                setTenagaPendidik(DEFAULT_TENAGA_PENDIDIK);
                addToast("Draf berhasil di-reset ke nilai default.", "info");
              }
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100/60 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 flex flex-wrap gap-1">
        {[
          { id: "sejarah", label: "Sejarah", icon: History },
          { id: "visi-misi", label: "Visi & Misi", icon: Compass },
          { id: "tujuan", label: "Tujuan Sekolah", icon: Target },
          { id: "tenaga-pendidik", label: "Tenaga Pendidik", icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-900"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────── TAB 1: SEJARAH ──────────────── */}
      {activeTab === "sejarah" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Informasi Umum Sejarah
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Judul Utama Halaman</label>
                <input
                  type="text"
                  value={sejarah.hero_title}
                  onChange={(e) => setSejarah({ ...sejarah, hero_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Judul Pengantar</label>
                <input
                  type="text"
                  value={sejarah.intro_title}
                  onChange={(e) => setSejarah({ ...sejarah, intro_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deskripsi Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={sejarah.hero_subtitle}
                  onChange={(e) => setSejarah({ ...sejarah, hero_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Status Akreditasi</label>
                <input
                  type="text"
                  value={sejarah.akreditasi}
                  onChange={(e) => setSejarah({ ...sejarah, akreditasi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Predikat Tingkat Nasional</label>
                <input
                  type="text"
                  value={sejarah.predikat_nasional}
                  onChange={(e) => setSejarah({ ...sejarah, predikat_nasional: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paragraf Pengantar 1</label>
                <textarea
                  rows={3}
                  value={sejarah.intro_p1}
                  onChange={(e) => setSejarah({ ...sejarah, intro_p1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paragraf Pengantar 2</label>
                <textarea
                  rows={3}
                  value={sejarah.intro_p2}
                  onChange={(e) => setSejarah({ ...sejarah, intro_p2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Milestones List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Daftar Tonggak Sejarah (Milestones)
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">Tahun dan pencapaian penting sekolah</p>
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Tonggak</span>
              </button>
            </div>

            <div className="space-y-4">
              {sejarah.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={m.year}
                        onChange={(e) => updateMilestone(idx, "year", e.target.value)}
                        placeholder="Tahun (Contoh: 2004)"
                        className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-sky-400"
                      />
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                        placeholder="Judul Tonggak Sejarah"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Tonggak"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={m.desc}
                    onChange={(e) => updateMilestone(idx, "desc", e.target.value)}
                    placeholder="Uraian peristiwa sejarah..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: VISI-MISI ──────────────── */}
      {activeTab === "visi-misi" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Visi Sekolah
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Teks Pernyataan Visi</label>
                <textarea
                  rows={3}
                  value={visiMisi.visi}
                  onChange={(e) => setVisiMisi({ ...visiMisi, visi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Penjelasan Filosofi Visi</label>
                <textarea
                  rows={2}
                  value={visiMisi.visi_desc}
                  onChange={(e) => setVisiMisi({ ...visiMisi, visi_desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Missions List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Poin Misi Sekolah
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">Langkah nyata pelaksanaan visi institusi</p>
              </div>
              <button
                type="button"
                onClick={addMission}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Misi</span>
              </button>
            </div>

            <div className="space-y-4">
              {visiMisi.missions.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={m.number}
                        onChange={(e) => updateMission(idx, "number", e.target.value)}
                        placeholder="No (01)"
                        className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-sky-400"
                      />
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => updateMission(idx, "title", e.target.value)}
                        placeholder="Judul Misi"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMission(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Misi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={m.desc}
                    onChange={(e) => updateMission(idx, "desc", e.target.value)}
                    placeholder="Uraian pelaksanaan misi..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: TUJUAN ──────────────── */}
      {activeTab === "tujuan" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Sasaran Pendidikan Sekolah
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deskripsi Subtitle Tujuan</label>
              <textarea
                rows={2}
                value={tujuan.hero_desc}
                onChange={(e) => setTujuan({ ...tujuan, hero_desc: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Strategic Goals Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Pilar Tujuan Strategis (BMW)
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">Bekerja, Melanjutkan, Wirausaha, dan Sertifikasi</p>
              </div>
              <button
                type="button"
                onClick={addGoal}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Sasaran</span>
              </button>
            </div>

            <div className="space-y-4">
              {tujuan.goals.map((g, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={g.title}
                        onChange={(e) => updateGoal(idx, "title", e.target.value)}
                        placeholder="Judul Sasaran"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={g.badge}
                        onChange={(e) => updateGoal(idx, "badge", e.target.value)}
                        placeholder="Badge / Target"
                        className="w-48 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-sky-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGoal(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Sasaran"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={g.desc}
                    onChange={(e) => updateGoal(idx, "desc", e.target.value)}
                    placeholder="Uraian sasaran strategis..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pillars List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Strategi Pencapaian Tujuan
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">Daftar poin strategi link and match industri</p>
              </div>
              <button
                type="button"
                onClick={addPillar}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Strategi</span>
              </button>
            </div>

            <div className="space-y-3">
              {tujuan.pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={pillar}
                    onChange={(e) => updatePillar(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePillar(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: TENAGA PENDIDIK ──────────────── */}
      {activeTab === "tenaga-pendidik" && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Statistik Keunggulan Guru & Staf
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deskripsi Pengantar Halaman</label>
                <textarea
                  rows={2}
                  value={tenagaPendidik.hero_desc}
                  onChange={(e) => setTenagaPendidik({ ...tenagaPendidik, hero_desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Persentase Sertifikasi</label>
                  <input
                    type="text"
                    value={tenagaPendidik.stats?.sertifikasi || "95%+"}
                    onChange={(e) => setTenagaPendidik({
                      ...tenagaPendidik,
                      stats: { ...tenagaPendidik.stats, sertifikasi: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-bold text-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Rasio Guru:Siswa</label>
                  <input
                    type="text"
                    value={tenagaPendidik.stats?.rasio || "1:18"}
                    onChange={(e) => setTenagaPendidik({
                      ...tenagaPendidik,
                      stats: { ...tenagaPendidik.stats, rasio: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-bold text-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Instruktur Industri Tamu</label>
                  <input
                    type="text"
                    value={tenagaPendidik.stats?.industri_tamu || "12+"}
                    onChange={(e) => setTenagaPendidik({
                      ...tenagaPendidik,
                      stats: { ...tenagaPendidik.stats, industri_tamu: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-bold text-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Tingkat Dedikasi</label>
                  <input
                    type="text"
                    value={tenagaPendidik.stats?.dedikasi || "100%"}
                    onChange={(e) => setTenagaPendidik({
                      ...tenagaPendidik,
                      stats: { ...tenagaPendidik.stats, dedikasi: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-bold text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Staff Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Daftar Pimpinan & Tenaga Pendidik
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">Total {tenagaPendidik.staff.length} orang tercatat</p>
              </div>
              <button
                type="button"
                onClick={addStaff}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Pendidik</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenagaPendidik.staff.map((staff, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeStaff(idx)}
                    className="absolute top-4 right-4 p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Staff"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="space-y-2 pr-8">
                    {/* Photo Upload */}
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400">Foto Guru</label>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 shadow">
                          {staff.photo ? (
                            <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-black text-sm">
                              {staff.initials || "?"}
                            </div>
                          )}
                        </div>
                        <label className="flex-1 cursor-pointer">
                          <div className="px-3 py-1.5 rounded-lg border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 text-xs font-semibold text-blue-600 dark:text-sky-400 text-center hover:border-blue-500 transition-colors">
                            Ganti Foto
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = async () => {
                                const base64 = reader.result as string;
                                const safeName = staff.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
                                try {
                                  const res = await fetch(`${BACKEND_URL}/api/upload/teacher-photo`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${adminToken}`,
                                    },
                                    body: JSON.stringify({ base64, filename: safeName }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    updateStaff(idx, "photo", data.url);
                                    addToast("Foto berhasil diupload!", "success");
                                  } else {
                                    addToast(data.message || "Gagal upload foto.", "error");
                                  }
                                } catch {
                                  addToast("Koneksi gagal saat upload foto.", "error");
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={staff.name}
                        onChange={(e) => updateStaff(idx, "name", e.target.value)}
                        placeholder="Nama Pendidik"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Jabatan / Role</label>
                        <input
                          type="text"
                          value={staff.role}
                          onChange={(e) => updateStaff(idx, "role", e.target.value)}
                          placeholder="Jabatan"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Kategori</label>
                        <select
                          value={staff.category}
                          onChange={(e) => updateStaff(idx, "category", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                        >
                          <option value="pimpinan">Pimpinan Sekolah</option>
                          <option value="produktif">Guru Produktif Kejuruan</option>
                          <option value="normatif">Guru Umum & Bahasa</option>
                          <option value="bk">Guru BK</option>
                          <option value="tendik">Tenaga Kependidikan</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400">Sertifikasi / Lisensi Industri</label>
                      <input
                        type="text"
                        value={staff.cert}
                        onChange={(e) => updateStaff(idx, "cert", e.target.value)}
                        placeholder="Contoh: AWS Certified, Asesor BNSP"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
