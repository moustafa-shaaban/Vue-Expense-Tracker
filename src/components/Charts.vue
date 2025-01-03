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
        <!-- Spurce: https://stackblitz.com/github/apertureless/vue-chartjs -->
        <div v-if="transactionsStore.transactions.length > 0">
            <Pie :data="data" :options="options" />
        </div>
        <div v-else>
            <p>No Transactions Found</p>
        </div>
    </q-page>

</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { useTransactionsStore } from "@/stores/transactions";

ChartJS.register(ArcElement, Tooltip, Legend)

const transactionsStore = useTransactionsStore();

const slide = ref('style')

const data = {
    labels: ['Incomes', 'Expenses'],
    datasets: [
        {
            backgroundColor: ['Blue', 'Red'],
            data: [transactionsStore.getIncomes.value, transactionsStore.getExpenses.value],
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