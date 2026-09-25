import { useState, useEffect } from "react";
import { createEmptyRegistrationForm } from "../registrationFormReset";

export function useDaftarPageData(fetchPublicApplicants?: () => void) {
  const [wizardStep, setWizardStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);
  const [portalStatus, setPortalStatus] = useState("open");
  const [fieldsConfig, setFieldsConfig] = useState<Record<string, { label: string; required: boolean; active: boolean }>>({});
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState<any>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const [bankConfigList, setBankConfigList] = useState<Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>>([
    {
      bankName: "Bank Mandiri",
      accountNumber: "157-00-0174092-2",
      accountHolder: "Yayasan Taruna Bhakti"
    }
  ]);

  const [isDark, setIsDark] = useState(false);
  const [regCost, setRegCost] = useState(250000);
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [majors, setMajors] = useState([
    { code: "RPL", title: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", title: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", title: "Desain Komunikasi Visual" },
    { code: "ANM", title: "Animasi" },
    { code: "BC", title: "Broadcasting & Perfilman" },
    { code: "TE", title: "Teknik Elektronika" }
  ]);

  const [formData, setFormData] = useState<any>(() => createEmptyRegistrationForm("2026-2027"));

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const savedCost = localStorage.getItem('ppdb_reg_cost');
    if (savedCost) {
      const parsed = parseInt(savedCost);
      if (!isNaN(parsed)) setRegCost(parsed);
    }

    const savedPeriod = localStorage.getItem('ppdb_school_period');
    if (savedPeriod) {
      setSchoolPeriod(savedPeriod);
      setFormData((prev: any) => ({ ...prev, periode: savedPeriod }));
    }

    const savedWaGroup = localStorage.getItem('ppdb_wa_group_url');
    if (savedWaGroup) {
      setWaGroupUrl(savedWaGroup);
    }

    const savedPortalStatus = localStorage.getItem('ppdb_portal_status');
    if (savedPortalStatus) {
      setPortalStatus(savedPortalStatus);
    }

    const savedFieldsConfig = localStorage.getItem('ppdb_fields_config');
    if (savedFieldsConfig) {
      try {
        const parsed = JSON.parse(savedFieldsConfig);
        if (parsed && typeof parsed === 'object') {
          setFieldsConfig(parsed);
        }
      } catch (e) {}
    }

    const savedMajors = localStorage.getItem('ppdb_majors_config');
    if (savedMajors) {
      try {
        const parsed = JSON.parse(savedMajors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMajors(parsed);
        }
      } catch (e) {
        console.log("Failed to parse custom majors config:", e);
      }
    }

    const savedBank = localStorage.getItem('ppdb_bank_config');
    if (savedBank) {
      try {
        const parsed = JSON.parse(savedBank);
        if (Array.isArray(parsed)) {
          setBankConfigList(parsed);
        } else if (parsed && typeof parsed === 'object') {
          setBankConfigList([parsed]);
        }
      } catch (e) {
        console.log("Failed to parse custom bank config:", e);
      }
    }

    const loadLiveConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          try {
            if (config.ppdb_form_fee) {
              const parsed = parseInt(config.ppdb_form_fee);
              if (!isNaN(parsed)) {
                setRegCost(parsed);
                localStorage.setItem('ppdb_reg_cost', config.ppdb_form_fee);
              }
            }
            if (config.ppdb_school_period) {
              setSchoolPeriod(config.ppdb_school_period);
              setFormData((prev: any) => ({ ...prev, periode: config.ppdb_school_period }));
              localStorage.setItem('ppdb_school_period', config.ppdb_school_period);
            }
            if (config.ppdb_wa_group_url) {
              setWaGroupUrl(config.ppdb_wa_group_url);
              localStorage.setItem('ppdb_wa_group_url', config.ppdb_wa_group_url);
            }
            if (config.ppdb_portal_status) {
              setPortalStatus(config.ppdb_portal_status);
              localStorage.setItem('ppdb_portal_status', config.ppdb_portal_status);
            }
            if (config.ppdb_fields_config) {
              setFieldsConfig(config.ppdb_fields_config);
              localStorage.setItem('ppdb_fields_config', JSON.stringify(config.ppdb_fields_config));
            }
            if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config) && config.ppdb_majors_config.length > 0) {
              setMajors(config.ppdb_majors_config);
              localStorage.setItem('ppdb_majors_config', JSON.stringify(config.ppdb_majors_config));
            }
            if (config.ppdb_bank_config) {
              const bankData = config.ppdb_bank_config;
              let finalBanks = [];
              if (Array.isArray(bankData)) {
                finalBanks = bankData;
              } else if (bankData && typeof bankData === "object") {
                finalBanks = [bankData];
              }
              if (finalBanks.length > 0) {
                setBankConfigList(finalBanks);
                localStorage.setItem('ppdb_bank_config', JSON.stringify(finalBanks));
              }
            }
          } catch (storageErr) {
            console.warn("Storage quota exceeded or unavailable. LocalStorage config cache sync bypassed.", storageErr);
          }
        }
      } catch (err) {
        console.log("Failed to fetch live config on registration page, using local storage fallback:", err);
      }
    };
    loadLiveConfig();

    const loadKuota = async () => {
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
        const res = await fetch(`${BACKEND_URL}/api/kuota`);
        const json = await res.json();
        if (json.success && json.data) {
          setKuotaData(json.data.pendaftar);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
      }
    };
    loadKuota();

    if (typeof window !== "undefined") {
      const savedSuccess = localStorage.getItem('ppdb_registration_success');
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.success && parsed.nisn) {
            setFormData((prev: any) => ({ ...prev, nisn: parsed.nisn }));
            if (parsed.successData) {
              setSuccessData(parsed.successData);
            }
            setIsSuccess(true);
            return;
          }
        } catch (e) {
          console.log("Gagal memuat sesi sukses pendaftaran:", e);
        }
      }

      const savedCheckout = localStorage.getItem('ppdb_active_checkout');
      if (savedCheckout) {
        try {
          const parsed = JSON.parse(savedCheckout);
          if (parsed && parsed.nisn) {
            setSubmittedCandidate(parsed);
            setShowPaymentGate(true);
          }
        } catch (e) {
          console.log("Gagal memuat sesi checkout aktif dari localStorage:", e);
        }
      } else {
        const savedFormData = localStorage.getItem('ppdb_registration_form_data');
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            setFormData((prev: any) => ({ ...prev, ...parsed }));
          } catch (e) {
            console.log("Gagal memuat draf data pendaftaran dari localStorage:", e);
          }
        }
        const savedStep = localStorage.getItem('ppdb_registration_wizard_step');
        if (savedStep) {
          const parsed = parseInt(savedStep);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 14) {
            setWizardStep(parsed);
            setFurthestStep(parsed);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const nisn = params.get("nisn");
      if (payment === "success" && nisn) {
        const forceVerifyAndShowSuccess = async () => {
          try {
            const backendUrl = "http://localhost:5000";
            const res = await fetch(`${backendUrl}/api/payment/confirm-payment-option`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nisn: nisn,
                bukti_bayar: null,
                metode_pembayaran: "Payment Gateway"
              })
            });
            const data = await res.json();
            localStorage.removeItem('ppdb_active_checkout');
            if (data.success && data.data) {
              setSuccessData(data.data);
              localStorage.setItem('ppdb_registration_success', JSON.stringify({
                nisn: nisn,
                success: true,
                successData: data.data
              }));
            } else {
              localStorage.setItem('ppdb_registration_success', JSON.stringify({
                nisn: nisn,
                success: true
              }));
            }
            setFormData((prev: any) => ({ ...prev, nisn: nisn }));
            setIsSuccess(true);
            fetchPublicApplicants?.();
          } catch (err) {
            console.log("Error force verifying redirected payment status:", err);
          }
        };
        forceVerifyAndShowSuccess();
      }
    }
  }, [fetchPublicApplicants]);

  useEffect(() => {
    if (isSuccess) {
      const targetNisn = formData.nisn || (submittedCandidate && submittedCandidate.nisn);
      if (targetNisn) {
        const fetchSuccessData = async () => {
          try {
            const backendUrl = "http://localhost:5000";
            const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${targetNisn}`);
            const json = await res.json();
            if (json.success && json.data) {
              setSuccessData(json.data);
              localStorage.setItem('ppdb_registration_success', JSON.stringify({
                nisn: targetNisn,
                success: true,
                successData: json.data
              }));
            }
          } catch (err) {
            console.log("Failed to fetch success candidate details:", err);
          }
        };
        fetchSuccessData();
      }
    }
  }, [isSuccess, formData.nisn, submittedCandidate]);

  useEffect(() => {
    if (typeof window !== "undefined" && !showPaymentGate && !isSuccess) {
      const dataToSave = { ...formData };
      delete dataToSave.berkasFotoFile;
      delete dataToSave.berkasFotoBase64;
      localStorage.setItem('ppdb_registration_form_data', JSON.stringify(dataToSave));
    }
  }, [formData, showPaymentGate, isSuccess]);

  useEffect(() => {
    if (typeof window !== "undefined" && !showPaymentGate && !isSuccess) {
      localStorage.setItem('ppdb_registration_wizard_step', wizardStep.toString());
    }
  }, [wizardStep, showPaymentGate, isSuccess]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ppdb-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ppdb-theme', 'light');
    }
  };

  return {
    wizardStep,
    setWizardStep,
    furthestStep,
    setFurthestStep,
    isSuccess,
    setIsSuccess,
    kuotaData,
    portalStatus,
    fieldsConfig,
    showPaymentGate,
    setShowPaymentGate,
    submittedCandidate,
    setSubmittedCandidate,
    successData,
    setSuccessData,
    bankConfigList,
    isDark,
    toggleDark,
    regCost,
    waGroupUrl,
    schoolPeriod,
    majors,
    formData,
    setFormData,
  };
}
