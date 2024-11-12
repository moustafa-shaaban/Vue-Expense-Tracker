<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { nanoid } from 'nanoid';
import { Notify } from 'quasar';
import { useExpensesStore } from '@/stores/expenses';
import Multiselect from 'vue-multiselect';

const expensesStore = useExpensesStore();

const expenseName = ref("");
const expenseAmount = ref("");
const expenseValue = ref(false);

const tags = ref([]);
const expensesTags = ref([]);

expensesTags.value = expensesStore.tags;

function handleSubmit() {
    try {

        expensesStore.addExpense({
            id: nanoid(),
            name: expenseName.value,
            amount: expenseAmount.value,
            increase: expenseValue.value,
            tags: tags.value,
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
    <q-page class="flex flex-center column q-my-lg">
        <q-card flat bordered class="form-card">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6 q-mb-md">Add Expense</div>
                <q-space />
            </q-card-section>

            <q-card-section>
                <q-form @submit.prevent="handleSubmit">
            <q-input autocomplete filled v-model="expenseName" label="Expense Name" required lazy-rules
                :rules="[val => val && val.length > 0 || 'Expense Name is required']" autofocus />

            <q-input filled v-model="expenseAmount" type="number" required label="Expense Amount" lazy-rules
                :rules="[val => val && val.length > 0 || 'Expense Amount is required']" />
            <q-toggle v-model="expenseValue" />

            <div class="q-my-md" v-if="expensesStore.tags.length > 0"><label class="typo__label">Tagging</label>
            <multiselect 
              class="q-my-md" 
              v-model="tags" 
              placeholder="Search" 
              label="name" 
              track-by="name"
              :options="expensesTags" 
              :multiple="true" 
              :taggable="true"
              :close-on-select="true"
              :clear-on-select="false"
            >
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