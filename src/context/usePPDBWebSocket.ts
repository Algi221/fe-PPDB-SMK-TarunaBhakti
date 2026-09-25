"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { WsLog } from "./ppdbTypes";

interface UsePPDBWebSocketProps {
  adminToken: string | null;
  WS_URL: string;
  setPublicApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  setApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  addToast: (title: string, message: string, type?: string) => void;
}

export function usePPDBWebSocket({
  adminToken,
  WS_URL,
  setPublicApplicants,
  setApplicants,
  addToast,
}: UsePPDBWebSocketProps) {
  const [wsStatus, setWsStatus] = useState<string>("DISCONNECTED");
  const [wsLogs, setWsLogs] = useState<WsLog[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const connectWsRef = useRef<(() => void) | null>(null);
  const adminTokenRef = useRef<string | null>(adminToken);

  useEffect(() => {
    adminTokenRef.current = adminToken;
  }, [adminToken]);

  const addWsLog = useCallback((direction: string, event: string, payload: any) => {
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

  const connectWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    setWsStatus("CONNECTING");
    
    const currentToken = adminTokenRef.current;
    const wsUrlWithToken = currentToken ? `${WS_URL}?token=${currentToken}` : WS_URL;
    addWsLog("SYSTEM", "CONNECTING", { url: wsUrlWithToken });

    const ws = new WebSocket(wsUrlWithToken);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("CONNECTED");
      addWsLog("SYSTEM", "CONNECTED", { message: "Established connection successfully." });
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        addWsLog("INCOMING", parsed.event, parsed.data);

        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');

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
          if (isAdminPath) {
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
          }
        } else if (parsed.event === 'NEW_APPLICANT_PUBLIC') {
          const newStudent = parsed.data;
          setPublicApplicants((prev) => {
            if (prev.some(a => a.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
        } else if (parsed.event === 'STATUS_UPDATE') {
          const update = parsed.data;
          setApplicants((prev) =>
            prev.map(a => a.id === update.id ? { ...a, status: update.status, alasan_ditolak: update.alasan_ditolak } : a)
          );
          setPublicApplicants((prev) =>
            prev.map(a => a.id === update.id ? { ...a, status: update.status, alasan_ditolak: update.alasan_ditolak } : a)
          );
          if (isAdminPath) {
            if (update.status === 'Rejected') {
              addToast("Pendaftar Ditolak", `${update.nama} ditolak.`, "warning");
            } else {
              addToast("Pendaftar Disetujui", `${update.nama} telah terverifikasi!`, "success");
            }
          }
        } else if (parsed.event === 'APPLICANT_DELETED') {
          const { id } = parsed.data;
          setApplicants((prev) => prev.filter(a => a.id !== id));
          setPublicApplicants((prev) => prev.filter(a => a.id !== id));
          if (isAdminPath) {
            addToast("Pendaftar Dihapus", `Data pendaftar #${id} dihapus dari sistem.`, "danger");
          }
        } else if (parsed.event === 'APPLICANT_UPDATED') {
          const updatedStudent = parsed.data;
          setApplicants((prev) =>
            prev.map(a => a.id === updatedStudent.id ? { ...a, ...updatedStudent } : a)
          );
          setPublicApplicants((prev) =>
            prev.map(a => a.id === updatedStudent.id ? { ...a, ...updatedStudent } : a)
          );
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
      setWsStatus("DISCONNECTED");
      addWsLog("SYSTEM", "DISCONNECTED", { message: "Connection closed." });
      reconnectTimeoutRef.current = setTimeout(() => {
        if (connectWsRef.current) connectWsRef.current();
      }, 5000);
    };

    ws.onerror = () => {
      setWsStatus("ERROR");
      addWsLog("SYSTEM", "ERROR", { message: "Encountered networking error." });
    };
  }, [addToast, addWsLog, setApplicants, setPublicApplicants, WS_URL]);

  useEffect(() => {
    connectWsRef.current = connectWs;
  }, [connectWs]);

  useEffect(() => {
    connectWs();
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [adminToken, connectWs]);

  return {
    wsStatus,
    wsLogs,
    addWsLog,
    connectWs,
  };
}
