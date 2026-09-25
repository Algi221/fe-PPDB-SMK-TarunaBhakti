import React from "react";

export function useDaftarFormInput(setFormData: React.Dispatch<React.SetStateAction<any>>) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({
          ...prev,
          [fieldName]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;

    if (name === "nisn") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev: any) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "nik") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 16);
      setFormData((prev: any) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "kodePos") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev: any) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "whatsapp" || name === "teleponOrtu") {
      let cleanValue = value.replace(/\D/g, "");
      if (cleanValue.startsWith("0")) {
        cleanValue = "+62" + cleanValue.slice(1);
      } else if (cleanValue.startsWith("62")) {
        cleanValue = "+" + cleanValue;
      } else if (cleanValue && !cleanValue.startsWith("+62")) {
        cleanValue = "+62" + cleanValue;
      }
      cleanValue = cleanValue.slice(0, 16);
      setFormData((prev: any) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "tinggiBadan" || name === "beratBadan" || name === "jarakKm") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev: any) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "waktuJam" || name === "waktuMenit" || name === "jumlahSaudara") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 2);
      setFormData((prev: any) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev: any) => {
      const current = prev.kebutuhanKhusus || [];
      const updated = current.includes(value)
        ? current.filter((item: string) => item !== value)
        : [...current, value];
      return { ...prev, kebutuhanKhusus: updated };
    });
  };

  return {
    handleFileChange,
    handleInputChange,
    handleCheckboxChange,
  };
}
