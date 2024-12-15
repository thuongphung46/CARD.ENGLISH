import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import vi from "./vi.json";
import HRMStorage from "@/common/function";
import { KEY_VALUE } from "@/constants/GlobalConstant";

const initializeI18next = async () => {
  // Retrieve the language setting from storage
  const language = await HRMStorage.get(KEY_VALUE.LANGUAGE);

  // Set the initial language
  const initialLanguage = language || "vi";

  // Set the language in storage if it wasn't already set
  if (!language) {
    HRMStorage.set(KEY_VALUE.LANGUAGE, "vi");
  }

  // Initialize i18next
  i18next.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: initialLanguage, // Use the initial language
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
  });
};

// Call the initialization function
initializeI18next();

export default i18next;
