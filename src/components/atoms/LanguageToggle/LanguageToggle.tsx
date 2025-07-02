import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdTranslate } from "react-icons/md";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("appLanguage", newLang);
    document.body.dir = newLang === "ar" ? "rtl" : "ltr";
    window.location.reload();
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage") || "en";
    i18n.changeLanguage(savedLanguage);
    document.body.dir = savedLanguage === "ar" ? "rtl" : "ltr";
  }, [i18n]);

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 shadow-lg text-black border rounded-lg hover:bg-slate-300 transition duration-200"
      aria-label="Toggle Language"
      data-testid="language-toggle-button"
    >
      <MdTranslate className="text-xl" />
      <span>{i18n.language === "en" ? "العربية" : "English"}</span>
    </button>
  );
};

export default LanguageToggle;
