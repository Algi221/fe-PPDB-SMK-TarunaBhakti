"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin, adminToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (adminToken) {
      router.push("/dashboard");
    }
  }, [adminToken, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Username atau Password salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white overflow-hidden font-sans p-4 md:p-8 transition-colors duration-300">
      {/* Subtle Glowing Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-sky-400/5 dark:bg-sky-500/10 blur-[130px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-4xl min-h-[600px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.04)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* Left Side: Solid Brand Blue Static Visual Block */}
        <div className="hidden md:flex md:w-[45%] p-10 bg-blue-600 relative flex-col justify-between overflow-hidden text-white shrink-0">

          {/* Header Info */}
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-[9px] font-black tracking-widest uppercase">
              PPDB Taruna Bhakti
            </div>
          </div>

          {/* Center Logo Area */}
          <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center gap-6">
            <div className="w-90 h-90 rounded-[40px] bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center p-6 shadow-xl transition-all">
              <img 
                src="/logo_smktb.png" 
                alt="Logo SMK Taruna Bhakti" 
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" 
              />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-blue-200">
            <span>SMK Taruna Bhakti</span>
            <span>Depok</span>
          </div>
        </div>

        {/* Right Side: Clean Input Login Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="my-auto space-y-6">
            {/* Form Title Block */}
            <div className="text-left">
              <h3 className="text-2xl font-black text-slate-805 dark:text-white tracking-tight uppercase">
                Login Admin
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                Silakan masuk ke akun admin Anda untuk melanjutkan.
              </p>
            </div>

      

            {/* Error Alert Box */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* Form Inputs (Exactly 2 Fields) */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-550 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-650">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username admin"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-550">Password</label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-650">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-650 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Modern, High Contrast Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 text-white" />
                    <span>Memverifikasi Sesi...</span>
                  </>
                ) : (
                  <span>Login Admin</span>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Link href="/" className="inline-flex items-center gap-1.5">
              <ArrowLeft size={12} />
              Kembali ke Beranda PPDB
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
