import { useSettingsStore } from '../stores/settings'

export function useSettings() {
  const settingsStore = useSettingsStore()

  const availableLanguages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
  ]

  return {
    settingsStore,
    availableLanguages,
  }
}
