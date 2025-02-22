import { createI18n } from "vue-i18n";
import en from "./en";
import ar from "./ar";

const messages = {
  en,
  ar,
};

const i18n = createI18n({
  locale: "en", // Default language
  fallbackLocale: "en",
  messages,
});

export default i18n;
