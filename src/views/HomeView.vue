<script setup>
import { ref } from 'vue';
import { date } from 'quasar'

import { useTransactionsStore } from '@/stores/transactions';

const transactionsStore = useTransactionsStore();

const totalAmount = transactionsStore.totalAmount;

const transactions = transactionsStore.transactions;

const expenses = transactionsStore.getExpenses;
const incomes = transactionsStore.getIncomes;

const title = expenses.value

const totalIncomes = transactionsStore.totalIncomes;
const totalExpenses = transactionsStore.totalExpenses;

const filter = ref('');

const columns = [
  {
    name: 'name',
    label: "Name",
    required: true,
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  {name: 'Date', label: 'Date',field: row => date.formatDate(row.dateAdded, 'DD MMMM YYYY'), sortable: true},
  { name: 'Amount',label: 'Amount', field: row => row.amount, sortable: true },
  { name: 'Tags', label: 'Tags', field: row => row.tags.name },
  { name: 'delete', label: 'Actions' },
]

const rows = transactions;

function onClick() {
  // console.log('Clicked on a QChip')
}
</script>

<template>
  <q-page class="q-pa-md">
    <!-- <q-card class="my-card bg-primary text-white">
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
              <span>{{ date.formatDate(expense.dateAdded, 'DD MMMM YYYY') }}</span>
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

    </q-list> -->
    <!-- <h1>Home page</h1>
    <p>You have: $ {{ totalAmount }}</p> -->
    <q-table
      :grid="$q.screen.xs"
      flat bordered
      title="Transactions"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      
    >
    <template v-slot:bottom-left>
      <p>You have: $ {{ totalAmount }}</p>
        
      </template>
    
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        
      </template>
    </q-table>


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