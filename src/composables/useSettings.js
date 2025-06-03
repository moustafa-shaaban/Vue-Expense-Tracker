import { useSettingsStore } from '../stores/settings'

export function useSettings() {
  const settingsStore = useSettingsStore()

  const availableLanguages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
  ]

  const availableThemes = [
    { value: 'true', label: 'Dark Mode' },
    { value: 'false', label: 'Light Mode' },
  ]

  return {
    settingsStore,
    availableLanguages,
    availableThemes,
  }
}
