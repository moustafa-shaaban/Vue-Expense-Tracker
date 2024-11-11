<script setup>
import { useExpensesStore } from '@/stores/expenses';

const expensesStore = useExpensesStore();

const totalAmount = expensesStore.totalAmount;
</script>

<template>
  <h1>Home page</h1>
  <p>You have: $ {{ totalAmount }}</p>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'add-expense' }">
      </q-btn>
    </q-page-sticky>
</template>
