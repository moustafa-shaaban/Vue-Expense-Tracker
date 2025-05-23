<template>
    <q-dialog v-model="dialog" persistent>
        <q-card style="min-width: 90vw; max-width: 95vw">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Export Transactions</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div class="col-xs-12 col-sm-6">
                        <q-select v-model="selectedColumns" :options="allColumns" label="Columns to Export" multiple
                            option-label="label" option-value="name" emit-value map-options outlined dense />
                    </div>

                    <div class="col-xs-6 col-sm-3">
                        <q-select v-model="groupBy" :options="['none', 'day', 'week', 'month', 'year']" label="Group By"
                            outlined dense />
                    </div>

                    <div class="col-xs-6 col-sm-3">
                        <q-select v-model="format" :options="['json', 'csv']" label="Export Format" dense outlined />
                    </div>

                    <div class="col-xs-6 col-sm-3">
                        <q-input v-model="filename" label="Filename" dense outlined />
                    </div>

                    <div class="col-xs-6 col-sm-3">
                        <q-input v-model="startDate" type="date" label="Start Date" dense outlined />
                    </div>
                    <div class="col-xs-6 col-sm-3">
                        <q-input v-model="endDate" type="date" label="End Date" dense outlined />
                    </div>
                </div>

                <q-separator class="q-my-md" />

                <q-table :rows="previewData" :columns="selectedColumns" flat dense bordered virtual-scroll
                    row-key="id" />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn label="Cancel" flat v-close-popup />
                <q-btn label="Export" color="primary" @click="exportData" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import { exportFile, date } from 'quasar'

const dialog = ref(true)
const format = ref('csv')
const filename = ref('transactions')
const startDate = ref('')
const endDate = ref('')
const groupBy = ref('none')

const transactionsStore = useTransactionsStore()

// Full column definitions
const allColumns = [
    { name: 'name', label: 'Name', field: row => row.name, align: 'left' },
    { name: 'amount', label: 'Amount', field: row => row.amount, align: 'right' },
    { name: 'type', label: 'Type', field: 'type', align: 'left' },
    { name: 'date', label: 'Date', field: 'date', align: 'left' },
    { name: 'tags', label: 'Tags', field: row => row.tags, align: 'left' },
    // { name: 'walletId', label: 'Wallet ID', field: 'walletId', align: 'left' }
]

const selectedColumns = ref([...allColumns])

const filteredTransactions = computed(() => {
    return transactionsStore.transactions.filter(tx => {
        if (startDate.value && tx.date < startDate.value) return false
        if (endDate.value && tx.date > endDate.value) return false
        return true
    })
})

function groupTransactions(transactions) {
    if (groupBy.value === 'none') return transactions

    const grouped = {}
    for (const tx of transactions) {
        let key = tx.date
        if (groupBy.value === 'week') {
            const d = new Date(tx.date)
            const year = d.getFullYear()
            const week = Math.ceil(
                ((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + new Date(d.getFullYear(), 0, 1).getDay() + 1) / 7
            )
            key = `${year}-W${week}`
        } else if (groupBy.value === 'month') {
            key = tx.date.slice(0, 7)
        } else if (groupBy.value === 'year') {
            key = tx.date.slice(0, 4)
        }

        if (!grouped[key]) grouped[key] = []
        grouped[key].push(tx)
    }

    // Flatten grouped data into a list with a `group` label
    return Object.entries(grouped).flatMap(([group, txs]) =>
        txs.map(tx => ({ ...tx, group }))
    )
}

const previewData = computed(() => {
    const grouped = groupTransactions(filteredTransactions.value)
    return grouped.map(tx => {
        const row = {}
        selectedColumns.value.forEach(col => {
            if (col.name === 'id') {
                row.id = tx.id
            }
            if (col.name === 'name') {
                row.name = tx.name
            }
            if (col.name === 'amount') {
                row.amount = tx.amount
            }
            if (col.name === 'type') {
                row.type = tx.type
            }
            if (col.name === 'date') {
                row.date = tx.date
            }
            if (col.name === 'tags') {
                if (Array.isArray(tx.tags)) {
                    row.tags = tx.tags.map(t => t.name ?? t).join(', ')
                } else if (typeof tx.tags === 'string') {
                    row.tags = tx.tags
                } else {
                    row.tags = ''
                }
            }
        })
        if (groupBy.value !== 'none') {
            row.group = tx.group
        }
        return row
    })
})

function exportData() {
    const data = previewData.value
    const fields = selectedColumns.value.map(c => c.name)
    if (groupBy.value !== 'none') fields.unshift('group')

    if (format.value === 'json') {
        const content = JSON.stringify(data, null, 2)
        exportFile(`${filename.value}.json`, content, 'application/json')
    } else if (format.value === 'csv') {
        const csv = [
            fields.join(','),
            ...data.map(row =>
                fields.map(f => `"${String(row[f] ?? '').replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n')
        exportFile(`${filename.value}.csv`, csv, 'text/csv')
    }

    dialog.value = false
}
</script>