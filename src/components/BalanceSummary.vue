<script setup>
import { storeToRefs } from "pinia";

import { useSettingsStore } from "src/stores/settings";
import { useTransactionsStore } from "../stores/transactions"

const { currency } = useSettingsStore();

const store = useTransactionsStore()

const { balance, getIncomes, getExpenses } = storeToRefs(store)
</script>

<template>
  <q-card class="my-card q-my-md">
    <q-card-section>
      <div class="text-h6">{{ $t('title') }}</div>
      <div class="text-subtitle2">{{ $t('balance') }}: {{ balance }} {{ currency }}</div>
    </q-card-section>
    <q-separator dark />
    <q-card-actions>
      <q-btn>{{ $t('incomes') }}: {{ getIncomes }} {{ currency }}</q-btn>
      <q-btn>{{ $t('expenses') }}: {{ getExpenses }} {{ currency }}</q-btn>
    </q-card-actions>
  </q-card>
</template>
