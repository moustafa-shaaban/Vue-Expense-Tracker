<script setup>
import { ref, watch, computed } from 'vue'
import { Dark, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

// import { useNotesStore } from 'src/stores/notes-store';

defineOptions({
  name: 'MainLayout'
})

const { locale } = useI18n();
const $q = useQuasar();

const leftDrawerOpen = ref(false)

// const darkQuery = '(prefers-color-scheme: dark)';
// const queryList = window.matchMedia(darkQuery);
// Dark.set(queryList.matches);
// queryList.addEventListener('change', (event) => {
//     Dark.set(event.matches);
// });

// Initialize dark mode from localStorage
const darkMode = localStorage.getItem('darkMode') === 'true';
$q.dark.set(darkMode);

const toggleDarkMode = () => {
  $q.dark.toggle();
  localStorage.setItem('darkMode', $q.dark.isActive);
};

// Initialize locale from localStorage
const savedLocale = localStorage.getItem('locale') || 'en';
locale.value = savedLocale;

// Watch for locale changes and update RTL
watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale);
  localStorage.getItem('locale')
  $q.lang.set({ rtl: newLocale === 'ar' }); // Enable/disable RTL
  document.body.classList.toggle('rtl', newLocale === 'ar');
});

// Compute layout direction based on locale
const layoutDirection = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'));


function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// const notesStore = useNotesStore();
</script>
<template>
  <q-layout :dir="layoutDirection" view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated :class="Dark.isActive ? 'bg-dark' : 'bg-white text-dark'">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Expenses
        </q-toolbar-title>

        <q-space />
        <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
        <q-select v-model="locale" :options="[
          { label: 'English', value: 'en' },
          { label: 'العربية', value: 'ar' },
        ]" dense options-dense emit-value map-options />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay :width="200" :breakpoint="700" side="left" behavior="desktop" bordered>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item exact clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/about">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>

            <q-item-section>
              About
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/tags">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              Tags
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/charts">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              Chart.js Charts
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/apex-charts">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              ApexCharts
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/import">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              Data Import
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/export">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              Data Export
            </q-item-section>
          </q-item>

          <q-item v-if="!Dark.isActive" clickable v-ripple @click="toggleDarkMode">
            <q-item-section avatar>
              <q-icon name="dark_mode" />
            </q-item-section>

            <q-item-section>
              Dark Mode
            </q-item-section>
          </q-item>

          <q-item v-else clickable v-ripple @click="toggleDarkMode">
            <q-item-section avatar>
              <q-icon name="light_mode" />
            </q-item-section>

            <q-item-section>
              Light Mode
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
