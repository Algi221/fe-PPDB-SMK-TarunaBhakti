"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: (CustomSelectOption | string)[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  name?: string;
  id?: string;
  align?: "left" | "right";
  width?: string;
}

export default function CustomSelect({
  value = "",
  onChange,
  options = [],
  placeholder = "Pilih opsi...",
  disabled = false,
  className = "",
  triggerClassName = "",
  dropdownClassName = "",
  name,
  id,
  align = "left",
  width
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  const handleSelect = (val: string, optDisabled?: boolean) => {
    if (optDisabled || disabled) return;
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${width ? width : "w-full"} ${className}`}
    >
      {/* Hidden input for form support */}
      {name && <input type="hidden" name={name} value={value} id={id} />}

      {/* Select Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all select-none cursor-pointer focus:outline-none ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500 dark:ring-blue-500/20"
            : "hover:border-slate-300 dark:hover:border-slate-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${triggerClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-left flex-1">
          {selectedOption ? selectedOption.label : <span className="text-slate-400 font-normal">{placeholder}</span>}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Panel (Foto 3 Style) */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 min-w-full w-max max-w-85 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-1.5 z-50 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 text-center italic">Tidak ada opsi</div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value, opt.disabled)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors duration-150 ${
                    opt.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {/* Left check icon slot matching Foto 3 */}
                  <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                    {isSelected ? (
                      <Check size={14} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                    ) : null}
                  </div>
                  <span className="truncate flex-1">{opt.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
