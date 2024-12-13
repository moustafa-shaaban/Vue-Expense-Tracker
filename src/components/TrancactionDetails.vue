<script setup>
import { ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dialog, date, Notify } from 'quasar';
import Multiselect from 'vue-multiselect';

import { useTransactionsStore } from '../stores/transactions';

const transactionsStore = useTransactionsStore();
const route = useRoute();
const router = useRouter();

// const transaction = structuredClone(toRaw(
//     transactionsStore.transactions.find((item) => item.id === route.params.id)
// ))

const transactionsTags = ref([]);

transactionsTags.value = transactionsStore.tags;

const transaction = JSON.parse(JSON.stringify(
    transactionsStore.transactions.find((item) => item.id === route.params.id)
))
const testTransaction = ref([]);

testTransaction.value = transaction


// console.log(testTransaction)
// console.log(transaction)

const isEditing = ref(false);

// const transactionEditForm = ref({
//     id: '',
//     name: '',
//     amount: '',
//     type: '',
//     dateAdded: '',
//     tags: [],
// });

const transactionTags = ref([]);

transactionTags.value = transactionsStore.tags;

// transaction.value = transactionsStore.getTransactionById(route.params.id);

const transactionValue = ref(false)

if (testTransaction.value.type == 'Income') {
    transactionValue.value = true
}

watch(transactionValue, () => {
    if (transactionValue.value) {
        testTransaction.value.type = 'Income'
        testTransaction.value.amount = Math.abs(transaction.value.amount)
    } else {
        testTransaction.value.type = 'Expense'
        testTransaction.value.amount = -Math.abs(transaction.value.amount)
    }
})


function handleSubmit() {
    try {
        transactionsStore.updateTransaction(route.params.id, testTransaction.value);
        isEditing.value = false;
        Notify.create({
            message: 'transaction Updated Successfully',
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
};

function confirm(id) {
    Dialog.create({
        dark: true,
        title: 'Confirm',
        color: 'primary',
        message: 'Are you sure you want to delete this transaction?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        try {
            transactionsStore.deleteTransaction(id)
            router.push('/');
            Notify.create({
                message: 'Transaction Deleted Successfully',
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
    })
};

</script>

<template>
    <q-page class="flex flex-center">
        <q-card v-if="isEditing" flat bordered class="my-card">
            <q-card-section class="row items-center q-pb-none q-mb-md" vertical>
                <div class="text-h6">Edit transaction</div>
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
                        <q-input autocomplete filled v-model="testTransaction.name" label="Income Name" required lazy-rules
                            :rules="[val => val && val.length > 0 || 'Income Name is required']" autofocus />

                        <q-input filled v-model.number="testTransaction.amount" type="number" required
                            label="Income Amount" />
                    </div>

                    <div v-else>
                        <q-input autocomplete filled v-model="testTransaction.name" label="Expense Name" required lazy-rules
                            :rules="[val => val && val.length > 0 || 'Expense Name is required']" autofocus />

                        <q-input filled v-model.number="testTransaction.amount" type="number" required
                            label="Expense Amount" />
                    </div>

                    <q-btn icon="event" class="q-my-md" round color="primary">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="testTransaction.dateAdded">
                                <div class="row items-center justify-end q-gutter-sm">
                                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                                    <q-btn label="OK" color="primary" flat v-close-popup />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-btn>

                    <q-select class="q-my-md" filled v-model="testTransaction.tags" :options="transactionsTags"
                        option-value="id" option-label="name" multiple use-chips map-options>
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    No results
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <!-- <div class="q-my-md"><label class="typo__label"
                            v-if="transactionsStore.tags.length > 0">Tagging</label>
                        <multiselect class="q-my-md" v-model="transaction.tags" placeholder="Search" label="name"
                            track-by="name" :options="transactionTags" :multiple="true" :close-on-select="false"
                            :clear-on-select="false">
                        </multiselect>
                    </div> -->

                    <q-separator />

                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <q-btn type="submit" fab icon="done" color="primary">
                        </q-btn>
                    </q-page-sticky>
                </q-form>
            </q-card-section>

            <q-page-sticky position="bottom-left" :offset="[18, 18]">
                <q-btn @click="isEditing = false" fab icon="undo" color="negative">
                </q-btn>
            </q-page-sticky>
        </q-card>


        <q-card v-else class="my-card q-mt-md" flat bordered>
            <q-card-section>
                <div class="row items-center no-wrap">
                    <div class="col">
                        <div class="text-h6">{{ transaction.name }}</div>
                        <div class="text-subtitle2">
                            {{ date.formatDate(transaction.dateAdded, 'DD MMMM YYYY') }}
                        </div>
                        <q-item-label caption lines="1">
                            <div>
                                <q-badge clickable rounded color="primary" class="q-mx-xs" v-for="tag in transaction.tags"
                                    :key="tag.id">
                                    <q-breadcrumbs-el :label="tag.name"
                                        :to="{ name: 'tag-details', params: { id: tag.id } }" />
                                </q-badge>
                            </div>
                        </q-item-label>
                    </div>
                </div>
            </q-card-section>

            <q-separator dark inset />

            <q-card-section horizontal>
                <q-card-section>
                    {{ transaction.amount }}
                </q-card-section>
            </q-card-section>

            <q-separator />

            <q-card-actions>
                <q-btn color="primary" type="button" size="sm" @click="isEditing = true">Edit</q-btn>
                <q-btn color="negative" type="button" size="sm" @click="confirm(transaction.id)">Delete</q-btn>
            </q-card-actions>
        </q-card>

        <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn :to="{ 'name': 'home' }" fab icon="undo" color="negative">
            </q-btn>
        </q-page-sticky>
    </q-page>
</template>



<style lang="sass" scoped>
.my-card
  width: 100%
  width: 350px
</style>