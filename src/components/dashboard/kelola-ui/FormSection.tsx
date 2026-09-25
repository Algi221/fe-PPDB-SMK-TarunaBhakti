"use client";

import React from "react";
import { Info } from "lucide-react";

export interface FormSectionProps {
  formFee: string;
  setFormFee: (val: string) => void;
  formatRupiah: (val: string) => string;
  formGuideline: string;
  setFormGuideline: (val: string) => void;
  fieldsConfigUI: Record<string, any>;
  setFieldsConfigUI: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  DEFAULT_FIELDS_CONFIG_UI: Record<string, any>;
}

export default function FormSection(props: FormSectionProps) {
  const { 
    formFee, setFormFee, formatRupiah, 
    formGuideline, setFormGuideline, 
    fieldsConfigUI, setFieldsConfigUI, DEFAULT_FIELDS_CONFIG_UI 
  } = props;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
          <Info size={16} className="text-blue-500" />
          <span>Panduan Pengisian Formulir &amp; Biaya</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Biaya Formulir Pendaftaran (Rupiah)</label>
          <input
            type="text"
            value={formatRupiah(formFee)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setFormFee(raw);
            }}
            placeholder="Contoh: Rp 250.000"
            className="w-full max-w-sm px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Petunjuk / Panduan Registrasi (Form Wizard)</label>
          <textarea
            value={formGuideline}
            onChange={(e) => setFormGuideline(e.target.value)}
            rows={5}
            placeholder="Tuliskan catatan panduan yang akan tampil diatas form pengisian wizard..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>
      </div>

      {/* ── Konfigurasi Field Form Pendaftaran */}
      <div className="border-t border-slate-100 dark:border-white/5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Konfigurasi Field Form Pendaftaran
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Atur field mana yang aktif dan apakah wajib diisi atau opsional</p>
          </div>
          <button
            type="button"
            onClick={() => setFieldsConfigUI(DEFAULT_FIELDS_CONFIG_UI)}
            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
          >
            Reset Default
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-white/5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/5">
                <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400">Field / Kolom</th>
                <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400 text-center">Aktif</th>
                <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400 text-center">Wajib Diisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {Object.entries(fieldsConfigUI).map(([key, cfg]) => (
                <tr key={key} className="hover:bg-slate-50/60 dark:hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2.5">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white text-xs">{cfg.label}</span>
                      <span className="ml-2 text-[9px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{key}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => setFieldsConfigUI(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }))}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        cfg.active ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      title={cfg.active ? 'Nonaktifkan field' : 'Aktifkan field'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                        cfg.active ? 'left-[18px]' : 'left-0.5'
                      }`} />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      disabled={!cfg.active}
                      onClick={() => setFieldsConfigUI(prev => ({ ...prev, [key]: { ...prev[key], required: !prev[key].required } }))}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                        cfg.required && cfg.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      title={cfg.required ? 'Jadikan opsional' : 'Jadikan wajib'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                        cfg.required && cfg.active ? 'left-[18px]' : 'left-0.5'
                      }`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
