<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSettings } from '../composables/useSettings';
import { useSettingsStore } from "../stores/settings";
import { Notify } from "quasar";
const { t, locale } = useI18n();
const settings = useSettingsStore();
const { availableLanguages } = useSettings();

const step = ref(1);

function applyLanguage() {
  locale.value = settings.language
}

function applyTheme() {
  settings.setDarkMode(toggleTheme.value)
}

const toggleTheme = ref(true)

const currencyOptions = [
  { label: 'USD - United States Dollar - دولار أمريكي', value: 'USD' },
  { label: 'EGP - Egyptian Pound - جنيه مصري', value: 'EGP' },
  { label: 'EUR - Euro - يورو', value: 'EUR' },
  { label: 'GBP - British Pound - جنيه إسترليني', value: 'GBP' },
];

function submit() {
  settings.setDarkMode(settings.darkMode)
  settings.setLanguage(settings.language)
  settings.completeSetup()
  Notify.create({
    message: 'Your Setting is saved successfully',
    type: "positive",
    actions: [
      { icon: 'close', color: 'white', round: true, }
    ]
  })
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step :name="1" :title="t('language')" icon="settings" :done="step > 1">
          <div class="my-card">
            <q-card-section>
              <div class="text-h6">Choose a Language / اختر اللغة</div>
            </q-card-section>
            <q-card-section>
              <div class="q-pa-md">
                <q-option-group :options="availableLanguages" type="radio" v-model="settings.language"
                  @update:model-value="applyLanguage" />
              </div>
            </q-card-section>
            <q-card-actions align="around">
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" :label="t('back')"
                class="q-ml-sm" />
              <q-btn @click="$refs.stepper.next()" color="primary" :label="t('next')" />
            </q-card-actions>
          </div>
        </q-step>

        <q-step :name="2" :title="t('theme')" icon="create_new_folder" :done="step > 2">
          <div class="my-card">
            <q-card-section>
              <div class="text-h6">{{ t('theme') }}</div>
            </q-card-section>
            <q-card-section>
              <q-radio v-model="toggleTheme" :val="true" :label="t('dark')" @update:model-value="applyTheme" />
              <q-radio v-model="toggleTheme" :val="false" :label="t('light')" @update:model-value="applyTheme" />
              <!-- <select v-model="settings.darkMode">
                <option :value="false">{{ t('light') }}</option>
                <option :value="true">{{ t('dark') }}</option>
              </select> -->
            </q-card-section>
            <q-card-actions align="around">
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" :label="t('back')"
                class="q-ml-sm" />
              <q-btn @click="$refs.stepper.next()" color="primary" :label="t('next')" />
            </q-card-actions>
          </div>
        </q-step>

        <q-step :name="3" :title="t('currency')" icon="add_comment">
          <div class="my-card">
            <q-card-section>
              <div class="text-h6">{{ t('currency') }}</div>
            </q-card-section>
            <q-card-section>
              <q-select v-model="settings.currency" :options="currencyOptions" label="Select Currency" emit-value
                map-options />
            </q-card-section>
            <q-card-actions align="around">
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" :label="t('back')"
                class="q-ml-sm" />
              <q-btn @click="submit" color="primary" :label="t('finish')" />
            </q-card-actions>
          </div>
        </q-step>

        <!-- <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn @click="$refs.stepper.next()" color="primary" label="Continue" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back"
              class="q-ml-sm" />
          </q-stepper-navigation>
        </template> -->
      </q-stepper>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.q-page
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

.my-card
  width: 400px
  height: 250px
  max-width: 1000px
</style>
