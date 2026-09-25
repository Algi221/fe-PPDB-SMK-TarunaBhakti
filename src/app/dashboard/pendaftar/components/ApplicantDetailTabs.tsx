"use client";

import React from "react";
import { Applicant } from "../types";
import ApplicantBiodataPeriodikTab from "./ApplicantBiodataPeriodikTab";
import ApplicantFamilyAcademicTab from "./ApplicantFamilyAcademicTab";
import ApplicantPaymentTab from "./ApplicantPaymentTab";

interface ApplicantDetailTabsProps {
  activeTab: string;
  selectedApplicant: Applicant;
  setSelectedApplicant: React.Dispatch<React.SetStateAction<Applicant | null>>;
  setIsFullscreenImageOpen: (open: boolean) => void;
  updateApplicant: (id: number, data: any) => Promise<any>;
}

export default function ApplicantDetailTabs({
  activeTab,
  selectedApplicant,
  setSelectedApplicant,
  setIsFullscreenImageOpen,
  updateApplicant,
}: ApplicantDetailTabsProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 text-xs leading-relaxed text-slate-655 dark:text-slate-350 font-bold max-h-[50vh] transition-colors duration-300">
      <ApplicantBiodataPeriodikTab activeTab={activeTab} selectedApplicant={selectedApplicant} />
      <ApplicantFamilyAcademicTab activeTab={activeTab} selectedApplicant={selectedApplicant} />
      {activeTab === "pembayaran" && (
        <ApplicantPaymentTab
          selectedApplicant={selectedApplicant}
          setSelectedApplicant={setSelectedApplicant}
          setIsFullscreenImageOpen={setIsFullscreenImageOpen}
          updateApplicant={updateApplicant}
        />
      )}
    </div>
  );
}
