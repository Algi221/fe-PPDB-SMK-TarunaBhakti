"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";

export default function AdminLogin() {
  const { loginAdmin, adminToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // GSAP Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const formElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const floatingShapesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    if (adminToken) {
      router.push("/dashboard");
    }
  }, [adminToken, router]);

  // Entrance Animations
  useEffect(() => {
    if (!mounted) return;
    
    const ctx = gsap.context(() => {
      // Animate Left Panel Content
      gsap.fromTo(
        ".brand-element",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );

      // Floating Shapes Animation (Subtle continuous movement)
      floatingShapesRef.current.forEach((shape, i) => {
        if (!shape) return;
        gsap.to(shape, {
          y: i % 2 === 0 ? -15 : 15,
          x: i % 3 === 0 ? 10 : -10,
          rotation: i % 2 === 0 ? 5 : -5,
          duration: 4 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Animate Right Panel Form Elements
      gsap.fromTo(
        formElementsRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // Mouse Parallax Effect for Left Panel
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!leftPanelRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPos = (clientX / innerWidth - 0.5) * 30;
    const yPos = (clientY / innerHeight - 0.5) * 30;

    floatingShapesRef.current.forEach((shape, i) => {
      if (!shape) return;
      const depth = (i + 1) * 0.5;
      gsap.to(shape, {
        x: xPos * depth,
        y: yPos * depth,
        duration: 1,
        ease: "power2.out"
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        // Success exit animation
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.98,
          duration: 0.4,
          onComplete: () => router.push("/dashboard")
        });
      } else {
        setError(res.message || "Username atau Password salah.");
        // Error shake animation
        gsap.fromTo(
          ".login-form",
          { x: -8 },
          { x: 8, duration: 0.08, yoyo: true, repeat: 5, ease: "linear", onComplete: () => gsap.set(".login-form", { x: 0 }) }
        );
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans selection:bg-blue-500/30">
      
      {/* Left Section - Branding (Professional, Dark, Clean) */}
      <div 
        ref={leftPanelRef}
        onMouseMove={handleMouseMove}
        className="relative w-full lg:w-[45%] xl:w-[50%] bg-slate-900 overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16"
      >
        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Interactive Geometric Shapes */}
        <div ref={el => { floatingShapesRef.current[0] = el; }} className="absolute top-[15%] left-[10%] w-64 h-64 border border-white/5 rounded-full"></div>
        <div ref={el => { floatingShapesRef.current[1] = el; }} className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-2xl"></div>
        <div ref={el => { floatingShapesRef.current[2] = el; }} className="absolute top-[45%] right-[20%] w-24 h-24 border border-blue-500/20 rounded-xl rotate-12 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 pt-10 lg:pt-20">
          <img 
            src="/logo_smktb.png" 
            alt="Logo SMK Taruna Bhakti" 
            className="brand-element w-16 h-16 md:w-20 md:h-20 object-contain mb-8 filter drop-shadow-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="brand-element text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-5">
            Portal Admin <br />
            <span className="text-blue-400">SMK Taruna Bhakti</span>
          </h1>
          <p className="brand-element text-slate-400 text-lg max-w-md leading-relaxed">
            Sistem Informasi Manajemen Penerimaan Peserta Didik Baru (PPDB) yang terintegrasi, cepat, dan aman.
          </p>
        </div>

        <div className="relative z-10 brand-element mt-16 lg:mt-0 pb-10">
          <div className="flex items-center gap-2.5 text-slate-400 text-sm font-medium">
            <ShieldCheck size={18} className="text-blue-400" />
            <span>Secure Access Gateway</span>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-[55%] xl:w-[50%] min-h-[60vh] lg:min-h-screen flex items-center justify-center p-6 md:p-12 bg-slate-50 dark:bg-[#0B1120]">
        <div className="w-full max-w-[420px]">
          
          <div ref={el => { formElementsRef.current[0] = el; }} className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Silakan masukkan kredensial Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Username Input */}
            <div ref={el => { formElementsRef.current[1] = el; }} className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div ref={el => { formElementsRef.current[2] = el; }} className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div ref={el => { formElementsRef.current[3] = el; }} className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-sm shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard</span>
                )}
              </button>
            </div>
          </form>

          <div ref={el => { formElementsRef.current[4] = el; }} className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
