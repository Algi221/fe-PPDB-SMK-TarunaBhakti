import { useState } from "react";
import Swal from "sweetalert2";
import { validateStep, validateAllRequired } from "../daftarValidation";

interface UseDaftarWizardProps {
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  furthestStep: number;
  setFurthestStep: React.Dispatch<React.SetStateAction<number>>;
  formData: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  fieldsConfig: Record<string, any>;
  majors: Array<{ code: string; title: string }>;
  schoolPeriod: string;
  registerApplicant: (data: any) => Promise<any>;
  setSubmittedCandidate: React.Dispatch<React.SetStateAction<any>>;
  setShowPaymentGate: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useDaftarWizard({
  wizardStep,
  setWizardStep,
  furthestStep,
  setFurthestStep,
  formData,
  fieldsConfig,
  majors,
  schoolPeriod,
  registerApplicant,
  setSubmittedCandidate,
  setShowPaymentGate,
}: UseDaftarWizardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= furthestStep) {
      setWizardStep(step);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Tahap Terkunci',
        text: 'Anda belum bisa langsung melompat ke tahap ini. Silakan isi data di form saat ini dan klik "Selanjutnya" untuk membuka tahap berikutnya.',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'MENGERTI',
        customClass: {
          popup: 'rounded-4xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6',
          confirmButton: 'rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider',
          title: 'text-base font-black text-slate-850 dark:text-white uppercase'
        }
      });
    }
  };

  const nextStep = async () => {
    const stepErrors = validateStep(wizardStep, formData, fieldsConfig);
    if (stepErrors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        html: `<div class="text-left font-medium text-xs text-slate-600 dark:text-slate-400">Mohon lengkapi data wajib berikut sebelum melanjutkan ke tahap berikutnya:</div>
               <ul class="text-left list-disc list-inside mt-2 text-xs font-bold text-red-500 space-y-1">
                 ${stepErrors.map(err => `<li>${err}</li>`).join('')}
               </ul>`,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'OKE, SAYA LENGKAPI',
        customClass: {
          popup: 'rounded-4xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6',
          confirmButton: 'rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider',
          title: 'text-base font-black text-slate-850 dark:text-white uppercase'
        }
      });
      return;
    }

    if (wizardStep < 14) {
      setWizardStep(prev => {
        const next = prev + 1;
        if (next > furthestStep) {
          setFurthestStep(next);
        }
        return next;
      });
    } else {
      setIsSubmitting(true);
      
      const finalData = { ...formData };

      // Validate all required and active fields configured by admin
      const requiredErrors = validateAllRequired(finalData, fieldsConfig);

      if (requiredErrors.length > 0) {
        alert(`Harap lengkapi kolom wajib berikut:\n- ${requiredErrors.slice(0, 10).join("\n- ")}${requiredErrors.length > 10 ? `\n...dan ${requiredErrors.length - 10} kolom lainnya` : ""}`);
        setIsSubmitting(false);
        return;
      }

      // Safe fallbacks to keep PostgreSQL NOT NULL database columns happy
      if (!finalData.nama || finalData.nama.trim() === "") finalData.nama = "Calon Siswa";
      if (!finalData.nisn || finalData.nisn.trim() === "") finalData.nisn = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      if (!finalData.nik || finalData.nik.trim() === "") finalData.nik = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      if (!finalData.tempatLahir || finalData.tempatLahir.trim() === "") finalData.tempatLahir = "-";
      if (!finalData.tglLahir || finalData.tglLahir.trim() === "") finalData.tglLahir = "2010-01-01";
      if (!finalData.jenisKelamin) finalData.jenisKelamin = "L";
      if (!finalData.agama) finalData.agama = "Islam";
      if (!finalData.kewarganegaraan) finalData.kewarganegaraan = "WNI";
      if (!finalData.alamat || finalData.alamat.trim() === "") finalData.alamat = "-";
      if (!finalData.rtRw || finalData.rtRw.trim() === "") finalData.rtRw = "01/01";
      if (!finalData.kelurahan || finalData.kelurahan.trim() === "") finalData.kelurahan = "-";
      if (!finalData.kecamatan || finalData.kecamatan.trim() === "") finalData.kecamatan = "-";
      if (!finalData.kodePos || finalData.kodePos.trim() === "") finalData.kodePos = "00000";
      if (!finalData.whatsapp || finalData.whatsapp.trim() === "") finalData.whatsapp = "-";
      if (!finalData.tinggalDengan) finalData.tinggalDengan = "Orang Tua";
      if (!finalData.transportasi) finalData.transportasi = "Lainnya";
      if (!finalData.tinggiBadan) finalData.tinggiBadan = "0";
      if (!finalData.beratBadan) finalData.beratBadan = "0";
      if (!finalData.jarakSekolah) finalData.jarakSekolah = "Kurang dari 1 km";
      if (!finalData.jarakKm) finalData.jarakKm = "0";
      if (!finalData.waktuJam) finalData.waktuJam = "0";
      if (!finalData.waktuMenit) finalData.waktuMenit = "0";
      if (!finalData.jumlahSaudara) finalData.jumlahSaudara = "0";
      if (!finalData.golonganDarah) finalData.golonganDarah = "O";
      if (!finalData.teleponOrtu || finalData.teleponOrtu.trim() === "") finalData.teleponOrtu = "-";
      if (!finalData.sekolahAsal || finalData.sekolahAsal.trim() === "") finalData.sekolahAsal = "-";
      if (!finalData.tglLulus) finalData.tglLulus = "2026-06-10";
      if (!finalData.lamaBelajar) finalData.lamaBelajar = "3";
      if (!finalData.diterimaKelas) finalData.diterimaKelas = "X (Sepuluh)";
      if (!finalData.jurusan1) {
        const firstMajor = majors[0];
        finalData.jurusan1 = firstMajor ? `${firstMajor.title} (${firstMajor.code})` : "Rekayasa Perangkat Lunak (RPL)";
      }

      // Adjust period for transfer students dynamically
      let calculatedPeriod = finalData.periode || schoolPeriod || "2026-2027";
      if (finalData.diterimaKelas === "XI (Sebelas)") {
        const parts = calculatedPeriod.split("-").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          calculatedPeriod = `${parts[0] - 1}-${parts[1] - 1}`;
        }
      } else if (finalData.diterimaKelas === "XII (Dua Belas)") {
        const parts = calculatedPeriod.split("-").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          calculatedPeriod = `${parts[0] - 2}-${parts[1] - 2}`;
        }
      }
      finalData.periode = calculatedPeriod;

      try {
        const res = await registerApplicant(finalData);
        if (res && res.success) {
          setSubmittedCandidate(res.data);
          if (typeof window !== "undefined") {
            localStorage.setItem('ppdb_active_checkout', JSON.stringify(res.data));
            localStorage.removeItem('ppdb_registration_form_data');
            localStorage.removeItem('ppdb_registration_wizard_step');
          }
          setShowPaymentGate(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Pendaftaran Gagal',
            text: res?.message || "Gagal mengirimkan formulir pendaftaran. Silakan coba lagi.",
            confirmButtonColor: '#3b82f6',
            customClass: {
              popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
              confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
              title: 'text-base font-extrabold text-slate-850 dark:text-white'
            }
          });
        }
      } catch (err) {
        console.error("Submit error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan Koneksi',
          text: "Terjadi kesalahan koneksi. Silakan coba lagi.",
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    isSubmitting,
    nextStep,
    prevStep,
    goToStep,
  };
}
