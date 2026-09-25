"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Toast, PPDBContextType } from "./ppdbTypes";
import ToastPortal from "./ToastPortal";
import { useApplicantActions } from "./useApplicantActions";
import { usePPDBWebSocket } from "./usePPDBWebSocket";

const PPDBContext = createContext<PPDBContextType | null>(null);

const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
const WS_URL = typeof window !== 'undefined' ? `ws://${window.location.hostname}:5000/ws` : "ws://localhost:5000/ws";

export function PPDBProvider({ children }: { children: React.ReactNode }) {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [publicApplicants, setPublicApplicants] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("ppdb_admin_token");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > 60 * 60 * 1000) { // 1 hour
          localStorage.removeItem("ppdb_admin_token");
          localStorage.removeItem("ppdb_admin_user");
          localStorage.removeItem("ppdb_admin_last_active");
          return null;
        }
      }
      return token || null;
    }
    return null;
  });
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("ppdb_admin_user");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (saved && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > 60 * 60 * 1000) {
          return null;
        }
      }
      try { return saved ? JSON.parse(saved) : null; } catch (_) { return null; }
    }
    return null;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [ppdbLogo, setPpdbLogo] = useState<string>("/logo_smktb.png");
  const [ppdbTitle, setPpdbTitle] = useState<string>("PPDB SMK TB");

  const fetchConfigs = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/config`);
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.ppdb_logo_url) {
          setPpdbLogo(data.data.ppdb_logo_url);
        }
        if (data.data.ppdb_title) {
          setPpdbTitle(data.data.ppdb_title);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil config:", err);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
      osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc1.start(); osc2.start();
      osc1.stop(audioCtx.currentTime + 0.5);
      osc2.stop(audioCtx.currentTime + 0.5);
    } catch (e: any) {
      console.log('AudioContext blocked or unsupported:', e.message);
    }
  }, []);

  const addToast = useCallback((title: string, message: string, type = "info") => {
    setToasts((prev) => {
      const getStudentKey = (msg: string) => {
        const idMatch = msg.match(/#\d+/);
        if (idMatch) return idMatch[0];
        
        const nameLabelMatch = msg.match(/Nama:\s*([^·\n]+)/);
        if (nameLabelMatch) return nameLabelMatch[1].trim().toLowerCase();

        const capWordMatch = msg.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/);
        if (capWordMatch) return capWordMatch[0].trim().toLowerCase();
        
        return null;
      };

      const newKey = getStudentKey(message);
      
      const filtered = prev.filter((t) => {
        if (t.message === message) return false;
        
        if (newKey) {
          const oldKey = getStudentKey(t.message);
          if (oldKey && oldKey === newKey) return false;
        }
        
        return true;
      });

      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      setTimeout(() => {
        setToasts((curr) => curr.filter((t) => t.id !== id));
      }, 5000);

      return [...filtered, { id, title, message, type }];
    });
    playNotificationSound();
  }, [playNotificationSound]);

  const { wsStatus, wsLogs } = usePPDBWebSocket({
    adminToken,
    WS_URL,
    setPublicApplicants,
    setApplicants,
    addToast,
  });

  const fetchPublicApplicants = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/public`);
      const data = await res.json();
      if (data.success) setPublicApplicants(data.data);
    } catch (err: any) {
      console.warn("Public API fetch error, using local fallback seed:", err.message);
      const localSeed = [
        { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", sekolah_asal: "SMPN 1 Depok", jurusan_1: "Rekayasa Perangkat Lunak", status: "Approved", tgl_daftar: new Date().toISOString() },
        { id: 2, nama: "Putri Ayu Lestari", nisn: "0087654321", sekolah_asal: "SMPN 2 Depok", jurusan_1: "Desain Komunikasi Visual", status: "Pending", tgl_daftar: new Date().toISOString() }
      ];
      setPublicApplicants(localSeed);
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("ppdb_admin_token");
    localStorage.removeItem("ppdb_admin_user");
    localStorage.removeItem("ppdb_admin_last_active");
  }, []);

  const fetchAdminApplicants = useCallback(async () => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401) {
        console.warn("Token is invalid or expired. Logging out admin.");
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success) setApplicants(data.data);
    } catch (err: any) {
      console.warn("Admin API fetch error:", err.message);
    }
  }, [adminToken, logoutAdmin]);

  const fetchActiveStudents = useCallback(async () => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401) {
        console.warn("Token is invalid or expired. Logging out admin.");
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success) {
        const approved = data.data.filter((a: any) => a.status === 'Approved');
        setActiveStudents(approved);
      }
    } catch (err: any) {
      console.warn("Active students API fetch error:", err.message);
    }
  }, [adminToken, logoutAdmin]);

  const loginAdmin = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem("ppdb_admin_token", data.token);
        localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      console.error("Auth API error:", err.message);
      return { success: false, message: "Koneksi ke server backend gagal." };
    }
  }, []);

  // Hook for API mutation actions
  const {
    registerApplicant,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    updateApplicant,
    updateActiveStudent,
    deleteActiveStudent,
    checkPaymentStatus,
    simulateRegistration
  } = useApplicantActions({
    adminToken,
    wsStatus,
    setApplicants,
    setPublicApplicants,
    setActiveStudents,
    addToast,
    fetchPublicApplicants,
    fetchAdminApplicants,
    fetchActiveStudents,
    BACKEND_URL
  });

  useEffect(() => {
    if (!simulationActive) return;
    const intervalId = setInterval(() => {
      simulateRegistration();
    }, 25000);
    return () => clearInterval(intervalId);
  }, [simulationActive, simulateRegistration]);

  useEffect(() => {
    fetchPublicApplicants();
  }, [fetchPublicApplicants]);

  useEffect(() => {
    if (!adminToken) return;

    fetchAdminApplicants();
    fetchActiveStudents();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [adminToken, fetchAdminApplicants, fetchActiveStudents]);

  return (
    <PPDBContext.Provider
      value={{
        applicants,
        publicApplicants,
        activeStudents,
        adminToken,
        adminUser,
        setAdminUser,
        wsStatus,
        toasts,
        wsLogs,
        simulationActive,
        setSimulationActive,
        registerApplicant,
        verifyApplicant,
        rejectApplicant,
        deleteApplicant,
        updateApplicant,
        updateActiveStudent,
        deleteActiveStudent,
        loginAdmin,
        logoutAdmin,
        fetchPublicApplicants,
        fetchAdminApplicants,
        fetchActiveStudents,
        simulateRegistration,
        addToast,
        checkPaymentStatus,
        ppdbLogo,
        ppdbTitle,
        fetchConfigs
      }}
    >
      {children}
      <ToastPortal toasts={toasts} setToasts={setToasts} />
    </PPDBContext.Provider>
  );
}

export function usePPDB() {
  const context = useContext(PPDBContext);
  if (!context) {
    throw new Error("usePPDB must be used within a PPDBProvider");
  }
  return context;
}
