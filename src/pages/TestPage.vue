<template>
  <div class="q-pa-md">
    <!-- Grouping Selection -->
    <q-select
      v-model="groupBy"
      :options="groupByOptions"
      label="Group By"
      style="max-width: 200px; margin-bottom: 10px;"
      @update:model-value="updateTableData"
    />

    <!-- Custom Date Range Input (shown only when custom is selected) -->
    <div v-if="groupBy === 'custom'" class="q-mb-md">
      <q-input
        v-model="customStartDate"
        label="Start Date (YYYY-MM-DD)"
        filled
        style="max-width: 200px; display: inline-block; margin-right: 10px;"
      />
      <q-input
        v-model="customEndDate"
        label="End Date (YYYY-MM-DD)"
        filled
        style="max-width: 200px; display: inline-block;"
      />
      <q-btn
        label="Apply Range"
        color="primary"
        @click="updateTableData"
        class="q-ml-sm"
      />
    </div>

    <!-- Quasar Table -->
    <q-table
      title="Financial Transactions"
      :rows="groupedData"
      :columns="columns"
      row-key="groupKey"
      :pagination="pagination"
      dense
    >
      <!-- Custom body slot with QExpansionItem -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="groupKey" :props="props">
            <q-expansion-item
              :label="props.row.groupKey"
              dense
              expand-icon="expand_more"
            >
              <!-- Expanded content: Summary and Transactions -->
              <q-card flat>
                <q-card-section>
                  <!-- Summary Section -->
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <strong>Summary for {{ props.row.groupKey }}</strong>
                      </q-item-label>
                      <q-item-label caption>
                        Number of Transactions: {{ props.row.transactionCount }}
                      </q-item-label>
                      <q-item-label caption>
                        Total Income: 
                        <span class="text-positive">
                          {{ formatAmount(props.row.totalIncome) }}
                        </span>
                      </q-item-label>
                      <q-item-label caption>
                        Total Expenses: 
                        <span class="text-negative">
                          {{ formatAmount(props.row.totalExpenses) }}
                        </span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <!-- Transactions List -->
                  <q-list dense>
                    <q-item v-for="(transaction, index) in props.row.transactions" :key="index">
                      <q-item-section>
                        <q-item-label>{{ transaction.date }}</q-item-label>
                        <q-item-label caption>
                          {{ transaction.name }} ({{ transaction.type }}): 
                          <span :class="transaction.amount < 0 ? 'text-negative' : 'text-positive'">
                            {{ formatAmount(transaction.amount) }}
                          </span>
                        </q-item-label>
                        <q-item-label caption>
                          Tags: 
                          <q-chip
                            v-for="tag in transaction.tags"
                            :key="tag.name"
                            :color="tag.color"
                            text-color="white"
                            dense
                          >
                            {{ tag.name }}
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-td>
          <q-td key="type" :props="props">{{ props.row.type }}</q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="amount" :props="props">
            <span :class="props.row.amount < 0 ? 'text-negative' : 'text-positive'">
              {{ formatAmount(props.row.amount) }}
            </span>
          </q-td>
          <q-td key="tags" :props="props">
            <q-chip v-for="tag in props.row.tags" :key="tag.name" :color="tag.color" text-color="white" dense>
              {{ tag.name }}
            </q-chip>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Export Buttons -->
    <div class="q-mt-md">
      <q-btn label="Export to CSV" color="primary" @click="exportToCSV" class="q-mr-sm" />
      <q-btn label="Export to JSON" color="secondary" @click="exportToJSON" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { exportFile } from 'quasar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { useTransactionsStore } from '@/stores/transactions';
import { storeToRefs } from 'pinia';

export default {
  name: 'FinancialTable',
  setup() {
    const transactionsStore = useTransactionsStore();
    const { transactions } = storeToRefs(transactionsStore)
    // Original data
    const rawData = ref([
      {
        name: 'Rent',
        amount: -300,
        type: 'Expense',
        tags: [{ name: 'Rent', type: 'expense', color: 'red-3' }],
        date: '2025/05/08',
      },
      {
        name: 'Rent',
        amount: -300,
        type: 'Expense',
        tags: [{ name: 'Rent', type: 'expense', color: 'red-3' }],
        date: '2024/05/09',
      },
      {
        name: 'Freelance Job',
        amount: 500,
        type: 'Income',
        tags: [{ name: 'Freelance', type: 'income', color: 'purple-4' }],
        date: '2025/05/15',
      },
      {
        name: 'Salary',
        amount: 1000,
        type: 'Income',
        tags: [{ name: 'Salary', type: 'income', color: 'indigo' }],
        date: '2025/05/01',
      },
      {
        name: 'Salary',
        amount: 1000,
        type: 'Income',
        tags: [{ name: 'Salary', type: 'income', color: 'indigo' }],
        date: '2025/04/01',
      },
      {
        name: 'Salary',
        amount: 1000,
        type: 'Income',
        tags: [{ name: 'Salary', type: 'income', color: 'indigo' }],
        date: '2024/05/01',
      },
    ]);

    // Grouping options
    const groupBy = ref('month');
    const groupByOptions = ['day', 'week', 'month', 'year', 'custom'];
    const customStartDate = ref('');
    const customEndDate = ref('');

    // Table columns
    const columns = [
      { name: 'groupKey', label: 'Date/Group', field: 'groupKey', align: 'left' },
      { name: 'type', label: 'Type', field: 'type', align: 'left' },
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
      { name: 'tags', label: 'Tags', field: 'tags', align: 'left' },
    ];

    // Pagination settings
    const pagination = ref({
      rowsPerPage: 10,
      page: 1,
    });

    // Computed property for grouped data
    const groupedData = computed(() => {
      const grouped = {};

      transactions.value.forEach((item) => {
        const date = new Date(item.date);
        let groupKey;

        // Determine group key based on groupBy selection
        if (groupBy.value === 'day') {
          groupKey = format(date, 'yyyy-MM-dd');
        } else if (groupBy.value === 'week') {
          const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
          groupKey = `Week of ${weekStart}`;
        } else if (groupBy.value === 'month') {
          groupKey = format(date, 'yyyy-MM');
        } else if (groupBy.value === 'year') {
          groupKey = format(date, 'yyyy');
        } else if (groupBy.value === 'custom') {
          const start = new Date(customStartDate.value);
          const end = new Date(customEndDate.value);
          if (!customStartDate.value || !customEndDate.value || isNaN(start) || isNaN(end)) {
            groupKey = 'Invalid Range';
          } else if (date >= start && date <= end) {
            groupKey = `${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`;
          } else {
            return; // Skip items outside custom range
          }
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            groupKey,
            type: item.type,
            name: item.name,
            amount: item.amount,
            tags: [...item.tags],
            transactions: [item], // Store individual transactions
            transactionCount: 1,
            totalIncome: item.amount > 0 ? item.amount : 0,
            totalExpenses: item.amount < 0 ? Math.abs(item.amount) : 0,
          };
        } else {
          grouped[groupKey].amount += item.amount;
          grouped[groupKey].transactions.push(item); // Add to transactions list
          grouped[groupKey].transactionCount += 1;
          if (item.amount > 0) {
            grouped[groupKey].totalIncome += item.amount;
          } else if (item.amount < 0) {
            grouped[groupKey].totalExpenses += Math.abs(item.amount);
          }
          // Merge tags
          grouped[groupKey].tags = [
            ...new Set([...grouped[groupKey].tags, ...item.tags].map((tag) => JSON.stringify(tag))),
          ].map((tag) => JSON.parse(tag));
          // Update type and name if they differ
          grouped[groupKey].type = grouped[groupKey].type === item.type ? item.type : 'Mixed';
          grouped[groupKey].name = grouped[groupKey].name === item.name ? item.name : 'Multiple';
        }
      });

      return Object.values(grouped);
    });

    // Function to update table data (for custom range)
    const updateTableData = () => {
      // Trigger recomputation of groupedData
      groupedData.value;
    };

    // Format amount for display
    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Math.abs(amount));
    };

    // Export to CSV
    const exportToCSV = () => {
      const wrapCsvValue = (val, formatFn) => {
        let formatted = formatFn ? formatFn(val) : val;
        formatted = formatted === undefined || formatted === null ? '' : String(formatted);
        formatted = formatted.split('"').join('""');
        return `"${formatted}"`;
      };

      const content = [
        columns.map((col) => wrapCsvValue(col.label)).join(','),
        ...groupedData.value.map((row) =>
          columns
            .map((col) => {
              if (col.name === 'amount') {
                return wrapCsvValue(row[col.field], formatAmount);
              } else if (col.name === 'tags') {
                return wrapCsvValue(row[col.field].map((tag) => tag.name).join(';'));
              }
              return wrapCsvValue(row[col.field]);
            })
            .join(','),
        ),
      ].join('\r\n');

      const status = exportFile('financial-data.csv', content, {
        mimeType: 'text/csv;charset=utf-8;',
        byteOrderMark: '\uFEFF',
      });

      if (status !== true) {
        console.error('Export failed:', status);
      }
    };

    // Export to JSON
    const exportToJSON = () => {
      const jsonContent = JSON.stringify(groupedData.value, null, 2);
      const status = exportFile('financial-data.json', jsonContent, {
        mimeType: 'application/json;charset=utf-8;',
        byteOrderMark: '\uFEFF',
      });

      if (status !== true) {
        console.error('Export failed:', status);
      }
    };

    return {
      groupBy,
      groupByOptions,
      customStartDate,
      customEndDate,
      columns,
      groupedData,
      pagination,
      updateTableData,
      formatAmount,
      exportToCSV,
      exportToJSON,
    };
  },
};
</script>