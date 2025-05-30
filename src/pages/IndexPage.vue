<template>
  <q-page class="q-pa-md">
    <q-btn @click="settings.toggleDarkMode()" :label="$t('toggle_theme')" />
    <q-btn @click="setLanguage" :label="$t('switch_language')" class="q-ml-sm" />
  </q-page>
</template>

<script setup>
import { useSettingsStore } from 'stores/settings'
import { useI18n } from 'vue-i18n'

const settings = useSettingsStore()
const { locale } = useI18n()

function setLanguage() {
  const newLang = settings.language === 'en' ? 'ar' : 'en'
  settings.setLanguage(newLang)
  locale.value = newLang
}
</script>
