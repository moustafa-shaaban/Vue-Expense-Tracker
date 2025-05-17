<script setup>
import { ref, computed, watch } from 'vue';
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
const selectedTags = ref([])

const typeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Expenses', value: 'expenses' },
  { label: 'Incomes', value: 'incomes' },
]

// Compute tag options dynamically
const tagOptions = computed(() => {
  return selectedTag.value.map(tag => ({
    name: tag.name,
    value: tag.id,
    color: tag.color
  }))
  // const tags = new Set();
  // selectedTag.value.forEach(tag => tags.add(tag.name))
  // selectedTag.value.forEach(tag => tags.add(tag.name))
  // console.log(tags)
  // //transactions.value.forEach(t => t.tags.forEach(tag => tags.add(tag.name)));
  // return Array.from(tags);
});

const filteredRows = computed(() => {
  if (selectedType.value === 'incomes') {
    selectedTag.value = getIncomesTags.value
    return getIncomesList.value
  } else if (selectedType.value === 'expenses') {
    selectedTag.value = getExpensesTags.value
    return getExpensesList.value
  } else if (selectedTags.value.length > 0) {
    return transactions.value.filter(transaction =>
      transaction.tags.some(tag =>
        selectedTags.value.includes(tag.id)
      )
    )
  } else {
    selectedTag.value = tags.value
    return transactions.value
  }
})

// Group items by week, month, year, or custom period
/* const groupedItems = computed(() => {
  if (!groupBy.value) return null;

  const grouped = {};
  items.forEach((item) => {
    const date = new Date(item.dateAdded);
    let key;

    if (groupBy.value === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)
      key = `Week of ${weekStart.toLocaleDateString()}`;
    } else if (groupBy.value === 'month') {
      key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (groupBy.value === 'year') {
      key = date.getFullYear().toString();
    } else if (groupBy.value === 'custom') {
      if (!customDateRange.value.from || !customDateRange.value.to) return null;
      const fromDate = new Date(customDateRange.value.from);
      const toDate = new Date(customDateRange.value.to);
      if (date >= fromDate && date <= toDate) {
        key = `Custom Period: ${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`;
      } else {
        return; // Skip items outside the custom range
      }
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
}); */
</script>

<template>
  <q-page class="q-pa-md">

    <BalanceSummary />
    <div class=" col-lg-3 ">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Type Selector -->
            <div class="col-12 col-sm-4">
              <q-select v-model="selectedType" :options="typeOptions" label="Filter Transactions By Type" emit-value map-options class="q-mb-md" />
            </div>
            <!-- Tag Selector -->
            <div class="col-12 col-sm-4">
              <q-select v-model="selectedTags" :options="tagOptions" label="Filter Transactions By Tags" outlined
                multiple emit-value map-options use-chips>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="circle" :color="scope.opt.color" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <q-chip removable dense @remove="scope.removeAtIndex(scope.index)" :tabindex="scope.tabindex"
                    :color="scope.opt.color" text-color="white" class="q-ma-none">
                    {{ scope.opt.name }}
                  </q-chip>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
      </q-card>
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
