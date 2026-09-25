'use client';

import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, AlertCircle, Pencil, Save, X, Calendar } from 'lucide-react';
import { KuotaData, KuotaTabProps } from './kuota/types';
import { exportKuotaToExcel } from './kuota/kuotaExcelExport';
import KuotaTableCard from './kuota/KuotaTableCard';

export default function KuotaTab({ type = "pendaftar", variant = "default" }: KuotaTabProps) {
  const [data, setData] = useState<KuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [editingTargets, setEditingTargets] = useState<Record<string, number>>({});
  const [isSavingTargets, setIsSavingTargets] = useState(false);

  const [selectedPeriode, setSelectedPeriode] = useState<string>("");
  const [availablePeriodes, setAvailablePeriodes] = useState<string[]>([]);

  const fetchKuota = async (periode?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = periode
        ? `http://localhost:5000/api/kuota?periode=${encodeURIComponent(periode)}`
        : 'http://localhost:5000/api/kuota';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        if (json.data.availablePeriodes && availablePeriodes.length === 0) {
          setAvailablePeriodes(json.data.availablePeriodes);
        }
      } else {
        throw new Error(json.error || 'Gagal memuat data kuota');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKuota();
  }, []);

  const handlePeriodeChange = (newPeriode: string) => {
    setSelectedPeriode(newPeriode);
    setEditMode(false);
    if (newPeriode === "") {
      fetchKuota();
    } else {
      fetchKuota(newPeriode);
    }
  };

  const getPeriodeDisplay = () => {
    if (!selectedPeriode) return "Semua Periode";
    const parts = selectedPeriode.split("-");
    return `${parts[0]}/${parts[1]}`;
  };

  const handleEditClick = () => {
    if (!data) return;
    const targets: Record<string, number> = {};
    const sourceData = data.pendaftar;
    sourceData.forEach(item => {
      if (item.key !== "Belum Memilih") {
        targets[item.key] = item.target;
      }
    });
    setEditingTargets(targets);
    setEditMode(true);
  };

  const handleTargetChange = (key: string, value: string) => {
    const num = parseInt(value, 10);
    setEditingTargets(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num
    }));
  };

  const saveTargets = async () => {
    try {
      setIsSavingTargets(true);
      const res = await fetch('http://localhost:5000/api/kuota/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: editingTargets })
      });
      const json = await res.json();
      if (json.success) {
        setEditMode(false);
        fetchKuota(selectedPeriode || undefined);
      } else {
        alert(json.error || 'Gagal menyimpan target kuota');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSavingTargets(false);
    }
  };

  const handleExport = async () => {
    if (!data) return;
    try {
      setIsExporting(true);
      await exportKuotaToExcel(data, selectedPeriode);
    } catch (err) {
      console.error('Error exporting excel', err);
      alert('Gagal mengexport file Excel');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data target kuota...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/50 flex flex-col items-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => fetchKuota(selectedPeriode || undefined)}
          className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold hover:bg-red-200"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Target &amp; Realisasi Kuota
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              {getPeriodeDisplay()}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perbandingan jumlah pendaftar dan siswa aktif terhadap target kapasitas jurusan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Periode Selector */}
          {availablePeriodes.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedPeriode}
                onChange={(e) => handlePeriodeChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="">Semua Periode</option>
                {availablePeriodes.map((p) => (
                  <option key={p} value={p}>
                    TA {p.replace("-", "/")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Edit Target Button */}
          {variant !== "minimal" && (
            editMode ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={saveTargets}
                  disabled={isSavingTargets}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingTargets ? 'Menyimpan...' : 'Simpan Target'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={isSavingTargets}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Batal
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                Edit Target
              </button>
            )
          )}

          {/* Export Excel Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Target Edit Banner Notice */}
      {editMode && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <span>Mode pengeditan target kuota aktif. Masukkan target baru pada kolom Target di bawah ini, lalu klik Simpan.</span>
        </div>
      )}

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Pendaftar */}
        <KuotaTableCard
          title="Presentase Pembelian Formulir (Pendaftar)"
          items={data.pendaftar}
          totalJumlah={data.totalPendaftar}
          totalTarget={data.totalTarget}
          badgeBg="bg-blue-100 dark:bg-blue-900/30"
          badgeText="text-blue-700 dark:text-blue-300"
          editMode={editMode}
          editingTargets={editingTargets}
          onTargetChange={handleTargetChange}
        />

        {/* Table 2: Siswa Aktif */}
        <KuotaTableCard
          title="Presentase Fix Masuk (Siswa Aktif)"
          items={data.siswaAktif}
          totalJumlah={data.totalSiswaAktif}
          totalTarget={data.totalTarget}
          badgeBg="bg-emerald-100 dark:bg-emerald-900/30"
          badgeText="text-emerald-700 dark:text-emerald-300"
          editMode={editMode}
          editingTargets={editingTargets}
          onTargetChange={handleTargetChange}
        />
      </div>
    </div>
  );
}
