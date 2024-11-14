<script setup>
import { ref } from 'vue'
import { Dark } from 'quasar';

// import { useNotesStore } from 'src/stores/notes-store';

defineOptions({
    name: 'AddExpenseLayout'
})

const darkQuery = '(prefers-color-scheme: dark)';
const queryList = window.matchMedia(darkQuery);
Dark.set(queryList.matches);
queryList.addEventListener('change', (event) => {
    Dark.set(event.matches);
});

</script>

<template>
    <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>
                    Add Expense
                </q-toolbar-title>
                <q-space />
                <q-btn round flat icon="arrow_back" :to="{ name: 'home' }" />
            </q-toolbar>
        </q-header>
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>