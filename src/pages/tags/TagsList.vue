<script setup>
import { onMounted, ref } from 'vue';

import { useTransactionsStore } from '../../stores/transactions';
import { Dialog, Notify } from 'quasar';
import { storeToRefs } from 'pinia';

const transactionsStore = useTransactionsStore();

onMounted(async () => {
  await transactionsStore.loadData();
})

const searchQuery = ref('');

const columns = [
  {
    name: 'name',
    label: 'Name',
    required: true,
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'type',
    label: 'Type',
    required: true,
    align: 'left',
    field: row => row.type,
    sortable: true
  },
  {
    name: 'color',
    label: 'Color',
    required: true,
    align: 'left',
    field: row => row.color,
    sortable: true
  },
  {
    name: "actions",
    align: "left",
    required: true,
    field: ""
  }
]

const { tags } = storeToRefs(transactionsStore)
const rows = tags;

function confirm(id) {
  Dialog.create({
    dark: true,
    title: 'Confirm',
    color: 'primary',
    message: 'Delete this tag?, Your Notes that has this tag will not be deleted',
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      transactionsStore.deleteTag(id)
      Notify.create({
        message: 'Tag Deleted Successfully',
        type: "positive",
        actions: [
          { icon: 'close', color: 'white', round: true, }
        ]
      })
    } catch (error) {
      console.log(error)
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
</script>

<template>
  <q-page class="q-pa-md">
    <q-table grid flat bordered title="Tags" :rows="rows" :columns="columns" row-key="id" :filter="searchQuery"
      no-data-label="No Tags Found">

      <!-- Search Template Slot -->
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="searchQuery" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Cards Template Slot -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card>
            <q-card-section>
              <div class="row items-center no-wrap">
                <!-- Tag Name -->
                <div class="col">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <q-badge side clickable rounded class="q-mx-xs" :color="props.row.color">
                    <q-breadcrumbs-el :label="props.row.type" />
                  </q-badge>
                </div>
                <div class="col-auto">
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable :to="{ name: 'tag-details', params: { id: props.row.id } }">
                          <q-item-section>{{ $t('details') }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn flat :to="{ name: 'tag-details', params: { id: props.row.id } }">{{ $t('details') }}</q-btn>
              <q-btn flat @click="confirm(props.row.id)">{{ $t('delete') }}</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'create-tag' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>


<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s

.my-card
  width: 100%
</style>
