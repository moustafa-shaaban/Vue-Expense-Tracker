<script setup>
import { subWeeks, subMonths, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parse, format, startOfToday } from "date-fns";
import { useTransactionsStore } from 'src/stores/transactions';
import { computed, ref } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { colors } from 'quasar'
import { storeToRefs } from "pinia";

const { getPaletteColor } = colors

ChartJS.register(ArcElement, Tooltip, Legend)
const transactionsStore = useTransactionsStore();

const { transactions } = storeToRefs(transactionsStore)

const filterType = ref('All Transactions');
const filterTypes = ['All Transactions', 'thisWeek', 'thisMonth', 'lastWeek', 'lastMonth', 'lastYear', 'specific', 'range'];
const specificDate = ref('');
const startDate = ref('');
const endDate = ref('');

const filteredTransactions = computed(() => {
  const now = new Date();
  return transactions.value.filter((transaction) => {
    const transactionDate = parse(
      transaction.date,
      "yyyy/MM/dd",
      new Date()
    );

    switch (filterType.value) {
      // I wrote this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      case "thisMonth": {
        const thisMonthStart = startOfMonth(now);
        const today = startOfToday();
        return isWithinInterval(transactionDate, {
          start: thisMonthStart,
          end: today,
        });
      }

      // I wrote this too !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      case "thisWeek": {
        const thisWeekStart = startOfWeek(now);
        const thisWeekTilltoday = startOfToday();
        return isWithinInterval(transactionDate, {
          start: thisWeekStart,
          end: thisWeekTilltoday,
        });
      }

      case "lastWeek": {
        const lastWeekStart = startOfWeek(subWeeks(now, 1));
        const lastWeekEnd = endOfWeek(subWeeks(now, 1));
        return isWithinInterval(transactionDate, {
          start: lastWeekStart,
          end: lastWeekEnd,
        });
      }

      case "lastMonth": {
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        return isWithinInterval(transactionDate, {
          start: lastMonthStart,
          end: lastMonthEnd,
        });
      }

      case "lastYear": {
        const lastYearStart = startOfYear(subYears(now, 1));
        const lastYearEnd = endOfYear(subYears(now, 1));
        return isWithinInterval(transactionDate, {
          start: lastYearStart,
          end: lastYearEnd,
        });
      }

      case "specific": {
        if (!specificDate.value) return true;
        const specific = parse(
          specificDate.value,
          "yyyy-MM-dd",
          new Date()
        );
        return (
          format(transactionDate, "yyyy-MM-dd") ===
          format(specific, "yyyy-MM-dd")
        );
      }

      case "range": {
        if (!startDate.value || !endDate.value) return true;
        const start = parse(
          startDate.value,
          "yyyy-MM-dd",
          new Date()
        );
        const end = parse(endDate.value, "yyyy-MM-dd", new Date());
        return isWithinInterval(transactionDate, { start, end });
      }

      default:
        return true;
    }
  });
});

// Compute expensesByTag based on filteredTransactions
const expensesByTag = computed(() => {
  return filteredTransactions.value.reduce((acc, expense) => {
    expense.tags.forEach(tag => {
      if (!acc[tag.name]) {
        acc[tag.name] = { amount: 0, color: getPaletteColor(tag.color), name: tag.name };
      }
      acc[tag.name].amount += expense.amount;
    });
    return acc;
  }, {});
});

// Compute expensesChartData based on expensesByTag
const expensesChartData = computed(() => {
  return {
    labels: Object.values(expensesByTag.value).map(expense => expense.name),
    datasets: [
      {
        data: Object.values(expensesByTag.value).map(expense => expense.amount),
        backgroundColor: Object.values(expensesByTag.value).map(expense => expense.color),
        borderColor: Object.values(expensesByTag.value).map(expense => expense.color),
        borderWidth: 1
      }
    ]
  };
});

// Chart options (unchanged)
const options = {
  responsive: true,
  maintainAspectRatio: false
};

// const expensesByTag = filteredTransactions.value.reduce((acc, expense) => {
//   expense.tags.forEach(tag => {
//     if (!acc[tag.name]) {
//       acc[tag.name] = { amount: 0, color: getPaletteColor(tag.color), name: tag.name };
//     }
//     acc[tag.name].amount += expense.amount;
//   })
//   return acc;
// }, {});

// const expensesChartData = {
//   labels: Object.values(expensesByTag).map(expense => expense.name),
//   datasets: [
//     {
//       data: Object.values(expensesByTag).map(expense => expense.amount),
//       backgroundColor: Object.values(expensesByTag).map(expense => expense.color),
//       borderColor: Object.values(expensesByTag).map(expense => expense.color),
//       borderWidth: 1
//     }
//   ]
// }

// const options = {
//   responsive: true,
//   maintainAspectRatio: false
// }

const filterTitle = computed(() => {
  const now = new Date();
  switch (filterType.value) {
    case "thisMonth":
      return `Transactions for This Month (${format(
        startOfMonth(now),
        "MMMM yyyy"
      )})`;
    case "thisWeek":
      return `Transactions for This Week (${format(
        startOfWeek(now),
        "MMM d"
      )} - ${format(startOfToday(), "MMM d, yyyy")})`;
    case "lastWeek":
      return `Transactions for Last Week (${format(
        startOfWeek(subWeeks(now, 1)),
        "MMM d"
      )} - ${format(endOfWeek(subWeeks(now, 1)), "MMM d, yyyy")})`;
    case "lastMonth":
      return `Transactions for Last Month (${format(
        startOfMonth(subMonths(now, 1)),
        "MMMM yyyy"
      )})`;
    case "lastYear":
      return `Transactions for Last Year (${format(
        startOfYear(subYears(now, 1)),
        "yyyy"
      )})`;
    case "specific":
      if (!specificDate.value) return "Transactions for All Dates";
      return `Transactions for ${format(
        parse(specificDate.value, "yyyy-MM-dd", new Date()),
        "MMMM d, yyyy"
      )}`;
    case "range":
      if (!startDate.value || !endDate.value)
        return "Transactions for All Dates";
      return `Transactions from ${format(
        parse(startDate.value, "yyyy-MM-dd", new Date()),
        "MMM d, yyyy"
      )} to ${format(
        parse(endDate.value, "yyyy-MM-dd", new Date()),
        "MMM d, yyyy"
      )}`;
    default:
      return "All Transactions";
  }
});
</script>

<template>
  <q-page class="q-pa-md">
    <q-select v-model="filterType" :options="filterTypes" label="Filter Data By Date" />
    <div v-if="transactions.length > 0" style="width: 500px; height: 500px;">
      <h2>{{ filterTitle }}</h2>
      <Pie :data="expensesChartData" :options="options" />
    </div>
    <div v-else>
      <p>{{ $t('noData') }}</p>
    </div>
  </q-page>
</template>
