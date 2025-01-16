<script setup>
import { ref } from 'vue';

import { useTransactionsStore } from '../stores/transactions';

const transactionsStore = useTransactionsStore();

const filter = ref('');

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
    name: "actions",
    align: "left",
    required: true,
    field: ""
  }
]


const rows = transactionsStore.tags;

// function confirm(id) {
//   Dialog.create({
//     dark: true,
//     title: 'Confirm',
//     color: 'primary',
//     message: 'Delete this tag?, Your Notes that has this tag will not be deleted',
//     cancel: true,
//     persistent: true
//   }).onOk(() => {
//     try {
//       transactionsStore.deleteTag(id)
      
//       Notify.create({
//         message: 'Tag Deleted Successfully',
//         type: "positive",
//         actions: [
//           { icon: 'close', color: 'white', round: true, }
//         ]
//       })
//     } catch (error) {
//       console.log(error)
//       Notify.create({
//         message: error.message,
//         type: "negative",
//         actions: [
//           { icon: 'close', color: 'white', round: true, }
//         ]
//       })
//     }
//   })
// };
</script>

<template>
  <q-page class="q-pa-md">
   <!--  <q-table :grid="$q.screen.xs" grid-header flat bordered title="Tags" :rows="rows" :columns="columns" row-key="id"
      :filter="filter" no-data-label="No Tags Found" virtual-scroll :rows-per-page-options="[0]">

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat round color="blue" field="edit" icon="edit"
            :to="{ name: 'tag-details', params: { id: props.row.id } }" />
          <q-btn dense flat round color="negative" field="edit" icon="delete" @click="confirm" />
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="">
          <div class="">
            <q-card class="q-mt-md" :props="props">
              <q-card-section>
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">by John Doe</div>
              </q-card-section>

            <q-card-actions>
              <q-btn dense flat round color="warning" field="edit" icon="edit"
                :to="{ name: 'tag-details', params: { id: props.row.id } }" />
              <q-btn dense flat round color="negative" field="edit" icon="delete" @click="confirm(props.row.id)" />
            </q-card-actions>
          </q-card>
          </div>
        </div>
       <q-tr :props="props" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
                    <q-td key="name">
                        {{ props.row.name }}
                    </q-td>
                    <q-td key="actions">
                        <q-btn dense flat round color="blue" field="edit" icon="edit" :to="{ name: 'tag-details', params: { id: props.row.id } }" />
                        <q-btn dense flat round color="blue" field="edit" icon="delete"  @click="confirm" />
                    </q-td>
                </q-tr>
      </template>
    </q-table> -->
    
    <q-table grid flat bordered title="Tags" :rows="rows" :columns="columns" row-key="id" :filter="filter" no-data-label="No Tags Found">
      
      <!-- Search Template Slot -->
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
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
                </div>

                <div class="col-auto">
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable :to="{ name: 'tag-details', params: { id: props.row.id } }">
                          <q-item-section>Details</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn flat :to="{ name: 'tag-details', params: { id: props.row.id } }">Details</q-btn>
              <q-btn flat @click="confirm(props.row.id)">Delete</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
    
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'add-tag' }">
      </q-btn>
    </q-page-sticky>
  </q-page>

  <!-- 
        source: https://codepen.io/metalsadman/pen/ZgKexK?editors=1010
        <q-table
          flat
          bordered
          class="statement-table"
          title="Complex"
          :rows="currencyData"
          :hide-header="grid"
          :columns="currencyColumns"
          row-key="__index"
          :grid="grid"
          :filter="filter"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top-right="props">
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="setFs(props)"
            >
              <q-tooltip>{{
                props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
              }}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="grid ? 'list' : 'grid_on'"
              @click="grid = !grid"
            >
              <q-tooltip>{{grid ? "List" : "Grid"}}</q-tooltip>
            </q-btn>
            <div class="q-pa-sm q-gutter-sm">
              
            </div>
          </template>
          
          <template #body-cell-status="props">
            <q-td :props="props">
                <q-chip
                  :color="props.row.status === 'Active' ? 'green': 'red'"
                  text-color="white"
                  dense
                  class="text-weight-bolder"
                  square
                >{{props.row.status}}</q-chip>
            </q-td>
          </template>
          <template #body-cell-action="props">
            <q-td :props="props">
              <q-btn dense flat round color="blue" field="edit" icon="edit" @click="editItem(props.row)"></q-btn>
            </q-td>
          </template>
          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-card :class="props.selected ? 'bg-grey-2' : ''">
                <q-list dense>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip v-if="col.name === 'status'"
                        :color="props.row.status == 'Active' ? 'green': props.row.status == 'Disable' ? 'red': 'grey'"
                        text-color="white"
                        dense
                        class="text-weight-bolder"
                        square
                      >{{col.value}}</q-chip>
                      <q-btn v-else-if="col.name === 'action'" dense flat color="primary" field="edit" icon="edit" @click="editItem(props.row)" ></q-btn>
                      <q-item-label v-else caption :class="col.classes ? col.classes : ''">{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
    </q-table> -->
</template>


<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s

.my-card
  width: 100%
</style>