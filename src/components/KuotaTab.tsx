'use client';

import React, { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Download, RefreshCw, AlertCircle, Pencil, Save, X } from 'lucide-react';

interface KuotaItem {
  no: number;
  key: string;
  konsentrasi_keahlian: string;
  jumlah: number;
  target: number;
  presentase: string;
}

interface KuotaData {
  pendaftar: KuotaItem[];
  siswaAktif: KuotaItem[];
  totalPendaftar: number;
  totalSiswaAktif: number;
  totalTarget: number;
}

interface KuotaTabProps {
  type?: "pendaftar" | "siswa-aktif" | "keseluruhan";
  variant?: "default" | "minimal";
}

export default function KuotaTab({ type = "pendaftar", variant = "default" }: KuotaTabProps) {
  const [data, setData] = useState<KuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [editingTargets, setEditingTargets] = useState<Record<string, number>>({});
  const [isSavingTargets, setIsSavingTargets] = useState(false);

  const fetchKuota = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:5000/api/kuota');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
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

  const handleEditClick = () => {
    if (!data) return;
    const targets: Record<string, number> = {};
    const sourceData = type === "pendaftar" ? data.pendaftar : data.siswaAktif;
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
        fetchKuota();
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

  const exportToExcel = async () => {
    if (!data) return;
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Data Kuota');

      // Styles
      const titleFont = { name: 'Arial', size: 12, bold: true };
      const headerFont = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      const bodyFont = { name: 'Arial', size: 10 };
      const borderStyle = {
        top: { style: 'thin' as any },
        left: { style: 'thin' as any },
        bottom: { style: 'thin' as any },
        right: { style: 'thin' as any }
      };
      const alignCenter = { vertical: 'middle' as any, horizontal: 'center' as any };

      const createTable = (startRow: number, title: string, items: KuotaItem[], totalJumlah: number) => {
        // Titles
        sheet.mergeCells(`A${startRow}:E${startRow}`);
        const title1 = sheet.getCell(`A${startRow}`);
        title1.value = title;
        title1.font = titleFont;
        title1.alignment = alignCenter;

        sheet.mergeCells(`A${startRow + 1}:E${startRow + 1}`);
        const title2 = sheet.getCell(`A${startRow + 1}`);
        title2.value = "SMK TARUNA BHAKTI DEPOK";
        title2.font = titleFont;
        title2.alignment = alignCenter;

        sheet.mergeCells(`A${startRow + 2}:E${startRow + 2}`);
        const title3 = sheet.getCell(`A${startRow + 2}`);
        title3.value = "TAHUN AJARAN 2026/2027";
        title3.font = titleFont;
        title3.alignment = alignCenter;

        // Headers
        const headerRowIndex = startRow + 3;
        const headers = ["NO", "KONSENTRASI KEAHLIAN", "JUMLAH", "TARGET", "PRESENTASE"];
        headers.forEach((header, index) => {
          const colLetter = String.fromCharCode(65 + index);
          const cell = sheet.getCell(`${colLetter}${headerRowIndex}`);
          cell.value = header;
          cell.font = { ...headerFont, color: { argb: 'FF000000' } }; // Black font in image
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF6B9EE0' } // Blue header background
          };
          cell.border = borderStyle;
          cell.alignment = alignCenter;
        });

        // Data Rows
        let currentRow = headerRowIndex + 1;
        items.forEach((item) => {
          const rowData = [item.no, item.konsentrasi_keahlian, item.jumlah, item.target, item.presentase];
          rowData.forEach((val, index) => {
            const colLetter = String.fromCharCode(65 + index);
            const cell = sheet.getCell(`${colLetter}${currentRow}`);
            cell.value = val;
            cell.font = bodyFont;
            cell.border = borderStyle;
            cell.alignment = alignCenter;
          });
          currentRow++;
        });

        // Total Row
        sheet.mergeCells(`A${currentRow}:B${currentRow}`);
        const totalLabel = sheet.getCell(`A${currentRow}`);
        totalLabel.value = "TOTAL KESELURUHAN";
        totalLabel.font = { name: 'Arial', size: 10, bold: true };
        totalLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDBB11' } }; // Yellow/Orange
        totalLabel.border = borderStyle;
        totalLabel.alignment = alignCenter;

        const dummyB = sheet.getCell(`B${currentRow}`);
        dummyB.border = borderStyle;

        const totalJumlahCell = sheet.getCell(`C${currentRow}`);
        totalJumlahCell.value = totalJumlah;
        totalJumlahCell.font = { name: 'Arial', size: 10, bold: true };
        totalJumlahCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDBB11' } };
        totalJumlahCell.border = borderStyle;
        totalJumlahCell.alignment = alignCenter;

        const totalTargetCell = sheet.getCell(`D${currentRow}`);
        totalTargetCell.value = data.totalTarget;
        totalTargetCell.font = { name: 'Arial', size: 10, bold: true };
        totalTargetCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDBB11' } };
        totalTargetCell.border = borderStyle;
        totalTargetCell.alignment = alignCenter;

        const totalPersentaseCell = sheet.getCell(`E${currentRow}`);
        totalPersentaseCell.value = ""; // Empty in image for total percentage usually
        totalPersentaseCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDBB11' } };
        totalPersentaseCell.border = borderStyle;

        return currentRow + 3; // return next starting row
      };

      if (type === "pendaftar") {
        createTable(1, "PRESENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK", data.pendaftar, data.totalPendaftar);
      } else {
        createTable(1, "PRESENTASE FIX MASUK PESERTA DIDIK", data.siswaAktif, data.totalSiswaAktif);
      }

      // Set Column Widths
      sheet.getColumn('A').width = 5;
      sheet.getColumn('B').width = 30;
      sheet.getColumn('C').width = 15;
      sheet.getColumn('D').width = 15;
      sheet.getColumn('E').width = 15;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Data_Kuota_SMKTB.xlsx');
    } catch (err) {
      console.error('Error exporting excel', err);
      alert('Gagal mengexport file Excel');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <span className="font-semibold text-sm">{error}</span>
        <button onClick={fetchKuota} className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-bold transition">Coba Lagi</button>
      </div>
    );
  }

  const renderTable = (title: string, items: KuotaItem[], totalJumlah: number) => {
    let totalTargetEditing = 0;
    if (editMode) {
      totalTargetEditing = Object.values(editingTargets).reduce((a, b) => a + b, 0);
    }

    return (
      <div className={variant === "minimal" ? "w-full" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm mb-8 w-full max-w-4xl"}>
        <div className={`text-center ${variant === "minimal" ? "pb-4" : "p-6 border-b border-slate-200 dark:border-white/10"}`}>
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{title}</h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">SMK TARUNA BHAKTI DEPOK</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">TAHUN AJARAN 2026/2027</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-b border-slate-200 dark:border-white/10">
                <th className="p-4 border-r border-slate-200 dark:border-white/10 text-center w-12">NO</th>
                <th className="p-4 border-r border-slate-200 dark:border-white/10">KONSENTRASI KEAHLIAN</th>
                <th className="p-4 border-r border-slate-200 dark:border-white/10 text-center w-24">JUMLAH</th>
                <th className="p-4 border-r border-slate-200 dark:border-white/10 text-center w-32">TARGET</th>
                <th className="p-4 text-center w-24">PRESENTASE</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.no} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300">
                  <td className="p-4 border-r border-slate-200 dark:border-white/10 text-center">{item.no}</td>
                  <td className="p-4 border-r border-slate-200 dark:border-white/10">{item.konsentrasi_keahlian}</td>
                  <td className="p-4 border-r border-slate-200 dark:border-white/10 text-center">{item.jumlah}</td>
                  <td className="p-4 border-r border-slate-200 dark:border-white/10 text-center">
                    {editMode && item.key !== "Belum Memilih" ? (
                      <input 
                        type="number" 
                        value={editingTargets[item.key] ?? 0} 
                        onChange={(e) => handleTargetChange(item.key, e.target.value)}
                        className="w-full text-center py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600"
                        min="0"
                      />
                    ) : (
                      item.target
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editMode && item.key !== "Belum Memilih" && editingTargets[item.key] > 0
                      ? `${Math.round((item.jumlah / editingTargets[item.key]) * 100)}%`
                      : item.presentase}
                  </td>
                </tr>
              ))}
              <tr className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 font-bold">
                <td colSpan={2} className="p-4 border-r border-amber-200 dark:border-amber-900/50 text-center uppercase">TOTAL KESELURUHAN</td>
                <td className="p-4 border-r border-amber-200 dark:border-amber-900/50 text-center">{totalJumlah}</td>
                <td className="p-4 border-r border-amber-200 dark:border-amber-900/50 text-center">{editMode ? totalTargetEditing : data?.totalTarget}</td>
                <td className="p-4 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDonut = (title: string, items: KuotaItem[], totalJumlah: number) => {
    const colors = ["#ec4899", "#3b82f6", "#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#14b8a6"];
    
    // Filter out "Belum Memilih" or 0 count
    const validItems = items.filter(i => i.jumlah > 0 && i.key !== "Belum Memilih");
    const totalValid = validItems.reduce((acc, curr) => acc + curr.jumlah, 0) || 1;

    let accumulatedPercent = 0;
    const donutData = validItems.map((item, idx) => {
      const percent = Math.round((item.jumlah / totalValid) * 100);
      const startPercent = accumulatedPercent;
      accumulatedPercent += percent;
      return {
        ...item,
        percent,
        startPercent,
        color: colors[idx % colors.length]
      };
    });

    return (
      <div className="w-full flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg width="192" height="192" viewBox="0 0 42 42" className="transform -rotate-90 filter drop-shadow-md">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800/40" strokeWidth="6" />
            {donutData.map((d, idx) => {
              if (d.percent === 0) return null;
              const strokeDashValue = `${d.percent} ${100 - d.percent}`;
              const strokeDashOffset = 100 - d.startPercent;
              return (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth="6"
                  strokeDasharray={strokeDashValue}
                  strokeDashoffset={strokeDashOffset}
                  className="transition-all duration-700 ease-in-out cursor-pointer hover:stroke-[8px]"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Total</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">{totalJumlah}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-sm px-4">
          {donutData.map((d, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
              <div className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: d.color }}></div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{d.key}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">{d.jumlah}</span>
                  <span className="text-[9px] font-bold text-slate-400">({d.percent}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOverallDonut = () => {
    if (!data) return null;
    const target = data.totalTarget || 400;
    const aktif = data.totalSiswaAktif || 0;
    const pendaftar = data.totalPendaftar || 0;
    const proses = Math.max(0, pendaftar - aktif);
    const sisa = Math.max(0, target - Math.max(pendaftar, aktif));

    const overallData = [
      { key: "Siswa Aktif", jumlah: aktif, color: "#10b981" },
      { key: "Calon Siswa", jumlah: proses, color: "#f59e0b" },
      { key: "Sisa Kuota", jumlah: sisa, color: "#cbd5e1" }
    ];

    const totalValid = target;
    let accumulatedPercent = 0;
    const donutData = overallData.map((item) => {
      const percent = Math.round((item.jumlah / totalValid) * 100);
      const startPercent = accumulatedPercent;
      accumulatedPercent += percent;
      return { ...item, percent, startPercent };
    });

    return (
      <div className="w-full flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg width="192" height="192" viewBox="0 0 42 42" className="transform -rotate-90 filter drop-shadow-md">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800/40" strokeWidth="6" />
            {donutData.map((d, idx) => {
              if (d.percent === 0) return null;
              const strokeDashValue = `${d.percent} ${100 - d.percent}`;
              const strokeDashOffset = 100 - d.startPercent;
              return (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth="6"
                  strokeDasharray={strokeDashValue}
                  strokeDashoffset={strokeDashOffset}
                  className="transition-all duration-700 ease-in-out cursor-pointer hover:stroke-[8px]"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Kapasitas</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">{target}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs px-4 mx-auto">
          {donutData.map((d, idx) => (
            <div key={idx} className="flex flex-row justify-between items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: d.color }}></div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{d.key}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{d.jumlah}</span>
                <span className="text-[9px] font-bold text-slate-400">({d.percent}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full space-y-6 ${variant === "minimal" ? "" : "animate-in fade-in zoom-in-95 duration-300"}`}>
      {variant !== "minimal" && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-full max-w-4xl">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Data Kuota & Presentase</h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Rekapitulasi target dan pencapaian pendaftar</p>
        </div>
        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Batal
              </button>
              <button
                onClick={saveTargets}
                disabled={isSavingTargets}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70"
              >
                {isSavingTargets ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Target
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit Target Kuota
            </button>
          )}

          <button
            onClick={exportToExcel}
            disabled={isExporting || editMode}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm shadow-emerald-600/20"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Mengekspor...' : 'Export Excel'}
          </button>
        </div>
      </div>
      )}

      {data && (
        <div className="flex justify-start w-full">
          {variant === "minimal" ? (
            <>
              {type === "keseluruhan" && renderOverallDonut()}
              {type === "pendaftar" && renderDonut("PRESENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK", data.pendaftar, data.totalPendaftar)}
              {type === "siswa-aktif" && renderDonut("PRESENTASE FIX MASUK PESERTA DIDIK", data.siswaAktif, data.totalSiswaAktif)}
            </>
          ) : (
            <>
              {type === "pendaftar" && renderTable("PRESENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK", data.pendaftar, data.totalPendaftar)}
              {type === "siswa-aktif" && renderTable("PRESENTASE FIX MASUK PESERTA DIDIK", data.siswaAktif, data.totalSiswaAktif)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
