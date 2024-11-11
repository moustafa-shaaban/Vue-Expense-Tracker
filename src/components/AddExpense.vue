<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { nanoid } from 'nanoid';
import { Notify } from 'quasar';
import { useExpensesStore } from '@/stores/expenses';

const expensesStore = useExpensesStore();

const expenseName = ref("");
const expenseAmount = ref("");
const expenseValue = ref(false);

function handleSubmit() {
    try {

        expensesStore.addExpense({
            id: nanoid(),
            name: expenseName.value,
            amount: expenseAmount.value,
            increase: expenseValue.value,
            dateAdded: Date.now()
        })

        Notify.create({
            message: 'Note Added Successfully',
            type: "positive",
            actions: [
                { icon: 'close', color: 'white', round: true, }
            ]
        })

    } catch (error) {
        Notify.create({
            message: error.message,
            type: "negative",
            actions: [
                { icon: 'close', color: 'white', round: true, }
            ]
        })
    }
}
</script>
<template>
    <div>
        <h1>Add Expense</h1>
        <q-form @submit.prevent="handleSubmit">
            <q-input autocomplete filled v-model="expenseName" label="Expense Name" required lazy-rules
                :rules="[val => val && val.length > 0 || 'Expense Name is required']" autofocus />

            <q-input filled v-model="expenseAmount" type="number" required label="Expense Amount" lazy-rules
                :rules="[val => val && val.length > 0 || 'Expense Amount is required']" />
            <q-toggle v-model="expenseValue" />

            <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn type="submit" fab icon="done" color="primary">
                </q-btn>
            </q-page-sticky>
        </q-form>
    </div>
</template>

<style></style>