<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import BalanceSummary from "../../components/BalanceSummary.vue";
import { useTransactionsStore } from "../../stores/transactions";
import { colors } from 'quasar'
import { storeToRefs } from 'pinia';

const { getPaletteColor } = colors

ChartJS.register(ArcElement, Tooltip, Legend)

const transactionsStore = useTransactionsStore();

const { getExpensesList } = storeToRefs(transactionsStore)

const tab = ref('one');

const expensesByTag = transactionsStore.getExpensesList.reduce((acc, expense) => {
  expense.tags.forEach(tag => {
    if (!acc[tag.name]) {
      acc[tag.name] = { amount: 0, color: getPaletteColor(tag.color), name: tag.name };
    }
    acc[tag.name].amount += expense.amount;
  })
  return acc;
}, {});

const expensesChartData = {
  labels: Object.values(expensesByTag).map(expense => expense.name),
  datasets: [
    {
      data: Object.values(expensesByTag).map(expense => expense.amount),
      backgroundColor: Object.values(expensesByTag).map(expense => expense.color),
      borderColor: Object.values(expensesByTag).map(expense => expense.color),
      borderWidth: 1
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false
}

const expensesAndIncomesData = {
  labels: ['Incomes', 'Expenses'],
  datasets: [
    {
      backgroundColor: [getPaletteColor('positive'), 'Red'],
      data: [transactionsStore.getIncomes.value, transactionsStore.getExpenses.value],
    }
  ]
}

</script>

<template>
  <q-page class="q-pa-md">
    <BalanceSummary />
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ $t('charts') }}</div>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab :label="$t('expensesByTags')" name="one" />
        <q-tab :label="$t('expensesandIncomes')" name="two" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one">
          <div v-if="getExpensesList.length > 0">
            <Pie :data="expensesChartData" :options="options" />
          </div>
          <div v-else>
            <p>{{ $t('noData') }}</p>
          </div>
        </q-tab-panel>

        <q-tab-panel name="two">
          <div v-if="transactionsStore.transactions.length > 0">
            <Pie :data="expensesAndIncomesData" :options="options" />
          </div>
          <div v-else>
            <p>{{ $t('noData') }}</p>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
