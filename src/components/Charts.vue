<template>
    <q-page class="q-pa-md">
        <q-card class="my-card q-my-md">
            <q-card-section>
                <div class="text-h6">Your Expenses</div>
                <div class="text-subtitle2">Balance: {{ transactionsStore.balance }}</div>
            </q-card-section>

            <q-separator dark />

            <q-card-actions>
                <q-btn>Income: {{ transactionsStore.getIncomes }} $</q-btn>
                <q-btn>Expenses: {{ transactionsStore.getExpenses }} $</q-btn>
            </q-card-actions>
        </q-card>

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
                    <div v-if="transactionsStore.transactions.length > 0">
                        <!-- <Pie :data="expensesAndIncomesData" :options="options" /> -->
                        <Pie :data="expensesChartData" :options="options" />
                    </div>
                    <div v-else>
                        <p>No Transactions Found</p>
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
        <!-- Spurce: https://stackblitz.com/github/apertureless/vue-chartjs -->



    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { useTransactionsStore } from "@/stores/transactions";

ChartJS.register(ArcElement, Tooltip, Legend)

const transactionsStore = useTransactionsStore();

const tab = ref('one')

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

// attendees.forEach(function(attendee){
//    if(attendee.isArray()) {
//       attendee.forEach(function(subattendee) {
//          console.log(subattendee):
//       });
//    }
// });

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


// expenses.forEach(({ tags, amount }) => {
//     if (expensesMap.has(tags.name)) {
//         const oldAmount = expensesMap.get(tags.name);
//         expensesMap.set(tags.name, oldAmount + amount);
//     } else {
//         expensesMap.set(tags.name, amount);
//     }
// });

// console.log(expensesMap)


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

<style lang="sass" scoped>
.my-card
  width: 100%
</style>