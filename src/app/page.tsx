"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Layers, BookOpen, Video, Palette } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  AlurItem, 
  FaqItem, 
  PartnerItem, 
  MajorItem, 
  GelombangConfig,
  DEFAULT_FAQ, 
  DEFAULT_ALUR, 
  DEFAULT_PARTNERS, 
  DEFAULT_MAJORS 
} from "@/components/landing/types";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { GelombangSection } from "@/components/landing/GelombangSection";
import { AlurSection } from "@/components/landing/AlurSection";
import { MajorsSection } from "@/components/landing/MajorsSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LocationAndContactSection } from "@/components/landing/LocationAndContactSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  const { ppdbLogo, ppdbTitle } = usePPDB();

  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [heroTitle, setHeroTitle] = useState("Penerimaan Peserta Didik Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("SPMB SMK Taruna Bhakti");
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.");
  const [phone, setPhone] = useState("(021) 8740756");
  const [email, setEmail] = useState("info@smktarunabhakti.sch.id");
  const [address, setAddress] = useState("Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453");
  const [mapTitle, setMapTitle] = useState("Kunjungi SMK Taruna Bhakti");
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [waAdmin, setWaAdmin] = useState("6281292244456");

  const [gelombangConfig, setGelombangConfig] = useState<GelombangConfig>({
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  });

  const [faqList, setFaqList] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState("Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru SMK Taruna Bhakti.");
  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [majors, setMajors] = useState<MajorItem[]>(DEFAULT_MAJORS);

  const [loadVideo, setLoadVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ["/assets/videos/vid1.webm", "/assets/videos/vid2.webm"];

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMajorsVisible, setIsMajorsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMajorsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.05 }
    );
    const element = document.getElementById("majors");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadVideo(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const loadDynamicConfig = async () => {
      try {
        const localAlur = localStorage.getItem("ppdb_alur_config");
        if (localAlur) {
          try {
            setAlurList(JSON.parse(localAlur));
          } catch (e) {
            console.error("Gagal parse alur dari localStorage", e);
          }
        }

        const localFaq = localStorage.getItem("ppdb_faq_config");
        if (localFaq) {
          try {
            setFaqList(JSON.parse(localFaq));
          } catch (e) {
            console.error("Gagal parse FAQ dari localStorage", e);
          }
        }

        const res = await fetch("http://localhost:5000/api/config");
        const data = await res.json();

        if (data.success && data.data) {
          const config = data.data;
          if (config.ppdb_hero_title) setHeroTitle(config.ppdb_hero_title);
          if (config.ppdb_hero_title_sub) setHeroTitleSub(config.ppdb_hero_title_sub);
          if (config.ppdb_hero_subtitle) setHeroSubtitle(config.ppdb_hero_subtitle);
          if (config.ppdb_phone) setPhone(config.ppdb_phone);
          if (config.ppdb_email) setEmail(config.ppdb_email);
          if (config.ppdb_address) setAddress(config.ppdb_address);
          if (config.ppdb_map_title) setMapTitle(config.ppdb_map_title);
          if (config.ppdb_map_url) setMapUrl(config.ppdb_map_url);
          if (config.ppdb_school_period) setSchoolPeriod(config.ppdb_school_period);
          if (config.ppdb_wa_admin) setWaAdmin(config.ppdb_wa_admin);
          if (config.ppdb_alur_config) setAlurList(config.ppdb_alur_config);
          if (config.ppdb_faq_config) setFaqList(config.ppdb_faq_config);
          if (config.ppdb_faq_title) setFaqTitle(config.ppdb_faq_title);
          if (config.ppdb_faq_subtitle) setFaqSubtitle(config.ppdb_faq_subtitle);
          if (config.ppdb_gelombang_config) setGelombangConfig(config.ppdb_gelombang_config);
          if (config.ppdb_partners_config && Array.isArray(config.ppdb_partners_config)) {
            setPartnersList(config.ppdb_partners_config);
          }
          if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config)) {
            const iconMap: Record<string, any> = {
              RPL: Cpu,
              TJKT: Layers,
              DKV: BookOpen,
              BC: Video,
              ANM: Palette,
              TE: Cpu
            };
            const mapped = config.ppdb_majors_config.map((m: any) => ({
              ...m,
              icon: iconMap[m.code] || Cpu
            }));
            setMajors(mapped);
          }
        }
      } catch (e) {
        console.log("Failed to load dynamic configuration from backend:", e);
      }
    };

    loadDynamicConfig();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* FLOATING NAVBAR & MOBILE OVERLAY */}
      <LandingNavbar
        isNavbarScrolled={isNavbarScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isDark={isDark}
        toggleDark={toggleDark}
        ppdbLogo={ppdbLogo}
        ppdbTitle={ppdbTitle}
      />

      {/* MAIN SECTIONS */}
      <main className="grow w-full">
        {/* HERO SECTION */}
        <HeroSection
          heroTitle={heroTitle}
          heroTitleSub={heroTitleSub}
          heroSubtitle={heroSubtitle}
          address={address}
          majors={majors}
          loadVideo={loadVideo}
          currentVideo={currentVideo}
          videos={videos}
          handleVideoEnded={handleVideoEnded}
        />

        {/* JADWAL GELOMBANG PENDAFTARAN */}
        <GelombangSection
          schoolPeriod={schoolPeriod}
          gelombangConfig={gelombangConfig}
        />

        {/* ALUR PENDAFTARAN */}
        <AlurSection
          schoolPeriod={schoolPeriod}
          alurList={alurList}
        />

        {/* PROGRAM KEAHLIAN / JURUSAN GRID */}
        <MajorsSection
          majors={majors}
          isMajorsVisible={isMajorsVisible}
        />

        {/* KEMITRAAN INDUSTRI */}
        <PartnersSection
          partnersList={partnersList}
        />

        {/* FAQ SECTION */}
        <FaqSection
          faqTitle={faqTitle}
          faqSubtitle={faqSubtitle}
          faqList={faqList}
        />

        {/* LOCATION & WA CONTACT */}
        <LocationAndContactSection
          mapTitle={mapTitle}
          mapUrl={mapUrl}
          address={address}
          waAdmin={waAdmin}
        />
      </main>

      {/* FOOTER */}
      <LandingFooter
        ppdbLogo={ppdbLogo}
        ppdbTitle={ppdbTitle}
        address={address}
        phone={phone}
        email={email}
        schoolPeriod={schoolPeriod}
      />
    </div>
  );
}
