<script setup>
import { ref, computed, onMounted } from 'vue';
import { Dialog, Notify } from 'quasar'
import { parse, format, startOfWeek, endOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';
import BalanceSummary from "../../components/BalanceSummary.vue";
import { useTransactionsStore } from '../..//stores/transactions';
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

const { transactions, tags } = storeToRefs(transactionsStore);
const selectedTag = ref(tags.value);

const tagOptions = computed(() => {
  return selectedTag.value.map(tag => ({
    name: tag.name,
    value: tag.id,
    color: tag.color
  }))
});


const searchQuery = ref('');
const selectedTags = ref([]);
const groupBy = ref('Month');
const customStartDate = ref('2024-01-01');
const customEndDate = ref('2025-12-31');
const groupedTransactions = ref([]);
// const selectedType = ref(null)
// const groupBy = computed({
//   get: () => transactionsStore.groupBy,
//   set: (val) => transactionsStore.setGroupBy(val),
// })
const dateRange = ref({ start: '', end: '' })

const groupByOptions = ['Day', 'Week', 'Month', 'Year', 'Custom Range'];

const updateGrouping = () => {
  if (!transactions.value || !Array.isArray(transactions.value)) {
    groupedTransactions.value = [];
    return;
  }

  // Filter transactions based on search query and selected tags
  const filteredTransactions = transactions.value.filter(transaction => {
    if (!transaction || !transaction.date) return false;

    // Search filter
    const query = searchQuery.value ? searchQuery.value.toLowerCase().trim() : '';
    const matchesSearch = !query || (
      (transaction.name && transaction.name.toLowerCase().includes(query)) ||
      (transaction.date && transaction.date.toLowerCase().includes(query)) ||
      (transaction.amount && transaction.amount.toString().includes(query)) ||
      (transaction.tags && transaction.tags.some(tag => tag.name && tag.name.toLowerCase().includes(query)))
    );

    // Tag filter
    const matchesTags = selectedTags.value.length === 0 || transaction.tags.some(tag =>
      selectedTags.value.includes(tag.id)
    )

    return matchesSearch && matchesTags;
  });

  const grouped = {};
  filteredTransactions.forEach(transaction => {
    const date = parse(transaction.date, 'yyyy/MM/dd', new Date());
    let key, baseLabel;

    switch (groupBy.value) {
      case 'Day':
        key = format(date, 'yyyy-MM-dd');
        baseLabel = key;
        break;
      case 'Week':
        key = `${format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd')} to ${format(endOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd')}`;
        baseLabel = key;
        break;
      case 'Month':
        key = format(startOfMonth(date), 'yyyy-MM');
        baseLabel = key;
        break;
      case 'Year':
        key = format(startOfYear(date), 'yyyy');
        baseLabel = key;
        break;
      case 'Custom Range': {
        const start = parse(customStartDate.value, 'yyyy-MM-dd', new Date());
        const end = parse(customEndDate.value, 'yyyy-MM-dd', new Date());
        if (isWithinInterval(date, { start, end })) {
          key = `${customStartDate.value} to ${customEndDate.value}`;
          baseLabel = key;
        } else {
          return;
        }
        break;
      }
    }

    if (!grouped[key]) {
      grouped[key] = { label: baseLabel, transactions: [], startDate: date };
    }
    grouped[key].transactions.push(transaction);
  });

  // Update labels with transaction count and totals
  groupedTransactions.value = Object.values(grouped)
    .map(group => {
      // Sort transactions within group (newest first)
      group.transactions.sort((a, b) =>
        parse(b.date, 'yyyy/MM/dd', new Date()).getTime() -
        parse(a.date, 'yyyy/MM/dd', new Date()).getTime()
      );

      // Calculate totals
      const transactionCount = group.transactions.length;
      const income = group.transactions
        .filter(t => t.amount >= 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = group.transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);

      // Update label
      group.label = `${group.label} (${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}, Income: $${income}, Expenses: $${expenses})`;

      return group;
    })
    .sort((a, b) => {
      let dateA, dateB;
      switch (groupBy.value) {
        case 'Day':
          dateA = parse(a.label.split(' (')[0], 'yyyy-MM-dd', new Date());
          dateB = parse(b.label.split(' (')[0], 'yyyy-MM-dd', new Date());
          break;
        case 'Week':
        case 'Custom Range':
          dateA = parse(a.label.split(' (')[0].split(' to ')[0], 'yyyy-MM-dd', new Date());
          dateB = parse(b.label.split(' (')[0].split(' to ')[0], 'yyyy-MM-dd', new Date());
          break;
        case 'Month':
          dateA = parse(a.label.split(' (')[0], 'yyyy-MM', new Date());
          dateB = parse(b.label.split(' (')[0], 'yyyy-MM', new Date());
          break;
        case 'Year':
          dateA = parse(a.label.split(' (')[0], 'yyyy', new Date());
          dateB = parse(b.label.split(' (')[0], 'yyyy', new Date());
          break;
      }
      return dateB.getTime() - dateA.getTime();
    });
};

// Initialize
onMounted(() => {
  updateGrouping();
});

// Filtered Data
// const filteredData = computed(() => {
//   return transactions.value.filter(transaction => {
//     const tagMatch = selectedTags.value.length === 0 || transaction.tags.some(tag =>
//       selectedTags.value.includes(tag.id)
//     )
//     const typeMatch = !selectedType.value || transaction.type === selectedType.value

//     const dateMatch = groupBy.value !== 'range' || (date.isValid(dateRange.value.start) &&
//       date.isValid(dateRange.value.end) &&
//       new Date(t.date) >= new Date(dateRange.value.start) &&
//       new Date(t.date) <= new Date(dateRange.value.end))

//     return tagMatch && typeMatch && dateMatch
//   })
// })

// const sortOrder = ref('desc') // or 'asc'

// const sortOptions = [
//   { label: 'Newest First', value: 'desc' },
//   { label: 'Oldest First', value: 'asc' },
// ]

// const parseDate = (dateStr) => parse(dateStr, 'yyyy/MM/dd', new Date())

// const groupedData = computed(() => {
//   const groupKey = (rawDate) => {
//     const d = parseDate(rawDate)
//     if (!isValid(d)) return 'Invalid Date'

//     switch (groupBy.value) {
//       case 'day':
//         return format(d, 'yyyy-MM-dd')
//       case 'week': {
//         const week = getWeek(d)
//         const year = getYear(d)
//         return `Week ${week}, ${year}`
//       }
//       case 'month':
//         return format(d, 'MMMM yyyy')
//       case 'year':
//         return format(d, 'yyyy')
//       case 'range':
//         return 'In Range'
//       default:
//         return format(d, 'yyyy-MM-dd')
//     }
//   }

//   const grouped = new Map()

//   filteredData.value.forEach((transaction) => {
//     const key = groupKey(transaction.date)
//     if (!grouped.has(key)) {
//       grouped.set(key, {
//         dateRef: transaction.date,
//         transactions: [],
//         income: 0,
//         expense: 0,
//       })
//     }

//     const group = grouped.get(key)
//     group.transactions.push(transaction)

//     if (transaction.type === 'Income') {
//       group.income += transaction.amount
//     } else if (transaction.type === 'Expense') {
//       group.expense += Math.abs(transaction.amount)
//     }

//     // Update group date reference if needed
//     const txDate = parseDate(transaction.date)
//     const currentRef = parseDate(group.dateRef)
//     if (compareDesc(txDate, currentRef) > 0) {
//       group.dateRef = transaction.date
//     }
//   })

//   // Sort transactions in each group
//   for (const group of grouped.values()) {
//     group.transactions.sort((a, b) =>
//       sortOrder.value === 'desc'
//         ? compareDesc(parseDate(a.date), parseDate(b.date))
//         : compareAsc(parseDate(a.date), parseDate(b.date))
//     )
//   }

//   // Sort the groups
//   const sorted = Array.from(grouped.entries()).sort(([, a], [, b]) =>
//     sortOrder.value === 'desc'
//       ? compareDesc(parseDate(a.dateRef), parseDate(b.dateRef))
//       : compareAsc(parseDate(a.dateRef), parseDate(b.dateRef))
//   )

//   return Object.fromEntries(sorted)
// })

function resetFilters() {
  selectedTags.value = []
  groupBy.value = 'Month'
  dateRange.value = { start: '', end: '' }
}

</script>

<template>
  <q-page class="q-pa-md">
    <BalanceSummary />
    <div class=" col-lg-3" v-if="transactions.length > 0">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="searchQuery" label="Search by Name, Date, Amount, or Tag" outlined clearable
                @update:model-value="updateGrouping">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-4">
              <q-select outlined v-model="groupBy" @update:model-value="updateGrouping" :options="groupByOptions"
                label="Group By" />
              <div v-if="groupBy === 'Custom Range'" class="row q-mt-md">
                <div class="col-6 q-pr-sm">
                  <q-input v-model="customStartDate" label="Start Date (YYYY-MM-DD)" outlined type="date"
                    @update:model-value="updateGrouping" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input v-model="customEndDate" label="End Date (YYYY-MM-DD)" outlined type="date"
                    @update:model-value="updateGrouping" />
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <q-select v-model="selectedTags" @update:model-value="updateGrouping" :options="tagOptions"
                label="Filter Transactions By Tags" outlined multiple emit-value map-options use-chips>
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
            <div class="row col-12 col-sm-4">
              <!-- <q-select v-model="sortOrder" :options="sortOptions" label="Sort by" dense outlined emit-value map-options
                style="max-width: 180px" /> -->
              <!-- <q-btn-toggle v-model="sortOrder" :options="[
                { label: 'Newest', value: 'desc' },
                { label: 'Oldest', value: 'asc' }
              ]" dense toggle-color="primary" unelevated rounded /> -->
              <q-btn label="Reset Filters" @click="resetFilters" flat class="q-mt-sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-expansion-item v-for="(group, index) in groupedTransactions" :key="index" :label="group.label" expand-separator
        default-opened>
        <div class="q-pa-md q-gutter-md">
          <q-list bordered padding class="rounded-borders">
            <q-item v-for="transaction in group.transactions" :key="transaction.id">
              <q-item-section top class="q-my-sm">
                <q-item-label lines="1" class="q-my-sm">
                  <span class="text-weight-medium q-my-sm">{{ transaction.name }}</span>
                  <span class="text-grey-8 q-my-sm"> - {{ transaction.date }}</span>
                </q-item-label>
                <q-item-label class="q-my-sm" :class="transaction.type === 'Income' ? 'text-primary' : 'text-red'">
                  <span>{{ transaction.amount }} $ / <q-badge side clickable rounded class="q-mx-xs cursor-pointer"
                      v-for="tag in transaction.tags" :key="tag.id" :color="tag.color">
                      <q-breadcrumbs-el :label="tag.name" :to="{ name: 'tag-details', params: { id: tag.id } }" />
                    </q-badge> </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side class="row">
                <div class="text-grey-8">
                  <q-btn class="gt-xs" flat dense round @click="confirm(transaction.id)" icon="delete" />
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu persistent auto-close>
                      <q-list style="min-width: 100px">
                        <q-item clickable :to="{ name: 'transaction-details', params: { id: transaction.id } }">
                          <q-item-section>Details</q-item-section>
                        </q-item>
                        <q-item clickable :to="{ name: 'update', params: { id: transaction.id } }">
                          <q-item-section>Update</q-item-section>
                        </q-item>
                        <q-item clickable :to="{ name: 'clone', params: { id: transaction.id } }">
                          <q-item-section>Clone</q-item-section>
                        </q-item>
                        <q-item clickable @click="confirm(transaction.id)">
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-expansion-item>
    </div>
    <div v-else>
      No Transactions Found, Click the plus sign to create a new one.
    </div>
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
