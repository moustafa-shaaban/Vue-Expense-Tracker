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
        <!-- Spurce: https://stackblitz.com/github/apertureless/vue-chartjs -->

        <q-dialog v-model="transactionForm" persistent>
            <q-card flat bordered class="form-card">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6 q-mb-md">Add Transaction</div>
                    <q-space />
                    <q-btn-toggle v-model="transactionValue" no-caps rounded unelevated toggle-color="primary" color="white"
                        text-color="primary" :options="[
                            { label: 'Expense', value: false },
                            { label: 'Income', value: true },
                        ]" />
                </q-card-section>

                <q-card-section>
                    <q-form @submit.prevent="handleSubmit">
                        <div v-if="transactionValue">
                            <q-input autocomplete filled v-model="transactionName" label="Income Name" required lazy-rules
                                :rules="[val => val && val.length > 0 || 'Income Name is required']" autofocus />

                            <q-input filled v-model.number="transactionAmount" type="number" required
                                label="Income Amount" />
                        </div>

                        <div v-else>
                            <q-input autocomplete filled v-model="transactionName" label="Expense Name" required lazy-rules
                                :rules="[val => val && val.length > 0 || 'Expense Name is required']" autofocus />

                            <q-input filled v-model.number="transactionAmount" type="number" required
                                label="Expense Amount" />
                        </div>

                        <q-btn icon="event" class="q-my-md" round color="primary">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="transactionDate">
                                    <div class="row items-center justify-end q-gutter-sm">
                                        <q-btn label="Cancel" color="primary" flat v-close-popup />
                                        <q-btn label="OK" color="primary" flat v-close-popup />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-btn>

                        <!-- <q-date name="dateAdded" v-model="transactionDate" minimal /> -->
                        <!-- <q-toggle checked-icon="add" unchecked-icon="remove" color="blue" v-model="expenseValue" /> -->

                        <q-select class="q-my-md" filled dense options-dense label="Tags" counter v-model="tags"
                            :options="transactionsTags" option-value="id" option-label="name" multiple use-chips map-options
                            clearable>

                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No results
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-card-actions align="right" class="text-primary">
                            <q-btn flat label="Cancel" v-close-popup />
                            <q-btn flat label="Add Transaction" type="submit" />
                        </q-card-actions>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" @click="transactionForm = true">
            </q-btn>
        </q-page-sticky>

    </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { nanoid } from 'nanoid';
import { Notify } from 'quasar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { useTransactionsStore } from "@/stores/transactions";

ChartJS.register(ArcElement, Tooltip, Legend)

const transactionsStore = useTransactionsStore();

const tab = ref('one');
const transactionForm = ref(false)

const transactionName = ref("");
const transactionAmount = ref("");
const transactionType = ref('');
const transactionDate = ref(Date.now())

const transactionValue = ref(false)

const tags = ref([]);
const transactionsTags = ref([]);

transactionsTags.value = transactionsStore.tags;

watch(transactionValue, () => {
    if (transactionValue.value) {
        transactionType.value = 'Income'
        transactionAmount.value = Math.abs(transactionAmount.value)
    } else {
        transactionType.value = 'Expense'
        transactionAmount.value = -Math.abs(transactionAmount.value)
    }
})

function handleSubmit() {
    try {

        if (transactionValue.value) {
            transactionType.value = 'Income'
        } else {
            transactionType.value = 'Expense'
            transactionAmount.value = -Math.abs(transactionAmount.value)
        }

        transactionsStore.addTransaction({
            id: nanoid(),
            name: transactionName.value,
            amount: transactionAmount.value,
            transactionValue: transactionValue.value,
            tags: tags.value,
            type: transactionType.value,
            dateAdded: transactionDate.value || Date.now(),
        })
        transactionForm.value = false;
        Notify.create({
            message: 'Transaction Added Successfully',
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