<template>
  <q-page padding>
    <h1>{{ $t('switch_language') }}</h1>

    <q-select v-model="language" :options="availableLanguages" option-value="value" option-label="label"
      label="Language" @update:model-value="setLanguage($event)" emit-value map-options />

    <q-toggle v-model="darkMode" :label="$t('toggle_theme')" />
  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettings } from 'src/composables/useSettings';
import { storeToRefs } from "pinia";

const { locale } = useI18n()
const { settingsStore, availableLanguages } = useSettings();
const { darkMode, language } = storeToRefs(settingsStore)

function setLanguage(lang) {
  //const newLang = settingsStore.language = lang
  settingsStore.setLanguage(lang)
  // locale.value = newLang
  locale.value = lang
}
</script>
