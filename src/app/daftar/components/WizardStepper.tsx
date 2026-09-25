"use client";

import React from "react";

interface WizardStepperProps {
  wizardStep: number;
  goToStep: (step: number) => void;
  getStepLabel: (step: number) => string;
}

export default function WizardStepper({
  wizardStep,
  goToStep,
  getStepLabel,
}: WizardStepperProps) {
  return (
    <>
      {/* Desktop Stepper */}
      <div className="hidden md:flex justify-between items-center mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.75 bg-slate-100 dark:bg-slate-800/80 -translate-y-1/2 z-0 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-0.75 bg-blue-600 dark:bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{ width: `${((wizardStep - 1) / 13) * 100}%` }}
        ></div>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((step) => {
          const isCompleted = wizardStep > step;
          const isCurrent = wizardStep === step;
          return (
            <div
              key={step}
              onClick={() => goToStep(step)}
              title={`Tahap ${step}`}
              className={`rounded-full z-10 transition-all duration-500 ease-out cursor-pointer select-none relative ${
                isCurrent
                  ? "w-7 h-7 bg-blue-600 dark:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.65)] scale-125 ring-[6px] ring-blue-500/20"
                  : isCompleted
                    ? "w-4.5 h-4.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 ring-4 ring-blue-500/10"
                    : "w-4 h-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500"
              }`}
            >
              {isCurrent && (
                <span className="absolute inset-1.5 bg-white rounded-full animate-pulse"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="block md:hidden mb-8 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 tracking-wider">
            Tahap {wizardStep} dari 14
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {getStepLabel(wizardStep)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-550 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(wizardStep / 14) * 100}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}
