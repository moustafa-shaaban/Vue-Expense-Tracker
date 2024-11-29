<script setup>
import { date, Dialog, Notify } from 'quasar'

import { useTransactionsStore } from '@/stores/transactions';

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

// let groupedTransactions = transactionsStore.groups;

// const filter = ref('');

// const columns = [
//   {
//     name: 'name',
//     label: "Name",
//     required: true,
//     align: 'left',
//     field: row => row.name,
//     format: val => `${val}`,
//     sortable: true
//   },
//   { name: 'Date', label: 'Date', field: row => date.formatDate(row.dateAdded, 'DD MMMM YYYY'), sortable: true },
//   { name: 'Amount', label: 'Amount', field: row => row.amount, sortable: true },
//   { name: 'Tags', label: 'Tags', field: row => row.tags },
//   { name: 'delete', label: 'Actions' },
// ]

// const rows = transactions;

</script>

<template>
  <q-page class="q-pa-md">
    <q-card class="my-card q-my-md">
      <q-card-section>
        <div class="text-h6">Your Expenses</div>
        <div class="text-subtitle2">Balance: {{ transactionsStore.totalAmount }}</div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn>Income: {{ transactionsStore.getIncomes }} $</q-btn>
        <q-btn>Expenses: {{ transactionsStore.getExpenses }} $</q-btn>
      </q-card-actions>
    </q-card>

    <q-list>
      <q-item v-for="transaction in transactionsStore.transactions" :key="transaction.id">
        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">{{ transaction.name }}</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ date.formatDate(transaction.dateAdded, 'DD MMMM YYYY') }}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            <div v-if="transaction.tags.length > 1">
              <q-badge clickable rounded color="primary" class="q-mx-xs" v-for="tag in transaction.tags" :key="tag.id">
                <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-detail', params: { id: tag.id } }" />
              </q-badge>
            </div>
            <div v-else>
              <q-item-label caption lines="1">
                <q-badge clickable rounded color="primary" class="q-mx-xs">
                  <!-- <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-detail', params: { id: tag.id } }" /> -->
                  <q-breadcrumbs-el :label="transaction.tags.name" :to="{ name: 'tag-details', params: { id: transaction.tags.id } }" />
                </q-badge>
              </q-item-label>
            </div>
          </q-item-label>
          <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary">
            <span class="cursor-pointer">{{ transaction.amount }} $</span>
          </q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn clickable :to="{ name: 'transaction-details', params: { id: transaction.id } }" class="gt-xs"
              size="12px" flat dense round icon="edit" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="confirm(transaction.id)" />

            <!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- <q-table :grid="$q.screen.xs" flat bordered title="Transactions" :rows="rows" :columns="columns" row-key="id"
      :filter="filter">
      <template v-slot:bottom-left>
        <p>You have: $ {{ totalAmount }}</p>
      </template>

<template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
</q-input>

</template>
</q-table> -->

    <!-- <div>
      <q-list bordered class="rounded-borders">
        <q-expansion-item v-for="group in groupedTransactions" expand-separator icon="perm_identity"
          label="Account settings" caption="John Doe">
          <q-card v-for="item in group" :key="item.id">
            <q-card-section>
              {{ date.formatDate(item.dateAdded, 'DD MMMM YYYY') }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div> -->


    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'add-expense' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  
</style>