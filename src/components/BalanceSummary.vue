<script setup>
import { useTransactionsStore } from "@/stores/transactions"
const { balance, getIncomes, getExpenses } = useTransactionsStore()
</script>

<template>
    <q-card class="my-card q-my-md">
        <q-card-section>
            <div class="text-h6">Your Expenses</div>
            <div class="text-subtitle2">Balance: {{ balance }}</div>
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
            <q-btn>Income: {{ getIncomes }} $</q-btn>
            <q-btn>Expenses: {{ getExpenses }} $</q-btn>
        </q-card-actions>
    </q-card>
</template>