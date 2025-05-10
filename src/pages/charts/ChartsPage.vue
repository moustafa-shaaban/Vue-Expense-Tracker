<script setup>
import { ref, watch } from 'vue'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import BalanceSummary from "@/components/BalanceSummary.vue";
import { useTransactionsStore } from "@/stores/transactions";

ChartJS.register(ArcElement, Tooltip, Legend)

const transactionsStore = useTransactionsStore();

const tab = ref('one');
const transactionsTags = ref([]);

transactionsTags.value = transactionsStore.tags;

const expensesAndIncomesData = {
    labels: ['Incomes', 'Expenses'],
    datasets: [
        {
            backgroundColor: ['Blue', 'Red'],
            data: [transactionsStore.getIncomes.value, transactionsStore.getExpenses.value],
        }
    ]
}


// Source: https://youtu.be/hqTQ4Dlswco
let expensesMap = new Map();

let expenses = transactionsStore.$state.transactions.filter((transaction) => transaction.type === 'Expense')


expenses.forEach(function (expense) {

    expense.tags.forEach(function (tag) {
        if (expensesMap.has(tag.name)) {
            const oldAmount = expensesMap.get(tag.name);
            expensesMap.set(tag.name, oldAmount + expense.amount);
        } else {
            expensesMap.set(tag.name, expense.amount);
        }
    })
})


const expensesChartData = {
    labels: Array.from(expensesMap.keys()),
    datasets: [
        {
            data: Array.from(expensesMap.values()),
            backgroundColor: ['Blue', 'Red'],
        }
    ]
}

const options = {
    responsive: true,
    maintainAspectRatio: false
}

</script>

<template>
    <q-page class="q-pa-md">
        <BalanceSummary />
        <q-card class="my-card" flat bordered>
            <q-card-section>
                <div class="text-h6">Data Pie Charts</div>
                <div class="text-subtitle2">This section of the app has pie charts that visualize the available transactions
                    in your data</div>
                <div class="text-subtitle2">Currently it has two sections, Visualizng Incomes and Expenses, and Visualizing
                    Expenses by tags</div>
            </q-card-section>

            <q-tabs v-model="tab" class="text-teal">
                <q-tab label="Expenses By Tags" name="one" />
                <q-tab label="Expenses and Incomes" name="two" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="one">
                    <div v-if="expenses.length > 0">
                        <!-- <Pie :data="expensesAndIncomesData" :options="options" /> -->
                        <Pie :data="expensesChartData" :options="options" />
                    </div>
                    <div v-else>
                        <p>No Expenses Found</p>
                    </div>
                </q-tab-panel>

                <q-tab-panel name="two">
                    <div v-if="transactionsStore.transactions.length > 0">
                        <!-- <Pie :data="expensesAndIncomesData" :options="options" /> -->
                        <Pie :data="expensesAndIncomesData" :options="options" />
                    </div>
                    <div v-else>
                        <p>No Transactions Found</p>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" :to="{ name: 'create-transaction' }">
            </q-btn>
        </q-page-sticky>

    </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>