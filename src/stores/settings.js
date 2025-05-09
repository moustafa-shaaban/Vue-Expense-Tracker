import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settinsg", {
  state: () => ({
    darkMode: JSON.parse(localStorage.getItem("darkMode")) ?? false,
    language: localStorage.getItem("language") || "en",
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
    },
    setLanguage(lang) {
      this.language = lang;
      localStorage.setItem("language", lang);
    },
  },
});
