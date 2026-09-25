import React from 'react';
import { Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PasswordEditForm({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrentPwd,
  setShowCurrentPwd,
  showNewPwd,
  setShowNewPwd,
  showConfirmPwd,
  setShowConfirmPwd,
  passwordMsg,
  passwordSaving,
  handleChangePassword
}: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-2xl bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center">
          <Lock size={16} className="text-slate-500" />
        </div>
        <div>
          <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Ubah Password</h2>
          <p className="text-[10px] text-slate-400 font-semibold">Pastikan akun Anda menggunakan password yang kuat</p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showCurrentPwd ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500/60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPwd((v: boolean) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showCurrentPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showNewPwd ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500/60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPwd((v: boolean) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Password strength bar */}
          {newPassword && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => {
                  const strength = Math.min(
                    Math.floor(newPassword.length / 3) +
                    (newPassword.length >= 8 ? 1 : 0) +
                    (/[A-Z]/.test(newPassword) ? 0.5 : 0) +
                    (/[0-9]/.test(newPassword) ? 0.5 : 0) +
                    (/[^a-zA-Z0-9]/.test(newPassword) ? 1 : 0),
                    4
                  );
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strength
                          ? strength <= 1 ? "bg-rose-400" : strength <= 2 ? "bg-slate-400" : strength <= 3 ? "bg-blue-400" : "bg-emerald-400"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  );
                })}
              </div>
              <p className={`text-[9px] font-bold ${
                newPassword.length < 6 ? "text-rose-400" : newPassword.length < 10 ? "text-slate-400" : "text-emerald-400"
              }`}>
                {newPassword.length < 6 ? "Terlalu pendek" : newPassword.length < 10 ? "Password cukup" : "Password kuat"}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPwd ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500/60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPwd((v: boolean) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {passwordMsg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold ${
            passwordMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
          }`}>
            {passwordMsg.type === "success"
              ? <CheckCircle2 size={14} className="shrink-0" />
              : <AlertCircle size={14} className="shrink-0" />}
            {passwordMsg.text}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={passwordSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 hover:from-slate-700 hover:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow shadow-slate-500/20 transition-all"
          >
            {passwordSaving ? (
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
                Ubah Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
