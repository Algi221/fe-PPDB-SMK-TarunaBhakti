"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-hidden">
      
      {/* Left Section - Clean Bold Typography */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white relative z-10">
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-left-8 duration-700">
          <img 
            src="/logo_smktb.png" 
            alt="Logo SMK Taruna Bhakti" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain mb-8"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
            Portal Admin <br />
            <span className="text-blue-600">PPDB Online</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
            SMK Taruna Bhakti
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Sistem manajemen terpadu untuk mengelola proses pendaftaran, verifikasi, dan seleksi peserta didik baru.
          </p>
        </div>
      </div>

      {/* Right Section - Glassmorphism Card over Abstract Blobs */}
      <div className="w-full md:w-1/2 min-h-screen relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-slate-50/50">
        
        {/* Abstract Blurred Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-800 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
          <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
        </div>

        {/* The Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-[420px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Hello!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Khusus Admin PPDB SMK Taruna Bhakti!</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-5 py-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-500/70 dark:placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-5 pr-12 py-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-500/70 dark:placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Footer Back Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
