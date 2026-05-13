import React, { useEffect, useState } from "react";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en");
  const { t } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
    setCurrentLang(savedLang);
  }, []);

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setCurrentLang(lng);
  };

  return (
    <div className="d-flex align-items-center mx-2 gap-2">
      <span className="fw-semibold"> {t("language")}:</span>
      <select
        className="form-select form-select-sm w-auto"
        value={currentLang}
        onChange={changeLanguage}
      >
        <option value="en">EN English</option>
        <option value="hi">HI हिन्दी</option>
        <option value="mr">MA मराठी</option>
      </select>
    </div>
  );
}
