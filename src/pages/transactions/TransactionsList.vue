<script setup>
import { ref, computed } from 'vue';
import { date, Dialog, Notify } from 'quasar'

import BalanceSummary from "@/components/BalanceSummary.vue";
import { useTransactionsStore } from '@/stores/transactions';
import { storeToRefs } from 'pinia';

const transactionsStore = useTransactionsStore();

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
      transactionsStore.deleteTransaction(id);
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

const filter = ref('');
const columns = ref([
  {
    name: 'name',
    label: "Name",
    required: true,
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'Date', label: 'Date', field: row => date.formatDate(row.dateAdded, 'DD MMMM YYYY'), sortable: true },
  { name: 'Amount', label: 'Amount', field: row => row.amount, sortable: true },
])

// const transactions = computed(() => {
//   return transactionsStore.transactions
// })

const { transactions, getExpensesList, getIncomesList, tags, getExpensesTags, getIncomesTags } = storeToRefs(transactionsStore);

const selectedType = ref('all')
const selectedTag = ref(tags.value);
const tagItem = ref([])

const typeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Expenses', value: 'expenses' },
  { label: 'Incomes', value: 'incomes' },
]

const filteredRows = computed(() => {
  if (selectedType.value === 'incomes') {
    selectedTag.value = getIncomesTags.value
    return getIncomesList.value
  } else if (selectedType.value === 'expenses') {
    selectedTag.value = getExpensesTags.value
    return getExpensesList.value
  } else {
    selectedTag.value = tags.value
    return transactions.value

  }
})

</script>

<template>
  <q-page class="q-pa-md">

    <BalanceSummary />
    <div class=" col-lg-3 ">
      <q-select v-model="selectedType" :options="typeOptions" label="Filter Transactions By Type" emit-value map-options
        class="q-mb-md" />
      <!-- <q-select class="q-my-md" filled dense options-dense label="Tags" counter v-model="tagItem" :options="selectedTag"
        option-value="id" option-label="name" multiple use-chips map-options clearable>

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select> -->
    </div>
    <q-table grid flat bordered title="Transactions" :rows="filteredRows" :columns="columns" row-key="id"
      :filter="filter" no-data-label="No Transactions Found">

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card>
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">{{ date.formatDate(props.row.date, "YYYY-MM-DD") }}</div>
                </div>
                <div class="col-auto">
                  <q-badge side clickable rounded class="q-mx-xs" v-for="tag in props.row.tags" :key="tag.id"
                    :color="tag.color">
                    <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-details', params: { id: tag.id } }" />
                  </q-badge>
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable :to="{ name: 'transaction-details', params: { id: props.row.id } }">
                          <q-item-section>Details</q-item-section>
                        </q-item>
                        <q-item clickable :to="{ name: 'update', params: { id: props.row.id } }">
                          <q-item-section>Update</q-item-section>
                        </q-item>
                        <q-item clickable :to="{ name: 'clone', params: { id: props.row.id } }">
                          <q-item-section>Clone</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              {{ props.row.amount }} $
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat :to="{ name: 'transaction-details', params: { id: props.row.id } }">Details</q-btn>
              <q-btn size="sm" :to="{ name: 'update', params: { id: props.row.id } }" round icon="edit"
                color="primary" />
              <q-btn size="sm" @click="confirm(props.row.id)" round icon="delete" color="negative" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'create' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
