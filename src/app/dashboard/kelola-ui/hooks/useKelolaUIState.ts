"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import {
  AlurItem,
  MajorItem,
  RevisionLog,
  FaqItem,
  PartnerItem,
  BankConfigItem,
  FieldConfigItem,
  DEFAULT_PARTNERS,
  DEFAULT_ALUR,
  DEFAULT_MAJORS,
  DEFAULT_FIELDS_CONFIG_UI
} from "../types";
import {
  createEmptyMajor,
  formatDate,
  handleDragStateHelper,
  processMediaFileHelper,
  handleSchoolLogoChangeHelper,
  alurHelpers,
  faqHelpers
} from "./kelolaUIHandlers";
import {
  fetchCurrentConfigService,
  fetchRevisionsService,
  saveAllConfigsService,
  restoreRevisionService
} from "./kelolaUIApi";
import {
  buildSaveConfigPayload,
  buildDraftObject,
  applyActiveConfigToState,
  KelolaUIStateValues
} from "./kelolaUIConfigMapper";

export function useKelolaUIState() {
  const { adminToken } = usePPDB();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "majors" | "alur" | "form" | "faq" | "revisions" | "bank" | "partners">("hero");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["hero", "majors", "alur", "form", "faq", "revisions", "bank", "partners"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const [fieldsConfigUI, setFieldsConfigUI] = useState<Record<string, FieldConfigItem>>(DEFAULT_FIELDS_CONFIG_UI);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");

  const [heroTitle, setHeroTitle] = useState("Penerimaan Siswa Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("Portal PPDB SMK Taruna Bhakti");
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi.");
  const [phone, setPhone] = useState("(021) 8740756");
  const [email, setEmail] = useState("info@smktarunabhakti.sch.id");
  const [address, setAddress] = useState("Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
  const [mapTitle, setMapTitle] = useState("Kunjungi Kampus SMK Taruna Bhakti");
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [waAdmin, setWaAdmin] = useState("6281292244456");
  const [formGuideline, setFormGuideline] = useState("Silakan isi formulir pendaftaran calon siswa dengan lengkap dan benar. Berkas persyaratan wajib diunggah dalam format gambar (PNG/JPG) maksimal 2MB.");
  const [formFee, setFormFee] = useState("250000");
  const [schoolLogo, setSchoolLogo] = useState("/logo_smktb.png");
  const [schoolTitle, setSchoolTitle] = useState("PPDB SMK TB");

  const [gelombangConfig, setGelombangConfig] = useState({
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  });
  const [g1Error, setG1Error] = useState<string | null>(null);
  const [g2Error, setG2Error] = useState<string | null>(null);

  const [bankConfigList, setBankConfigList] = useState<BankConfigItem[]>([
    {
      bankName: "Bank Mandiri",
      accountNumber: "157-00-0174092-2",
      accountHolder: "Yayasan Taruna Bhakti"
    }
  ]);

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [majorsList, setMajorsList] = useState<MajorItem[]>(DEFAULT_MAJORS);
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [revisions, setRevisions] = useState<RevisionLog[]>([]);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState("Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru SMK Taruna Bhakti.");
  const [faqList, setFaqList] = useState<FaqItem[]>([]);

  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [isNewMajor, setIsNewMajor] = useState(false);
  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});

  const emptyMajor = createEmptyMajor;

  const currentValues: KelolaUIStateValues = {
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    phone,
    email,
    address,
    mapTitle,
    mapUrl,
    schoolPeriod,
    waGroupUrl,
    waAdmin,
    formGuideline,
    formFee,
    schoolLogo,
    schoolTitle,
    gelombangConfig,
    bankConfigList,
    alurList,
    majorsList,
    partnersList,
    faqList,
    fieldsConfigUI
  };

  useEffect(() => {
    setMounted(true);
    fetchCurrentConfig();
    fetchRevisions();
  }, []);

  // Auto-save unsaved draft to localStorage
  useEffect(() => {
    if (!mounted || loading) return;
    const draft = buildDraftObject(currentValues);
    localStorage.setItem("ppdb_ui_editor_draft", JSON.stringify(draft));
  }, [
    mounted,
    loading,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    phone,
    email,
    address,
    mapTitle,
    mapUrl,
    schoolPeriod,
    waGroupUrl,
    waAdmin,
    formGuideline,
    formFee,
    gelombangConfig,
    bankConfigList,
    alurList,
    majorsList,
    faqList,
    partnersList,
    schoolLogo,
    schoolTitle
  ]);

  const showToastMsg = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  async function fetchCurrentConfig() {
    try {
      setLoading(true);
      const { activeConfig, hasDraft } = await fetchCurrentConfigService();

      applyActiveConfigToState(activeConfig, {
        setHeroTitle,
        setHeroTitleSub,
        setHeroSubtitle,
        setPhone,
        setEmail,
        setAddress,
        setMapTitle,
        setMapUrl,
        setSchoolPeriod,
        setFaqTitle,
        setFaqSubtitle,
        setWaGroupUrl,
        setWaAdmin,
        setFormGuideline,
        setFormFee,
        setSchoolLogo,
        setSchoolTitle,
        setAlurList,
        setFaqList,
        setPartnersList,
        setMajorsList,
        setGelombangConfig,
        setBankConfigList,
        setFieldsConfigUI
      });

      if (hasDraft) {
        showToastMsg("Draf perubahan berhasil dipulihkan dari sesi sebelumnya.", "info");
      }
    } catch (e) {
      console.error("Gagal mengambil konfigurasi UI:", e);
      showToastMsg("Koneksi gagal, memuat konfigurasi cadangan.", "info");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRevisions() {
    try {
      const data = await fetchRevisionsService(adminToken);
      setRevisions(data);
    } catch (e) {
      console.error("Gagal mengambil riwayat perubahan:", e);
    }
  }

  const handleDragState = (e: React.DragEvent, elementId: string, active: boolean) => {
    handleDragStateHelper(e, elementId, active, setDragActiveStates);
  };

  const processMediaFile = (file: File, type: "logo" | "banner" | "video" | "gallery-0" | "gallery-1" | "gallery-2" | "gallery-3") => {
    processMediaFileHelper(file, type, editingMajor, setEditingMajor, showToastMsg);
  };

  const handleSchoolLogoChange = (file: File) => {
    handleSchoolLogoChangeHelper(file, setSchoolLogo, showToastMsg);
  };

  const handleAddAlur = () => alurHelpers.add(alurList, setAlurList);
  const handleUpdateAlur = (id: number, key: keyof AlurItem, val: string | number) => alurHelpers.update(alurList, setAlurList, id, key, val);
  const handleRemoveAlur = (id: number) => alurHelpers.remove(alurList, setAlurList, id);
  const handleMoveAlur = (index: number, direction: "up" | "down") => alurHelpers.move(alurList, setAlurList, index, direction);

  const handleAddFaq = () => faqHelpers.add(faqList, setFaqList);
  const handleUpdateFaq = (index: number, key: keyof FaqItem, val: string) => faqHelpers.update(faqList, setFaqList, index, key, val);
  const handleRemoveFaq = (index: number) => faqHelpers.remove(faqList, setFaqList, index);
  const handleMoveFaq = (index: number, direction: "up" | "down") => faqHelpers.move(faqList, setFaqList, index, direction);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDescription.trim()) {
      showToastMsg("Deskripsi catatan wajib diisi.", "error");
      return;
    }

    try {
      setSaving(true);
      setShowConfirmModal(false);

      let finalMajors = [...majorsList];
      if (editingMajor) {
        finalMajors = finalMajors.map(m => m.code === editingMajor.code ? editingMajor : m);
        setMajorsList(finalMajors);
        setEditingMajor(null);
      }

      const configsPayload = buildSaveConfigPayload(currentValues, finalMajors);
      const json = await saveAllConfigsService(configsPayload, changeDescription, adminToken);

      if (json.success) {
        showToastMsg("Semua konfigurasi antarmuka dan riwayat berhasil disimpan!");
        setChangeDescription("");
        localStorage.removeItem("ppdb_ui_editor_draft");
        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal menyimpan perubahan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal menghubungi server backend.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (revId: number) => {
    if (!confirm(`Apakah Anda yakin ingin memulihkan semua konfigurasi UI ke versi riwayat #${revId}?`)) {
      return;
    }

    try {
      setSaving(true);
      const json = await restoreRevisionService(revId, adminToken);
      if (json.success) {
        showToastMsg(`Sukses memulihkan tampilan ke versi #${revId}!`);
        localStorage.removeItem("ppdb_ui_editor_draft");
        await fetchCurrentConfig();
        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal melakukan pemulihan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal menghubungi server.", "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    mounted,
    activeTab,
    setActiveTab,
    router,
    loading,
    saving,
    toast,
    showConfirmModal,
    setShowConfirmModal,
    changeDescription,
    setChangeDescription,
    heroTitle,
    setHeroTitle,
    heroTitleSub,
    setHeroTitleSub,
    heroSubtitle,
    setHeroSubtitle,
    phone,
    setPhone,
    email,
    setEmail,
    address,
    setAddress,
    mapTitle,
    setMapTitle,
    mapUrl,
    setMapUrl,
    schoolPeriod,
    setSchoolPeriod,
    waGroupUrl,
    setWaGroupUrl,
    waAdmin,
    setWaAdmin,
    formGuideline,
    setFormGuideline,
    formFee,
    setFormFee,
    schoolLogo,
    setSchoolLogo,
    schoolTitle,
    setSchoolTitle,
    gelombangConfig,
    setGelombangConfig,
    g1Error,
    setG1Error,
    g2Error,
    setG2Error,
    bankConfigList,
    setBankConfigList,
    alurList,
    majorsList,
    setMajorsList,
    partnersList,
    setPartnersList,
    revisions,
    faqList,
    editingMajor,
    setEditingMajor,
    isNewMajor,
    setIsNewMajor,
    dragActiveStates,
    setDragActiveStates,
    fieldsConfigUI,
    setFieldsConfigUI,
    emptyMajor,
    showToastMsg,
    fetchCurrentConfig,
    handleDragState,
    processMediaFile,
    handleSchoolLogoChange,
    handleAddAlur,
    handleUpdateAlur,
    handleRemoveAlur,
    handleMoveAlur,
    handleAddFaq,
    handleUpdateFaq,
    handleRemoveFaq,
    handleMoveFaq,
    handleSaveAll,
    handleRestore,
    formatDate,
  };
}
