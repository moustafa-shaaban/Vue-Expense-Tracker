<script setup>
import { ref, computed } from 'vue';
import { date, Dialog, Notify } from 'quasar'

import { useTransactionsStore } from '../stores/transactions';

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

const filter = ref('');

const columns = [
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
  //{ name: 'Tags', label: 'Tags', field: row => row.tags },
]

const transactions = computed(() => {
  return transactionsStore.transactions
})

const rows = transactions

</script>

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

    <q-table grid flat bordered title="Transactions" :rows="rows" :columns="columns" row-key="id" :filter="filter"
      no-data-label="No Transactions Found">

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
                  <div class="text-subtitle2">{{ date.formatDate(props.row.dateAdded, "YYYY-MM-DD") }}</div>
                  <!-- <q-item-label caption>
                    <div>
                      <q-badge side clickable rounded color="primary" class="q-mx-xs" v-for="tag in props.row.tags"
                        :key="tag.id">
                        <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-details', params: { id: tag.id } }" />
                      </q-badge>
                    </div>
                  </q-item-label> -->
                </div>
                <div class="col-auto">
                  <q-badge side clickable rounded color="primary" class="q-mx-xs" v-for="tag in props.row.tags"
                    :key="tag.id">
                    <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-details', params: { id: tag.id } }" />
                  </q-badge>
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable :to="{ name: 'transaction-details', params: { id: props.row.id } }">
                          <q-item-section>Details</q-item-section>
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
              <q-btn flat @click="confirm(props.row.id)">Delete</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>


    </q-table>

    <!-- <q-list v-if="transactionsStore.transactions.length">
      <q-item v-for="transaction in transactionsStore.transactions" :key="transaction.id">
        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">{{ transaction.name }}</q-item-label>
        </q-item-section>

        <q-item-section top>

          <q-item-label lines="1">
            <span class="text-weight-medium">{{ date.formatDate(transaction.dateAdded, 'DD MMMM YYYY') }}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            <div>
              <q-badge clickable rounded color="primary" class="q-mx-xs" v-for="tag in transaction.tags" :key="tag.id">
                <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-details', params: { id: tag.id } }" />
              </q-badge>
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

            <q-btn size="12px" flat dense round icon="more_vert" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <p v-else>
      No Transactions Found. Click on the plus sign to add a new one
    </p> 
  -->
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
      <q-btn fab icon="add" color="primary" :to="{ name: 'add-transaction' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>