<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { nanoid } from 'nanoid';
import { Notify } from 'quasar';
import { useTransactionsStore } from '@/stores/transactions';
import Multiselect from 'vue-multiselect';

const transactionsStore = useTransactionsStore();

const transactionName = ref("");
const transactionAmount = ref("");
const transactionType = ref('');
const transactionDate = ref(Date.now())

const transactionValue = ref(false)

const tags = ref([]);
const transactionsTags = ref([]);

transactionsTags.value = transactionsStore.tags;

const router = useRouter();

function handleSubmit() {
    try {

        if (transactionValue.value) {
            transactionType.value = 'Income'
        } else {
            transactionType.value = 'Expense'
        }

        transactionsStore.addTransaction({
            id: nanoid(),
            name: transactionName.value,
            amount: transactionAmount.value,
            transactionValue: transactionValue.value,
            tags: tags.value,
            type: transactionType.value,
            dateAdded: transactionDate.value,
        })

        router.push('/');

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
</script>
<template>
    <q-page class="flex flex-center column q-my-lg">
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

                        <q-input filled v-model="transactionAmount" type="number" required label="Income Amount"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Income Amount is required']" />
                    </div>

                    <div v-else>
                        <q-input autocomplete filled v-model="transactionName" label="Expense Name" required lazy-rules
                            :rules="[val => val && val.length > 0 || 'Expense Name is required']" autofocus />

                        <q-input filled v-model="transactionAmount" type="number" required label="Expense Amount"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Expense Amount is required']" />
                    </div>
                    
                    <q-date name="dateAdded" v-model="transactionDate" minimal />
                    <!-- <q-toggle checked-icon="add" unchecked-icon="remove" color="blue" v-model="expenseValue" /> -->


                    <div class="q-my-md" v-if="transactionsStore.tags.length > 0"><label
                            class="typo__label">Tagging</label>
                        <multiselect class="q-my-md" v-model="tags" placeholder="Search" label="name" track-by="name"
                            :options="transactionsTags" :multiple="true" :taggable="true" :close-on-select="true"
                            :clear-on-select="false">
                        </multiselect>
                    </div>

                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <q-btn type="submit" fab icon="done" color="primary">
                        </q-btn>
                    </q-page-sticky>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<style lang="sass">
.form-card
  width: 100%
  max-width: 400px

.q-dark div,
.body--dark div
  .multiselect__tags
    background-color: rgb(24, 26, 27)
    color: white
  .multiselect__input
    background-color: rgb(24, 26, 27)
    color: white
  .multiselect__content-wrapper
      background-color: rgb(24, 26, 27)
      color: white
  .multiselect__placeholder
    color: white
</style>