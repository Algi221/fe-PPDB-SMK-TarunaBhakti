"use client";

import React, { useState, useEffect } from "react";
import {
  Applicant,
  SyncStatus,
  BSTNode,
  bstInsert,
  bstSearch,
  buildKey,
} from "../types";

export const MAJORS_LIST = [
  "Rekayasa Perangkat Lunak",
  "Teknik Jaringan Komputer & Telekomunikasi",
  "Desain Komunikasi Visual",
  "Broadcasting & Perfilman",
  "Teknik Elektronika",
  "Animasi",
];

export function useApplicantDirectory(applicants: Applicant[], activePageTab: "active" | "transfer" | "trash" | "kuota") {
  const [searchTerm, setSearchTerm] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [gelombangFilter, setGelombangFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [rejectingApplicantId, setRejectingApplicantId] = useState<number | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>("");
  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);

  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("IDLE");
  const [syncProgress, setSyncProgress] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const handleViewDetail = async (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/applicants/${applicant.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedApplicant(data.data);
      }
    } catch (err) {
      console.warn("Failed to lazy load applicant detail:", err);
    }
  };

  const bstRoot = React.useMemo(() => {
    let root: BSTNode | null = null;
    applicants.forEach((a: Applicant) => {
      root = bstInsert(root, { key: buildKey(a), id: a.id, left: null, right: null });
    });
    return root;
  }, [applicants]);

  const bstMatchedIds = React.useMemo(() => {
    const q = searchTerm === "ALL" ? "" : searchTerm.trim().toLowerCase();
    if (!q) return null;
    const ids: number[] = [];
    bstSearch(bstRoot, q, ids);
    return new Set(ids);
  }, [bstRoot, searchTerm]);

  const filteredApplicants = applicants.filter((a: Applicant) => {
    const isTransfer = a.diterima_kelas && (a.diterima_kelas.includes("XI") || a.diterima_kelas.includes("XII"));
    if (activePageTab === "active" && isTransfer) return false;
    if (activePageTab === "transfer" && !isTransfer) return false;

    const matchesSearch = bstMatchedIds === null || bstMatchedIds.has(a.id);

    const matchesStatus =
      statusFilter === "ALL" ||
      a.status === statusFilter ||
      (statusFilter === "Pending" && (!a.status || a.status === "Pending"));

    const matchesMajor =
      majorFilter === "ALL" ||
      a.jurusan_1 === majorFilter ||
      a.jurusan1 === majorFilter;

    const matchesGelombang =
      gelombangFilter === "ALL" ||
      (a.gelombang || "Gelombang 1") === gelombangFilter;

    const matchesGender =
      genderFilter === "ALL" ||
      (genderFilter === "L" && (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")) ||
      (genderFilter === "P" && (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p"));

    return matchesSearch && matchesStatus && matchesMajor && matchesGelombang && matchesGender;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, majorFilter, gelombangFilter, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / itemsPerPage));
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (syncStatus === "SYNCING") {
      interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSyncStatus("SUCCESS");
            setTimeout(() => setSyncStatus("IDLE"), 4000);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [syncStatus]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    majorFilter,
    setMajorFilter,
    gelombangFilter,
    setGelombangFilter,
    genderFilter,
    setGenderFilter,
    selectedApplicant,
    setSelectedApplicant,
    rejectingApplicantId,
    setRejectingApplicantId,
    rejectionReasonInput,
    setRejectionReasonInput,
    editApplicant,
    setEditApplicant,
    isSpreadsheetMode,
    setIsSpreadsheetMode,
    syncStatus,
    setSyncStatus,
    syncProgress,
    setSyncProgress,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredApplicants,
    paginatedApplicants,
    itemsPerPage,
    handleViewDetail,
    majorsList: MAJORS_LIST
  };
}
