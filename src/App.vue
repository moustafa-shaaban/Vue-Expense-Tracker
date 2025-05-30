<!-- <template>
  <router-view />
</template>

<script setup>
//
</script> -->

<template>
  <q-layout v-if="settings.hasCompletedSetup" :dir="settings.language === 'ar' ? 'rtl' : 'ltr'" view="lHh Lpr lFf"
    :class="{ 'bg-grey-10': $q.dark.isActive }">
    <router-view />
  </q-layout>

  <q-layout v-else :dir="settings.language === 'ar' ? 'rtl' : 'ltr'" view="lHh Lpr lFf">
    <q-page-container>
      <SetupComponent />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { watch } from 'vue'
import { useSettingsStore } from 'stores/settings'
import SetupComponent from './components/SetupComponent.vue'

const $q = useQuasar()
const settings = useSettingsStore()

$q.dark.set(settings.darkMode)

watch(() => settings.darkMode, val => {
  $q.dark.set(val)
})
</script>
