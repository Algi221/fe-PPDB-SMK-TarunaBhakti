import React from 'react';
import { KuotaItem } from './types';

interface KuotaTableCardProps {
  title: string;
  items: KuotaItem[];
  totalJumlah: number;
  totalTarget: number;
  badgeBg: string;
  badgeText: string;
  editMode: boolean;
  editingTargets: Record<string, number>;
  onTargetChange: (key: string, value: string) => void;
}

export default function KuotaTableCard({
  title,
  items,
  totalJumlah,
  totalTarget,
  badgeBg,
  badgeText,
  editMode,
  editingTargets,
  onTargetChange
}: KuotaTableCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-base">
          {title}
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeBg} ${badgeText}`}>
          Total: {totalJumlah} / {totalTarget}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
              <th className="py-2.5 px-3 w-12 text-center">NO</th>
              <th className="py-2.5 px-3">KONSENTRASI KEAHLIAN</th>
              <th className="py-2.5 px-3 text-center">JUMLAH</th>
              <th className="py-2.5 px-3 text-center">TARGET</th>
              <th className="py-2.5 px-3 text-center">PRESENTASE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
            {items.map((item) => (
              <tr key={item.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 text-center text-slate-400">{item.no}</td>
                <td className="py-2.5 px-3 font-semibold">{item.konsentrasi_keahlian}</td>
                <td className="py-2.5 px-3 text-center">{item.jumlah}</td>
                <td className="py-2.5 px-3 text-center">
                  {editMode && item.key !== "Belum Memilih" ? (
                    <input
                      type="number"
                      min="0"
                      value={editingTargets[item.key] ?? item.target}
                      onChange={(e) => onTargetChange(item.key, e.target.value)}
                      className="w-16 px-1.5 py-0.5 text-center border border-blue-400 dark:border-blue-500 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    item.target
                  )}
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400">
                  {item.presentase}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-amber-500/10 dark:bg-amber-500/5 font-bold text-slate-800 dark:text-white">
              <td colSpan={2} className="py-2.5 px-3 text-center">TOTAL KESELURUHAN</td>
              <td className="py-2.5 px-3 text-center">{totalJumlah}</td>
              <td className="py-2.5 px-3 text-center">{totalTarget}</td>
              <td className="py-2.5 px-3 text-center text-amber-600 dark:text-amber-400 font-extrabold">
                {totalTarget > 0 ? `${Math.round((totalJumlah / totalTarget) * 100)}%` : '0%'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
