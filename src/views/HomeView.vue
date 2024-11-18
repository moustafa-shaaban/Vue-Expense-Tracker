<script setup>
import { useTransactionsStore } from '@/stores/transactions';

const transactionsStore = useTransactionsStore();

const totalAmount = transactionsStore.totalAmount;

const transactions = transactionsStore.transactions;

const expenses = transactionsStore.getExpenses;
const incomes = transactionsStore.getIncomes;

const totalIncomes = transactionsStore.totalIncomes;
const totalExpenses = transactionsStore.totalExpenses;

function onClick() {
  // console.log('Clicked on a QChip')
}
</script>

<template>
  <q-page class="">
    <q-card class="my-card bg-primary text-white">
      <q-card-section>
        <div class="text-h6">Your Expenses</div>
        <div class="text-subtitle2">Balance: {{ totalAmount }}</div>
      </q-card-section>

      <q-card-section>
        Hello
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat>Income: {{ incomes }} $</q-btn>
        <q-btn flat>Expenses: {{ expenses }} $</q-btn>
      </q-card-actions>
    </q-card>
    <q-list bordered>
      <q-item clickable v-ripple v-for="expense in transactions" :key="expense.id">
        <q-item-section>
          <q-item-label>
            <div class="q-pa-md">
              {{ expense.name }}
              <q-chip v-for="tag in expense.tags" :key="tag.id" size="sm" clickable @click="onClick" color="primary"
                text-color="white" icon="event">
                {{ tag.name }}
              </q-chip>
            </div>
          </q-item-label>
        </q-item-section>

        <q-item-section avatar>
          <q-item-label caption>{{ expense.amount }} $</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
    <!-- <h1>Home page</h1>
    <p>You have: $ {{ totalAmount }}</p> -->

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'add-expense' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  
</style>