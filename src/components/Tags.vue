<script setup>
import { useExpensesStore } from '@/stores/expenses';

const expensesStore = useExpensesStore();

const tags = expensesStore.tags;
</script>

<template>
    <div v-for="tag in tags" :key="tag.id">
        <h4>{{ tag.name }}</h4>
    </div>
</template>