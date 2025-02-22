<script setup>
import { ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { nanoid } from 'nanoid';
import { Notify } from 'quasar';
import { useTransactionsStore } from '../stores/transactions';
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

// const options = ref(transactionsTags.value)

const router = useRouter();

// function filterFunction(val, update, abort) {
//     update(() => {
//         const needle = val.toLowerCase()
//         options.value = tags.filter(v => v.toLowerCase().indexOf(needle) > -1)
//     })
// }

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
    <q-page :dir="$q.lang.rtl ? 'rtl' : 'ltr'" class="flex flex-center column q-my-lg">
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

                    <!-- <div class="q-my-md" v-if="transactionsStore.tags.length > 0"><label
                            class="typo__label">Tagging</label>
                        <multiselect class="q-my-md" v-model="tags" placeholder="Search" label="name" track-by="id"
                            :options="transactionsTags" :close-on-select="true" :clear-on-select="false">
                        </multiselect>
                    </div> -->

                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <q-btn type="submit" fab icon="done" color="primary">
                        </q-btn>
                    </q-page-sticky>
                </q-form>
            </q-card-section>
        </q-card>
        <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn type="submit" fab icon="arrow_back" :to="{ name: 'home' }" color="negative">
            </q-btn>
        </q-page-sticky>
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