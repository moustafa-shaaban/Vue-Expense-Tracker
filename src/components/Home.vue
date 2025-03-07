<script setup>
import { ref, onMounted, computed } from 'vue';
import { date, Dialog, Notify, exportFile, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
import { useTransactionsStore } from '../stores/transactions';
import { wrapCsvValue } from '@/utils/utils';

const transactionsStore = useTransactionsStore();

const $q = useQuasar()
// Initialize dark mode from localStorage
const rtl = localStorage.getItem('locale') === 'ar';
console.log(rtl)
const confirmDialog = ref(false)

function deleteTransaction(id) {
  try {
    transactionsStore.deleteTransaction(id);
    confirmDialog.value = false
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
}

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
  // { name: 'Tags', label: 'Tags', field: row => row.tags },
]

const rows = transactionsStore.transactions;



function exportTable() {
  // naive encoding to csv format
  const content = [columns.map(col => wrapCsvValue(col.label))].concat(
    rows.map(row => columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

</script>

<template>
  <q-page class="q-pa-md">
    <q-card class="my-card q-my-md">
      <q-card-section>
        <div class="text-h6">{{ $t('yourExpenses') }}</div>
        <div class="text-subtitle2">{{ $t('balance') }}: {{ transactionsStore.balance }}</div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn>{{ $t('income') }}: {{ transactionsStore.getIncomes }} $</q-btn>
        <q-btn>{{ $t('expenses') }}: {{ transactionsStore.getExpenses }} $</q-btn>
      </q-card-actions>
    </q-card>

    <q-table grid flat bordered :title="$t('transactions')" :rows="rows" :columns="columns" row-key="id"
      :filter="filter" :no-data-label="$t('noTransactions')" :dir="rtl ? rtl : 'ltr'">

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn color="primary" icon-right="archive" no-caps @click="exportTable">
          {{ $t('exportToCSV') }}
        </q-btn>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card>
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">{{ date.formatDate(props.row.dateAdded, "YYYY-MM-DD") }}</div>
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
                          <q-item-section>{{ $t('details') }}</q-item-section>
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
              <q-btn flat :to="{ name: 'transaction-details', params: { id: props.row.id } }">{{ $t('details')
              }}</q-btn>
              <q-btn flat @click="confirmDialog = true">{{ $t('delete') }}</q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <q-dialog v-model="confirmDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm">{{ $t('confirm') }}</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
              <q-btn flat :label="$t('delete')" color="red" @click="deleteTransaction(props.row.id)" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
    </q-table>


    <!-- <q-list v-if="transactionsStore.transactions.length">
      <q-item v-for="transaction in transactionsStore.transactions" :key="transaction.id" clickable v-ripple>
        <q-item-section avatar>
          <q-badge side clickable rounded color="primary" class="q-mx-xs" v-for="tag in transaction.tags" :key="tag.id">
            <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-details', params: { id: tag.id } }" />
          </q-badge>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">{{ transaction.name }}</q-item-label>
          <q-item-label caption lines="2">
            <span class="text-weight-bold">{{ transaction.amount }} $</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          {{ date.formatDate(transaction.dateAdded, 'DD MMMM YYYY') }}
        </q-item-section>
        <q-item-section side bottom>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn clickable :to="{ name: 'transaction-details', params: { id: transaction.id } }" class="gt-xs"
              size="12px" flat dense round icon="edit" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="confirm(transaction.id)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <p v-else>
      No Transactions Found. Click on the plus sign to add a new one
    </p> -->

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