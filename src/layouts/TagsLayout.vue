<script setup>
import { ref } from 'vue'
import { Dark } from 'quasar';

// import { useNotesStore } from 'src/stores/notes-store';

defineOptions({
    name: 'AddTransactionLayout'
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
                    Tags
                </q-toolbar-title>
                <q-space />
                <q-btn round flat icon="back" :to="{ name: 'home' }" />
            </q-toolbar>
        </q-header>
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>