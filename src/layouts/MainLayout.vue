<script setup>
import { useSettingsStore } from 'src/stores/settings';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const settingsStore = useSettingsStore();

function switchLanguage() {
  const newLang = settingsStore.language === 'en' ? 'ar' : 'en'
  settingsStore.setLanguage(newLang)
  locale.value = newLang
}
</script>

<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated :class="settingsStore.darkMode ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <q-btn flat @click="settingsStore.toggleSideBar()" round dense icon="menu" />
        <q-toolbar-title>{{ $t('title') }}</q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="translate" @click="switchLanguage" />
        <q-btn flat round dense :icon="settingsStore.darkMode ? 'light_mode' : 'dark_mode'"
          @click="settingsStore.toggleDarkMode()" />
        <q-btn flat round dense icon="settings" to="/settings" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="settingsStore.sideBar" :side="settingsStore.language === 'en' ? 'left' : 'right'" :width="200"
      :breakpoint="700" elevated>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item exact clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section>
              {{ $t('title') }}
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/settings">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>
              {{ $t('settings') }}
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/about">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>

            <q-item-section>
              {{ $t('about') }}
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="settingsStore.toggleDarkMode()">
            <q-item-section avatar>
              <q-icon :name="settingsStore.darkMode ? 'light_mode' : 'dark_mode'" />
            </q-item-section>

            <q-item-section>
              {{ $t('toggle_theme') }}
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/tags">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              {{ $t('tags') }}
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/charts">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              {{ $t('charts') }}
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/data-query">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>

            <q-item-section>
              {{ $t('dataQuery') }}
            </q-item-section>
          </q-item>

          <!-- <q-item exact clickable v-ripple to="/apex-charts">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              {{ $t('charts') }}
            </q-item-section>
          </q-item> -->

          <q-item exact clickable v-ripple to="/import">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              {{ $t('import_data') }}
            </q-item-section>
          </q-item>

          <q-item exact clickable v-ripple to="/export">
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>
              {{ $t('export_data') }}
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
