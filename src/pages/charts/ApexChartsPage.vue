<script setup>
import { computed } from "vue";
import { useTransactionsStore } from "../../stores/transactions";

import BalanceSummary from "../../components/BalanceSummary.vue";
const transactionsStore = useTransactionsStore();

let expensesMap = new Map();

const expenses = computed(() => {
  return transactionsStore.transactions.filter((transaction) => transaction.type === 'Expense')
})

// let expenses = transactionsStore.$state.transactions.filter((transaction) => transaction.type === 'Expense')

// attendees.forEach(function(attendee){
//    if(attendee.isArray()) {
//       attendee.forEach(function(subattendee) {
//          console.log(subattendee):
//       });
//    }
// });

const refreshPage = () => {
  window.location.reload(); // Reloads the current page
};
expenses.value.forEach(function (expense) {

  expense.tags.forEach(function (tag) {
    if (expensesMap.has(tag.name)) {
      const oldAmount = expensesMap.get(tag.name);
      expensesMap.set(tag.name, Math.abs(oldAmount) + Math.abs(expense.amount));
    } else {
      expensesMap.set(tag.name, Math.abs(expense.amount));
    }
  })
})

// const series = Array.from(expensesMap.values())
const series = Array.from(expensesMap.values())

const chartOptions = {
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: Array.from(expensesMap.keys()),
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      },
    }
  }]
}
</script>

<template>
  <q-page class="q-pa-md">
    <BalanceSummary />
    <q-pull-to-refresh @refresh="refreshPage">
      <apexchart width="500" type="pie" :options="chartOptions" :series="series"></apexchart>
    </q-pull-to-refresh>
  </q-page>
</template>
