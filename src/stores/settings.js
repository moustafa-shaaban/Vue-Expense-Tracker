import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    darkMode: true,
    language: 'en',
    sideBar: false,
    currency: 'USD',
    hasCompletedSetup: false,
  }),
  actions: {
    setDarkMode(value) {
      this.darkMode = value
      //document.documentElement.classList.toggle('dark', value)
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    setLanguage(lang) {
      this.language = lang
    },
    toggleSideBar() {
      this.sideBar = !this.sideBar
    },
    completeSetup() {
      this.hasCompletedSetup = true
    },
  },
  persist: true,
})
