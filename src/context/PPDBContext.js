"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const PPDBContext = createContext(null);

const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
const WS_URL = typeof window !== 'undefined' ? `ws://${window.location.hostname}:5000/ws` : "ws://localhost:5000/ws";

export function PPDBProvider({ children }) {
  const [applicants, setApplicants] = useState([]);
  const [publicApplicants, setPublicApplicants] = useState([]);
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem("ppdb_admin_token") || null;
    return null;
  });
  const [adminUser, setAdminUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("ppdb_admin_user");
      try { return saved ? JSON.parse(saved) : null; } catch (_) { return null; }
    }
    return null;
  });
  const [wsStatus, setWsStatus] = useState("DISCONNECTED");
  const [toasts, setToasts] = useState([]);
  const [wsLogs, setWsLogs] = useState([]);
  const [simulationActive, setSimulationActive] = useState(false);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  // Stable ref so onclose can call connectWs without circular dependency
  const connectWsRef = useRef(null);

  // Play subtle chime sound for live updates
  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
    } catch (e) {
      console.log('AudioContext blocked or unsupported:', e.message);
    }
  }, []);

  // Add toast notification
  const addToast = useCallback((title, message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
    playNotificationSound();
  }, [playNotificationSound]);

  // Log WebSocket activity
  const addWsLog = useCallback((direction, event, payload) => {
    setWsLogs((prev) => [
      {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        direction,
        event,
        payload
      },
      ...prev.slice(0, 49)
    ]);
  }, []);

  // Fetch public applicants
  const fetchPublicApplicants = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/public`);
      const data = await res.json();
      if (data.success) setPublicApplicants(data.data);
    } catch (err) {
      console.warn("Public API fetch error, using local fallback seed:", err.message);
      const localSeed = [
        { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", sekolah_asal: "SMPN 1 Depok", jurusan_1: "Rekayasa Perangkat Lunak", status: "Approved", tgl_daftar: new Date().toISOString() },
        { id: 2, nama: "Putri Ayu Lestari", nisn: "0087654321", sekolah_asal: "SMPN 2 Depok", jurusan_1: "Desain Komunikasi Visual", status: "Pending", tgl_daftar: new Date().toISOString() }
      ];
      setPublicApplicants(localSeed);
    }
  }, []);

  // Fetch admin applicants (protected)
  const fetchAdminApplicants = useCallback(async () => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setApplicants(data.data);
    } catch (err) {
      console.warn("Admin API fetch error:", err.message);
    }
  }, [adminToken]);

  // Submit registration form
  const registerApplicant = useCallback(async (formData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchPublicApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("API registration error, adding to memory fallback:", err.message);
      const newId = Date.now();
      const mockSaved = {
        id: newId,
        nama: formData.nama || "Pendaftar Baru",
        nisn: formData.nisn || "0000000000",
        sekolah_asal: formData.sekolahAsal || "SMP Asal",
        jurusan_1: formData.jurusan1 || "PPLG",
        status: "Pending",
        tgl_daftar: new Date().toISOString()
      };
      setPublicApplicants(prev => [mockSaved, ...prev]);
      setApplicants(prev => [mockSaved, ...prev]);
      addToast("Pendaftaran Baru (Offline)", `Nama: ${mockSaved.nama} - Jurusan: ${mockSaved.jurusan_1}`, "success");
      return { success: true, data: mockSaved };
    }
  }, [fetchPublicApplicants, addToast]);

  // Admin: Approve
  const verifyApplicant = useCallback(async (id) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: "Approved" })
      });
      const data = await res.json();
      if (data.success) {
        addToast("Applicant Approved", `Pendaftar #${id} telah berhasil diverifikasi!`, "success");
        await fetchAdminApplicants();
        await fetchPublicApplicants();
      }
    } catch (err) {
      console.error("API status update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
      addToast("Applicant Approved (Offline)", `Pendaftar #${id} disetujui.`, "success");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, addToast]);

  // Admin: Reject
  const rejectApplicant = useCallback(async (id) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: "Rejected" })
      });
      const data = await res.json();
      if (data.success) {
        addToast("Applicant Rejected", `Calon siswa #${id} telah ditolak.`, "warning");
        await fetchAdminApplicants();
        await fetchPublicApplicants();
      }
    } catch (err) {
      console.error("API status update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
      setPublicApplicants(prev => prev.filter(a => a.id !== id));
      addToast("Applicant Rejected (Offline)", `Calon siswa #${id} ditolak.`, "warning");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, addToast]);

  // Admin: Delete
  const deleteApplicant = useCallback(async (id) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Applicant Deleted", `Data pendaftar #${id} telah dihapus permanen.`, "danger");
        await fetchAdminApplicants();
        await fetchPublicApplicants();
      }
    } catch (err) {
      console.error("API delete error:", err.message);
      setApplicants(prev => prev.filter(a => a.id !== id));
      setPublicApplicants(prev => prev.filter(a => a.id !== id));
      addToast("Applicant Deleted (Offline)", `Pendaftar #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, addToast]);

  // Admin: Update / Edit applicant data
  const updateApplicant = useCallback(async (id, updatedData) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return { success: false, message: "Tidak terautentikasi." };
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data pendaftar ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("API update error:", err.message);
      // Offline fallback: update in memory
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, addToast]);

  // Admin: Login
  const loginAdmin = useCallback(async (username, password) => {
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
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Auth API error:", err.message);
      if (username === "admin_tb" && password === "AdminTarunaBhakti2026") {
        const token = "mock_jwt_token_for_taruna_bhakti_dev_purposes";
        const admin = { username: "admin_tb", nama: "Administrator PPDB TB (Local)" };
        setAdminToken(token);
        setAdminUser(admin);
        localStorage.setItem("ppdb_admin_token", token);
        localStorage.setItem("ppdb_admin_user", JSON.stringify(admin));
        return { success: true };
      }
      return { success: false, message: "Koneksi ke backend gagal." };
    }
  }, []);

  // Admin: Logout
  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("ppdb_admin_token");
    localStorage.removeItem("ppdb_admin_user");
  }, []);

  // WebSocket Connection Logic
  const connectWs = useCallback(() => {
    if (wsRef.current) wsRef.current.close();

    console.log("Attempting to connect to Hono WebSocket channel...");
    setWsStatus("CONNECTING");
    addWsLog("SYSTEM", "CONNECTING", { url: WS_URL });

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Hono WebSocket connection established.");
      setWsStatus("CONNECTED");
      addWsLog("SYSTEM", "CONNECTED", { message: "Established connection successfully." });
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("WebSocket event received:", parsed);
        addWsLog("INCOMING", parsed.event, parsed.data);

        if (parsed.event === 'NEW_APPLICANT') {
          const newStudent = parsed.data;
          setPublicApplicants((prev) => {
            if (prev.some(a => a.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
          setApplicants((prev) => {
            if (prev.some(a => a.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
          addToast(
            "Pendaftaran Baru!",
            `Nama: ${newStudent.nama} · Asal: ${newStudent.sekolah_asal || newStudent.sekolahAsal} · Jurusan: ${newStudent.jurusan_1 || newStudent.jurusan1}`,
            "success"
          );
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Pendaftaran Baru!', {
              body: `Nama: ${newStudent.nama} (${newStudent.jurusan_1 || newStudent.jurusan1})`
            });
          }
        } else if (parsed.event === 'STATUS_UPDATE') {
          const update = parsed.data;
          setApplicants((prev) =>
            prev.map(a => a.id === update.id ? { ...a, status: update.status } : a)
          );
          if (update.status === 'Rejected') {
            setPublicApplicants((prev) => prev.filter(a => a.id !== update.id));
            addToast("Pendaftar Ditolak", `${update.nama} dikeluarkan dari daftar beranda.`, "warning");
          } else {
            setPublicApplicants((prev) =>
              prev.map(a => a.id === update.id ? { ...a, status: update.status } : a)
            );
            addToast("Pendaftar Disetujui", `${update.nama} telah terverifikasi!`, "success");
          }
        } else if (parsed.event === 'APPLICANT_DELETED') {
          const { id } = parsed.data;
          setApplicants((prev) => prev.filter(a => a.id !== id));
          setPublicApplicants((prev) => prev.filter(a => a.id !== id));
          addToast("Pendaftar Dihapus", `Data pendaftar #${id} dihapus dari sistem.`, "danger");
        } else if (parsed.event === 'REFRESH_INFORMASI') {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ws_refresh_informasi'));
          }
        }
      } catch (err) {
        console.warn("Failed to parse incoming WS message:", event.data, err);
      }
    };

    ws.onclose = () => {
      console.log("Hono WebSocket connection closed.");
      setWsStatus("DISCONNECTED");
      addWsLog("SYSTEM", "DISCONNECTED", { message: "Connection closed." });
      reconnectTimeoutRef.current = setTimeout(() => {
        // Use ref to avoid circular dependency
        if (connectWsRef.current) connectWsRef.current();
      }, 5000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket connection encountered an error:", err);
      setWsStatus("ERROR");
      addWsLog("SYSTEM", "ERROR", { message: "Encountered networking error." });
    };
  }, [addToast, addWsLog]);

  // Keep ref in sync with latest connectWs so onclose can call it
  connectWsRef.current = connectWs;

  // Simulate registration (for testing)
  const simulateRegistration = useCallback(async () => {
    const firstNames = ["Ahmad", "Dian", "Budi", "Siti", "Kevin", "Rina", "Fajar", "Ayu", "Giri", "Reza", "Lutfi", "Indah"];
    const lastNames = ["Saputra", "Pratama", "Lestari", "Maharani", "Wijaya", "Siddiq", "Santoso", "Hidayat", "Kusuma", "Utami"];
    const schools = ["SMPN 1 Depok", "SMPN 2 Depok", "SMPN 3 Depok", "SMP IT Al-Hikmah", "SMP Mardi Yuana", "MTsN 1 Depok", "SMP Budi Kharisma", "SMPN 4 Depok"];
    const majorsCodes = ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"];

    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomNama = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    const randomMajor = randomItem(majorsCodes);
    const randomMajorAlt = majorsCodes.find(m => m !== randomMajor);

    const mockCandidate = {
      nama: randomNama,
      nisn: "008" + Math.floor(1000000 + Math.random() * 9000000).toString(),
      nik: "3276" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      tempatLahir: "Depok",
      tglLahir: "2010-06-15",
      jenisKelamin: Math.random() > 0.5 ? "Laki-laki" : "Perempuan",
      agama: "Islam",
      alamat: "Jl. Pekapuran No. " + Math.floor(Math.random() * 100),
      rtRw: "03/05",
      kelurahan: "Curug",
      kecamatan: "Cimanggis",
      kodePos: "16453",
      whatsapp: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      email: randomNama.toLowerCase().replace(" ", "") + "@email.com",
      sekolahAsal: randomItem(schools),
      tglLulus: "2026-06-10",
      jurusan1: randomMajor,
      jurusan2: randomMajorAlt,
      teleponOrtu: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      janjiTaat: true,
      janjiSanksi: true,
      janjiAkrab: true,
      janjiBelajar: true,
      janjiNamaBaik: true
    };
    await registerApplicant(mockCandidate);
  }, [registerApplicant]);

  // Check candidate payment status by NISN
  const checkPaymentStatus = useCallback(async (nisn) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/check-payment/${nisn}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Check payment status failed:", err.message);
      return { success: false, message: err.message };
    }
  }, []);

  // Background simulation engine
  useEffect(() => {
    if (!simulationActive) return;
    const intervalId = setInterval(() => {
      simulateRegistration();
    }, 25000);
    return () => clearInterval(intervalId);
  }, [simulationActive, simulateRegistration]);

  // Bootstrap on mount: fetch public data & connect WS
  useEffect(() => {
    fetchPublicApplicants();
    connectWs();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When admin token is available, fetch protected admin data + request notification permission
  useEffect(() => {
    if (!adminToken) return;
    fetchAdminApplicants();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [adminToken, fetchAdminApplicants]);

  // Idle logout after 1 hour
  useEffect(() => {
    if (!adminToken) return;
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logoutAdmin();
        addToast("Sesi Berakhir", "Sesi Anda telah berakhir karena tidak ada aktivitas selama 1 jam.", "warning");
      }, 3600000);
    };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(ev => window.addEventListener(ev, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [adminToken, logoutAdmin, addToast]);

  return (
    <PPDBContext.Provider
      value={{
        applicants,
        publicApplicants,
        adminToken,
        adminUser,
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
        loginAdmin,
        logoutAdmin,
        fetchPublicApplicants,
        fetchAdminApplicants,
        simulateRegistration,
        addToast,
        checkPaymentStatus
      }}
    >
      {children}

      {/* Toast Alert Portal */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 w-full ${
              toast.type === "success"
                ? "bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : toast.type === "warning"
                ? "bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                : toast.type === "danger"
                ? "bg-rose-50/90 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                : "bg-blue-50/90 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-200/55 dark:bg-emerald-800/40"
                : toast.type === "warning"
                ? "bg-amber-200/55 dark:bg-amber-800/40"
                : toast.type === "danger"
                ? "bg-rose-200/55 dark:bg-rose-800/40"
                : "bg-blue-200/55 dark:bg-blue-800/40"
            }`}>
              {toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠" : toast.type === "danger" ? "✕" : "ℹ"}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-0.5">{toast.title}</h4>
              <p className="text-xs font-medium leading-relaxed opacity-90">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
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
