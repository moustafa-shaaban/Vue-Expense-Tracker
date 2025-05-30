import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const settingsStore = useSettingsStore()
  const i18n = createI18n({
    locale: settingsStore.language,
    fallbackLocale: 'en',
    messages,
  })

  // Set i18n instance on app
  app.use(i18n)
})
