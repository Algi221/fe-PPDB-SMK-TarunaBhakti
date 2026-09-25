import {
  MajorItem,
  BankConfigItem,
  AlurItem,
  PartnerItem,
  FieldConfigItem,
  FaqItem,
  DEFAULT_FAQ,
  DEFAULT_PARTNERS,
  DEFAULT_MAJORS,
  formatPhoneNumber
} from "../types";

export interface KelolaUIStateValues {
  heroTitle: string;
  heroTitleSub: string;
  heroSubtitle: string;
  phone: string;
  email: string;
  address: string;
  mapTitle: string;
  mapUrl: string;
  schoolPeriod: string;
  waGroupUrl: string;
  waAdmin: string;
  formGuideline: string;
  formFee: string;
  schoolLogo: string;
  schoolTitle: string;
  gelombangConfig: any;
  bankConfigList: BankConfigItem[];
  alurList: AlurItem[];
  majorsList: MajorItem[];
  partnersList: PartnerItem[];
  faqList: FaqItem[];
  fieldsConfigUI: Record<string, FieldConfigItem>;
}

export function buildSaveConfigPayload(state: KelolaUIStateValues, finalMajors: MajorItem[]) {
  return {
    ppdb_hero_title: state.heroTitle,
    ppdb_hero_title_sub: state.heroTitleSub,
    ppdb_hero_subtitle: state.heroSubtitle,
    ppdb_phone: state.phone,
    ppdb_email: state.email,
    ppdb_address: state.address,
    ppdb_map_title: state.mapTitle,
    ppdb_map_url: state.mapUrl,
    ppdb_school_period: state.schoolPeriod,
    ppdb_wa_group_url: state.waGroupUrl,
    ppdb_wa_admin: state.waAdmin,
    ppdb_form_guideline: state.formGuideline,
    ppdb_form_fee: state.formFee,
    ppdb_alur_config: state.alurList,
    ppdb_majors_config: finalMajors,
    ppdb_faq_config: state.faqList,
    ppdb_gelombang_config: state.gelombangConfig,
    ppdb_bank_config: state.bankConfigList,
    ppdb_partners_config: state.partnersList,
    ppdb_logo_url: state.schoolLogo,
    ppdb_title: state.schoolTitle,
    ppdb_fields_config: state.fieldsConfigUI
  };
}

export function buildDraftObject(state: KelolaUIStateValues) {
  return buildSaveConfigPayload(state, state.majorsList);
}

export interface KelolaUIStateSetters {
  setHeroTitle: (v: string) => void;
  setHeroTitleSub: (v: string) => void;
  setHeroSubtitle: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setAddress: (v: string) => void;
  setMapTitle: (v: string) => void;
  setMapUrl: (v: string) => void;
  setSchoolPeriod: (v: string) => void;
  setFaqTitle: (v: string) => void;
  setFaqSubtitle: (v: string) => void;
  setWaGroupUrl: (v: string) => void;
  setWaAdmin: (v: string) => void;
  setFormGuideline: (v: string) => void;
  setFormFee: (v: string) => void;
  setSchoolLogo: (v: string) => void;
  setSchoolTitle: (v: string) => void;
  setAlurList: (v: AlurItem[]) => void;
  setFaqList: (v: FaqItem[]) => void;
  setPartnersList: (v: PartnerItem[]) => void;
  setMajorsList: (v: MajorItem[]) => void;
  setGelombangConfig: (v: any) => void;
  setBankConfigList: (v: BankConfigItem[]) => void;
  setFieldsConfigUI: React.Dispatch<React.SetStateAction<Record<string, FieldConfigItem>>>;
}

export function applyActiveConfigToState(activeConfig: any, setters: KelolaUIStateSetters) {
  if (activeConfig.ppdb_hero_title) setters.setHeroTitle(activeConfig.ppdb_hero_title);
  if (activeConfig.ppdb_hero_title_sub) setters.setHeroTitleSub(activeConfig.ppdb_hero_title_sub);
  if (activeConfig.ppdb_hero_subtitle) setters.setHeroSubtitle(activeConfig.ppdb_hero_subtitle);
  if (activeConfig.ppdb_phone) setters.setPhone(formatPhoneNumber(activeConfig.ppdb_phone));
  if (activeConfig.ppdb_email) setters.setEmail(activeConfig.ppdb_email);
  if (activeConfig.ppdb_address) setters.setAddress(activeConfig.ppdb_address);
  if (activeConfig.ppdb_map_title) setters.setMapTitle(activeConfig.ppdb_map_title);
  if (activeConfig.ppdb_map_url) setters.setMapUrl(activeConfig.ppdb_map_url);
  if (activeConfig.ppdb_school_period) setters.setSchoolPeriod(activeConfig.ppdb_school_period);
  if (activeConfig.ppdb_faq_title) setters.setFaqTitle(activeConfig.ppdb_faq_title);
  if (activeConfig.ppdb_faq_subtitle) setters.setFaqSubtitle(activeConfig.ppdb_faq_subtitle);
  if (activeConfig.ppdb_wa_group_url) setters.setWaGroupUrl(activeConfig.ppdb_wa_group_url);
  if (activeConfig.ppdb_wa_admin) setters.setWaAdmin(formatPhoneNumber(activeConfig.ppdb_wa_admin));
  if (activeConfig.ppdb_form_guideline) setters.setFormGuideline(activeConfig.ppdb_form_guideline);
  if (activeConfig.ppdb_form_fee) setters.setFormFee(activeConfig.ppdb_form_fee);
  if (activeConfig.ppdb_logo_url) setters.setSchoolLogo(activeConfig.ppdb_logo_url);
  if (activeConfig.ppdb_title) setters.setSchoolTitle(activeConfig.ppdb_title);
  
  if (activeConfig.ppdb_alur_config && Array.isArray(activeConfig.ppdb_alur_config)) {
    setters.setAlurList(activeConfig.ppdb_alur_config);
  }
  if (activeConfig.ppdb_faq_config && Array.isArray(activeConfig.ppdb_faq_config)) {
    setters.setFaqList(activeConfig.ppdb_faq_config);
  } else {
    setters.setFaqList(DEFAULT_FAQ);
  }
  if (activeConfig.ppdb_partners_config && Array.isArray(activeConfig.ppdb_partners_config)) {
    setters.setPartnersList(activeConfig.ppdb_partners_config);
  } else {
    setters.setPartnersList(DEFAULT_PARTNERS);
  }
  if (activeConfig.ppdb_majors_config && Array.isArray(activeConfig.ppdb_majors_config)) {
    const dbMajors = activeConfig.ppdb_majors_config;
    const mergedMajors: MajorItem[] = [];
    
    dbMajors.forEach((dbMajor: any) => {
      const defMajor = DEFAULT_MAJORS.find(d => d.code === dbMajor.code);
      mergedMajors.push({
        code: dbMajor.code,
        title: dbMajor.title || "",
        desc: dbMajor.desc || "",
        color: dbMajor.color || (defMajor?.color || "#0066ff"),
        careers: Array.isArray(dbMajor.careers) ? dbMajor.careers : (defMajor?.careers || []),
        facilities: Array.isArray(dbMajor.facilities) ? dbMajor.facilities : (defMajor?.facilities || []),
        logo: dbMajor.logo || (defMajor?.logo || ""),
        banner: dbMajor.banner || (defMajor?.banner || ""),
        video: dbMajor.video || (defMajor?.video || ""),
        gallery: Array.isArray(dbMajor.gallery) ? dbMajor.gallery : (defMajor?.gallery || [])
      });
    });
    
    DEFAULT_MAJORS.forEach(def => {
      if (!mergedMajors.some(m => m.code === def.code)) {
        mergedMajors.push(def);
      }
    });
    
    setters.setMajorsList(mergedMajors);
  }
  if (activeConfig.ppdb_gelombang_config) {
    setters.setGelombangConfig(activeConfig.ppdb_gelombang_config);
  }
  if (activeConfig.ppdb_bank_config) {
    const bankData = activeConfig.ppdb_bank_config;
    if (Array.isArray(bankData)) {
      setters.setBankConfigList(bankData);
    } else if (bankData && typeof bankData === "object") {
      setters.setBankConfigList([bankData]);
    }
  }
  if (activeConfig.ppdb_fields_config && typeof activeConfig.ppdb_fields_config === "object") {
    setters.setFieldsConfigUI(prev => ({ ...prev, ...activeConfig.ppdb_fields_config }));
  }
}
