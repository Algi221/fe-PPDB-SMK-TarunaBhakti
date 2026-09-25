"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, Clock, Home } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";

import SuccessView from "./components/SuccessView";
import PaymentGateView from "./components/PaymentGateView";
import WizardProgress from "./components/WizardProgress";
import WizardStepper from "./components/WizardStepper";
import WizardNavigation from "./components/WizardNavigation";

import Step1Identitas from "./components/Step1Identitas";
import Step2Kontak from "./components/Step2Kontak";
import Step3Alamat from "./components/Step3Alamat";
import Step4Kesehatan from "./components/Step4Kesehatan";
import Step5Prestasi from "./components/Step5Prestasi";
import Step6Beasiswa from "./components/Step6Beasiswa";
import Step7PendidikanJurusan from "./components/Step7PendidikanJurusan";
import Step8Ayah from "./components/Step8Ayah";
import Step9Ibu from "./components/Step9Ibu";
import Step10Wali from "./components/Step10Wali";
import Step11Kegemaran from "./components/Step11Kegemaran";
import Step12BudiPekerti from "./components/Step12BudiPekerti";
import Step13Review from "./components/Step13Review";
import Step14Deklarasi from "./components/Step14Deklarasi";

import { useDaftarPageData } from "./hooks/useDaftarPageData";
import { useDaftarFormInput } from "./hooks/useDaftarFormInput";
import { useDaftarWizard } from "./hooks/useDaftarWizard";
import { getStepLabel } from "./daftarValidation";

export default function DaftarPage() {
  const { registerApplicant, fetchPublicApplicants, addToast, ppdbLogo, ppdbTitle } = usePPDB();

  const {
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
  } = useDaftarPageData(fetchPublicApplicants);

  const { handleInputChange, handleCheckboxChange } = useDaftarFormInput(setFormData);

  const { isSubmitting, nextStep, prevStep, goToStep } = useDaftarWizard({
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
  });

  if (portalStatus === "closed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/40 mx-auto">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-850 dark:text-white uppercase tracking-wider">Pendaftaran Ditutup</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Mohon maaf, portal Penerimaan Peserta Didik Baru (PPDB) SMK Taruna Bhakti Depok saat ini sedang ditutup.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="w-full inline-flex justify-center items-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all uppercase tracking-wider cursor-pointer"
            >
              <Home size={14} />
              <span>Kembali Ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <SuccessView
        successData={successData}
        setSuccessData={setSuccessData}
        setIsSuccess={setIsSuccess}
        setWizardStep={setWizardStep}
        setFormData={setFormData}
        setSubmittedCandidate={setSubmittedCandidate}
        ppdbLogo={ppdbLogo}
        ppdbTitle={ppdbTitle}
        schoolPeriod={schoolPeriod}
        regCost={regCost}
        waGroupUrl={waGroupUrl}
      />
    );
  }

  if (showPaymentGate && submittedCandidate) {
    return (
      <PaymentGateView
        submittedCandidate={submittedCandidate}
        setShowPaymentGate={setShowPaymentGate}
        setIsSuccess={setIsSuccess}
        setSuccessData={setSuccessData}
        setFormData={setFormData}
        fetchPublicApplicants={fetchPublicApplicants}
        addToast={addToast}
        regCost={regCost}
        bankConfigList={bankConfigList}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center py-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleDark} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all" 
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-750" />}
        </button>
      </div>

      <WizardProgress wizardStep={wizardStep} goToStep={goToStep} getStepLabel={getStepLabel} />

      <div className="bg-white dark:bg-slate-900 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 md:p-10 max-w-4xl w-full relative z-10">
        <WizardStepper wizardStep={wizardStep} goToStep={goToStep} getStepLabel={getStepLabel} />

        {wizardStep === 1 && <Step1Identitas formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 2 && <Step2Kontak formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 3 && <Step3Alamat formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 4 && <Step4Kesehatan formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />}
        {wizardStep === 5 && <Step5Prestasi formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />}
        {wizardStep === 6 && <Step6Beasiswa formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />}
        {wizardStep === 7 && <Step7PendidikanJurusan formData={formData} handleInputChange={handleInputChange} majors={majors} kuotaData={kuotaData} />}
        {wizardStep === 8 && <Step8Ayah formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 9 && <Step9Ibu formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 10 && <Step10Wali formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 11 && <Step11Kegemaran formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />}
        {wizardStep === 12 && <Step12BudiPekerti formData={formData} handleInputChange={handleInputChange} />}
        {wizardStep === 13 && <Step13Review formData={formData} goToStep={goToStep} />}
        {wizardStep === 14 && <Step14Deklarasi formData={formData} setFormData={setFormData} />}

        <WizardNavigation
          wizardStep={wizardStep}
          prevStep={prevStep}
          nextStep={nextStep}
          isSubmitting={isSubmitting}
          formData={formData}
        />
      </div>
    </div>
  );
}
