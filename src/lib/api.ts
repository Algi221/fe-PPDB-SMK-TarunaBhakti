/**
 * Centralized API & Backend URL helper for PPDB SMK Taruna Bhakti
 * Supports dynamic production environment variables and protocol handling.
 */

declare const process: {
  env?: Record<string, string | undefined>;
};

export function getBackendUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "");
  }
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000`;
  }
  return "http://localhost:5000";
}

export function getWsUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  if (typeof window !== "undefined") {
    const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const hostname = window.location.hostname;
    return `${wsProto}//${hostname}:5000/ws`;
  }
  return "ws://localhost:5000/ws";
}
