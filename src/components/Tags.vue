<script setup>
import { useTransactionsStore } from '@/stores/transactions';

const transactionsStore = useTransactionsStore();

const tags = transactionsStore.tags;
</script>

<template>
    <div v-for="tag in tags" :key="tag.id">
        <h4>{{ tag.name }}</h4>
    </div>
</template>