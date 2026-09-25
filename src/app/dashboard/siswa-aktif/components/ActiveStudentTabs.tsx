import React from "react";
import { Applicant } from "./types";
import { ActiveStudentBiodataTab } from "./ActiveStudentBiodataTab";
import { ActiveStudentFamilyTab } from "./ActiveStudentFamilyTab";
import { ActiveStudentAcademicTab } from "./ActiveStudentAcademicTab";

interface ActiveStudentTabsProps {
  activeTab: string;
  selectedApplicant: Applicant;
}

export const ActiveStudentTabs: React.FC<ActiveStudentTabsProps> = ({
  activeTab,
  selectedApplicant
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-h-[60vh] transition-colors duration-300">
      <ActiveStudentBiodataTab activeTab={activeTab} selectedApplicant={selectedApplicant} />
      <ActiveStudentFamilyTab activeTab={activeTab} selectedApplicant={selectedApplicant} />
      <ActiveStudentAcademicTab activeTab={activeTab} selectedApplicant={selectedApplicant} />
    </div>
  );
};
