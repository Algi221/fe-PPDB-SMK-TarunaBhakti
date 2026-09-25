"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { PPDBFormData } from "../types";

interface WizardNavigationProps {
  wizardStep: number;
  prevStep: () => void;
  nextStep: () => void;
  isSubmitting: boolean;
  formData: PPDBFormData;
}

export default function WizardNavigation({
  wizardStep,
  prevStep,
  nextStep,
  isSubmitting,
  formData,
}: WizardNavigationProps) {
  return (
    <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
      {wizardStep > 1 ? (
        <button
          type="button"
          className="btn-nav-link px-4 py-2"
          onClick={prevStep}
        >
          Kembali
        </button>
      ) : (
        <div></div>
      )}

      <div className="flex gap-3 items-center">
        {(wizardStep === 5 || wizardStep === 6) && (
          <button
            type="button"
            className="btn-secondary"
            onClick={nextStep}
          >
            Lewati
          </button>
        )}
        <button
          type="button"
          className="btn-primary-pill px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={nextStep}
          disabled={
            isSubmitting ||
            (wizardStep === 1 && (!formData.nama || !formData.nisn)) ||
            (wizardStep === 14 && !formData.deklarasi)
          }
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Mengirim...
            </span>
          ) : wizardStep === 14 ? (
            "Kirim Pendaftaran"
          ) : (
            "Selanjutnya"
          )}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
