import React from 'react';
import { User, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileEditForm({
  namaLengkap,
  setNamaLengkap,
  username,
  setUsername,
  profileMsg,
  profileSaving,
  handleSaveProfile
}: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
          <User size={16} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Informasi Profil</h2>
          <p className="text-[10px] text-slate-400 font-semibold">Perbarui nama dan username akun Anda</p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
          />
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Hanya huruf, angka, dan underscore.</p>
        </div>

        {/* Status Message */}
        {profileMsg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold ${
            profileMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
          }`}>
            {profileMsg.type === "success"
              ? <CheckCircle2 size={14} className="shrink-0" />
              : <AlertCircle size={14} className="shrink-0" />}
            {profileMsg.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            {profileSaving ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={14} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
