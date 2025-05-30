<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Import Transactions</div>
      <q-file v-model="file" label="Choose a file (JSON, CSV)" accept=".json,.csv" filled
        @update:model-value="handleFile" />
    </q-card-section>

    <q-separator />

    <q-card-section v-if="preview.length">
      <div class="text-subtitle1 q-mb-sm">Preview:</div>
      <q-table :rows="preview" :columns="columns" row-key="id" flat dense :pagination="{ rowsPerPage: 20 }" />
    </q-card-section>

    <q-card-actions align="right" v-if="preview.length">
      <q-btn label="Import" color="primary" @click="saveToStore" />
      <q-btn label="Cancel" flat @click="reset" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import * as Papa from 'papaparse'
import { Notify, uid } from 'quasar'
import { useTransactionsStore } from '../../stores/transactions'
import { useRouter } from 'vue-router'

const file = ref(null)
const preview = ref([])
const store = useTransactionsStore();
const router = useRouter();

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'type', label: 'Type', field: 'type', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'tags', label: 'Tags', field: row => row.tags?.map(t => t.name).join(', ') || '', align: 'left' },
]

function reset() {
  file.value = null
  preview.value = []
}

function saveToStore() {
  try {
    preview.value.forEach(tx => {
      if (!store.transactions.find(t =>
        t.name === tx.name &&
        t.amount === tx.amount &&
        t.date === tx.date &&
        t.type === tx.type
      )) {
        store.addTransaction(tx)
      }
    })
    router.push('/');
    Notify.create({
      message: 'Transactions Imported Successfully',
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

  reset()
}

function handleFile() {
  const uploadedFile = file.value
  if (!uploadedFile) return

  const reader = new FileReader()

  reader.onload = async (e) => {
    const data = e.target.result

    if (uploadedFile.name.endsWith('.json')) {
      try {
        const parsed = JSON.parse(data)
        preview.value = parsed.map(normalizeRow)
      } catch (err) {
        console.error('Invalid JSON:', err)
        reset()
      }
    } else if (uploadedFile.name.endsWith('.csv')) {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          preview.value = results.data.map(normalizeRow)
        }
      })
    }
  }

  if (uploadedFile.name.endsWith('.json') || uploadedFile.name.endsWith('.csv')) {
    reader.readAsText(uploadedFile)
  } else {
    reader.readAsBinaryString(uploadedFile)
  }
}

function normalizeRow(row) {
  return {
    id: row.id || uid(),
    name: row.name || '',
    amount: Number(row.amount || 0),
    type: row.type || '',
    date: row.date || '',
    tags: row.tags ? parseTags(row.tags, row.type) : [],
  }
}

function parseTags(raw, type) {
  //const existingTags = store.tags

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(t => matchOrCreateTag(t.name || t, type))
    } catch {
      return raw.split(',').map(name => matchOrCreateTag(name.trim(), type))
    }
  }

  if (Array.isArray(raw)) {
    return raw.map(t => matchOrCreateTag(t.name || t, type))
  }

  return []
}

function matchOrCreateTag(name, type) {
  const match = store.tags.find(tag => tag.name === name && tag.type === type.toLowerCase())
  return match || {
    id: uid(),
    name,
    type: type?.toLowerCase() || '',
    color: type === 'Income' ? 'green-4' : 'red-4'
  }
}
</script>

<style scoped></style>
