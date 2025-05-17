<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-4">
        <q-select
          v-model="selectedCategory"
          :options="categoryOptions"
          label="Select Category"
          clearable
          filled
          @update:model-value="updateFilter"
        />
      </div>
      <div class="col-4">
        <q-input
          v-model="searchText"
          label="Search by Name"
          filled
          debounce="300"
          @update:model-value="updateFilter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      title="Desserts"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :filter-method="filterMethod"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const rows = ref([
  { name: 'Frozen Yogurt', category: 'breakfast', calories: 159 },
  { name: 'Ice Cream Sandwich', category: 'breakfast', calories: 237 },
  { name: 'Eclair', category: 'lunch', calories: 262 },
  { name: 'Cupcake', category: 'lunch', calories: 305 },
  { name: 'Gingerbread', category: 'dinner', calories: 356 },
  { name: 'Jelly Bean', category: 'dinner', calories: 375 },
]);

const columns = [
  { name: 'name', label: 'Dessert', field: 'name', sortable: true },
  { name: 'category', label: 'Category', field: 'category', sortable: true },
  { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
];

const categoryOptions = ['breakfast', 'lunch', 'dinner'];
const selectedCategory = ref(null);
const searchText = ref('');
const filter = ref({ category: '', search: '' });

const updateFilter = () => {
  filter.value = {
    category: selectedCategory.value || '',
    search: searchText.value || '',
  };
};

const filterMethod = (rows, terms) => {
  let filteredRows = rows;

  // Filter by category
  if (terms.category) {
    filteredRows = filteredRows.filter((row) => row.category === terms.category);
  }

  // Filter by search text
  if (terms.search) {
    const needle = terms.search.toLowerCase();
    filteredRows = filteredRows.filter((row) =>
      row.name.toLowerCase().includes(needle)
    );
  }

  return filteredRows;
};
</script>