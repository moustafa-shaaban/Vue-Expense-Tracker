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
  <q-page class="flex flex-center column q-my-lg">
    <q-list style="min-width: 350px">
      <div>
        <!-- <div>
          <p>You have {{ totalAmount }} $</p>
          <p>Total Incomes {{ totalIncomes }} $</p>
          <p>Total Expenses {{ totalExpenses }} $</p>
        </div> -->
        
        
        

        <h4>Available Expenses</h4>
        <div v-for="expense in expenses" :key="expense.id">
          <p>{{ expense.name }}</p>
          <p>{{ expense.amount }}</p>
        </div>

        <p>
          You have total -{{ expenses }} $ expenses
        </p>

        <h4>Available Incomes</h4>
        <!-- <div v-for="income in incomes" :key="income.id">
          <p>{{ income.name }}</p>
          <p>{{ income.amount }}</p>
        </div> -->

        <p>
          You have total {{ incomes }} $ incomes
        </p>
      </div>
      <q-item v-for="expense in transactions" :key="expense.id">
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

        <q-item-section side top>
          <q-item-label caption>{{ expense.amount }} LE</q-item-label>
        </q-item-section>
        <q-separator spaced inset />
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
