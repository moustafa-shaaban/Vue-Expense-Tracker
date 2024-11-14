<script setup>
import { useExpensesStore } from '@/stores/expenses';

const expensesStore = useExpensesStore();

const totalAmount = expensesStore.totalAmount;

const expenses = expensesStore.expenses;

function onClick () {
        // console.log('Clicked on a QChip')
}
</script>

<template>
  <q-page class="flex flex-center column q-my-lg">
    <q-list style="min-width: 350px">
      <q-item v-for="expense in expenses" :key="expense.id">
        <q-item-section>
          <q-item-label>
            <div class="q-pa-md">
              {{ expense.name }}
              <q-chip v-for="tag in expense.tags" :key="tag.id" size="sm" clickable @click="onClick" color="primary" text-color="white" icon="event">
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
