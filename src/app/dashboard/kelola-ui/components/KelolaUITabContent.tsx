"use client";

import React from "react";
import HeroTab from "./HeroTab";
import MajorsTab from "./MajorsTab";
import AlurTab from "./AlurTab";
import FormTab from "./FormTab";
import FaqTab from "./FaqTab";
import RevisionsTab from "./RevisionsTab";
import BankTab from "./BankTab";
import PartnersTab from "./PartnersTab";
import { useKelolaUIState } from "../hooks/useKelolaUIState";

interface KelolaUITabContentProps {
  uiState: ReturnType<typeof useKelolaUIState>;
}

export default function KelolaUITabContent({ uiState }: KelolaUITabContentProps) {
  const {
    activeTab,
    schoolLogo,
    setSchoolLogo,
    schoolTitle,
    setSchoolTitle,
    heroTitle,
    setHeroTitle,
    heroTitleSub,
    setHeroTitleSub,
    heroSubtitle,
    setHeroSubtitle,
    phone,
    setPhone,
    email,
    setEmail,
    schoolPeriod,
    setSchoolPeriod,
    address,
    setAddress,
    waGroupUrl,
    setWaGroupUrl,
    waAdmin,
    setWaAdmin,
    gelombangConfig,
    setGelombangConfig,
    g1Error,
    setG1Error,
    g2Error,
    setG2Error,
    dragActiveStates,
    setDragActiveStates,
    handleDragState,
    handleSchoolLogoChange,
    majorsList,
    setMajorsList,
    editingMajor,
    setEditingMajor,
    isNewMajor,
    setIsNewMajor,
    emptyMajor,
    processMediaFile,
    showToastMsg,
    alurList,
    handleAddAlur,
    handleUpdateAlur,
    handleRemoveAlur,
    handleMoveAlur,
    formFee,
    setFormFee,
    formGuideline,
    setFormGuideline,
    fieldsConfigUI,
    setFieldsConfigUI,
    faqList,
    handleAddFaq,
    handleUpdateFaq,
    handleRemoveFaq,
    handleMoveFaq,
    revisions,
    handleRestore,
    formatDate,
    bankConfigList,
    setBankConfigList,
    partnersList,
    setPartnersList
  } = uiState;

  return (
    <>
      {activeTab === "hero" && (
        <HeroTab
          schoolLogo={schoolLogo}
          setSchoolLogo={setSchoolLogo}
          schoolTitle={schoolTitle}
          setSchoolTitle={setSchoolTitle}
          heroTitle={heroTitle}
          setHeroTitle={setHeroTitle}
          heroTitleSub={heroTitleSub}
          setHeroTitleSub={setHeroTitleSub}
          heroSubtitle={heroSubtitle}
          setHeroSubtitle={setHeroSubtitle}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          schoolPeriod={schoolPeriod}
          setSchoolPeriod={setSchoolPeriod}
          address={address}
          setAddress={setAddress}
          waGroupUrl={waGroupUrl}
          setWaGroupUrl={setWaGroupUrl}
          waAdmin={waAdmin}
          setWaAdmin={setWaAdmin}
          gelombangConfig={gelombangConfig}
          setGelombangConfig={setGelombangConfig}
          g1Error={g1Error}
          setG1Error={setG1Error}
          g2Error={g2Error}
          setG2Error={setG2Error}
          dragActiveStates={dragActiveStates}
          handleDragState={handleDragState}
          handleSchoolLogoChange={handleSchoolLogoChange}
        />
      )}

      {activeTab === "majors" && (
        <MajorsTab
          majorsList={majorsList}
          setMajorsList={setMajorsList}
          editingMajor={editingMajor}
          setEditingMajor={setEditingMajor}
          isNewMajor={isNewMajor}
          setIsNewMajor={setIsNewMajor}
          emptyMajor={emptyMajor}
          dragActiveStates={dragActiveStates}
          setDragActiveStates={setDragActiveStates}
          handleDragState={handleDragState}
          processMediaFile={processMediaFile}
          showToastMsg={showToastMsg}
        />
      )}

      {activeTab === "alur" && (
        <AlurTab
          alurList={alurList}
          handleAddAlur={handleAddAlur}
          handleUpdateAlur={handleUpdateAlur}
          handleRemoveAlur={handleRemoveAlur}
          handleMoveAlur={handleMoveAlur}
        />
      )}

      {activeTab === "form" && (
        <FormTab
          formFee={formFee}
          setFormFee={setFormFee}
          formGuideline={formGuideline}
          setFormGuideline={setFormGuideline}
          fieldsConfigUI={fieldsConfigUI}
          setFieldsConfigUI={setFieldsConfigUI}
        />
      )}

      {activeTab === "faq" && (
        <FaqTab
          faqList={faqList}
          handleAddFaq={handleAddFaq}
          handleUpdateFaq={handleUpdateFaq}
          handleRemoveFaq={handleRemoveFaq}
          handleMoveFaq={handleMoveFaq}
        />
      )}

      {activeTab === "revisions" && (
        <RevisionsTab
          revisions={revisions}
          handleRestore={handleRestore}
          formatDate={formatDate}
        />
      )}

      {activeTab === "bank" && (
        <BankTab
          bankConfigList={bankConfigList}
          setBankConfigList={setBankConfigList}
        />
      )}

      {activeTab === "partners" && (
        <PartnersTab
          partnersList={partnersList}
          setPartnersList={setPartnersList}
        />
      )}
    </>
  );
}
