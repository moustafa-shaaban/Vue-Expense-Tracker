<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dialog, Notify } from 'quasar';

import { useTransactionsStore } from '../stores/transactions';

const transactionsStore = useTransactionsStore();
const route = useRoute();
const router = useRouter();

const isEditing = ref(false);

// const tag = ref({
//     id: '',
//     name: ''
// });

// tag.value = transactionsStore.getTagById(route.params.id);

const tagItem = ref([])

const tag = JSON.parse(JSON.stringify(transactionsStore.getTagById(route.params.id)));

tagItem.value = tag

function handleSubmit() {
    try {
        transactionsStore.updateTag(route.params.id, tagItem.value);
        router.push({ name: 'tag-details', params: { id: route.params.id } });
        Notify.create({
            message: 'Tag Updated Successfully',
            type: "positive",
            actions: [
                { icon: 'close', color: 'white', round: true, }
            ]
        })

        // router.push({ name: 'tag-detail', params: { id: route.params.id } })
    } catch (error) {
        Notify.create({
            message: error.message,
            type: "negative",
            actions: [
                { icon: 'close', color: 'white', round: true, }
            ]
        })
    }
};

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
            router.push('/tags');
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
    <q-page class="flex flex-center">
        <q-card v-if="isEditing" flat bordered class="my-card">
            <q-card-section class="row items-center q-pb-none q-mb-md" vertical>
                <div class="text-h6">Edit Tag:</div>
            </q-card-section>

            <q-card-section>
                <q-form @submit.prevent="handleSubmit">
                    <q-input filled v-model="tagItem.name" label="Tag Name" required lazy-rules
                        :rules="[val => val && val.length > 0 || 'Tag Name is required']" />


                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <q-btn type="submit" fab icon="done" color="primary">
                        </q-btn>
                    </q-page-sticky>
                </q-form>
            </q-card-section>

            <q-page-sticky position="bottom-left" :offset="[18, 18]">
                <q-btn @click="isEditing = false" fab icon="undo" color="negative">
                </q-btn>
            </q-page-sticky>
        </q-card>


        <q-card v-else class="my-card q-mt-md" flat bordered>
            <q-card-section>
                <div class="row items-center no-wrap">
                    <div class="col">
                        <div class="text-h6">{{ tag.name }}</div>
                    </div>
                </div>
            </q-card-section>


            <q-card-actions>
                <q-btn type="button" outline size="sm"
                    :to="{ name: 'transactions-by-tag', params: { id: tag.id } }">Transactions
                    with this tag</q-btn>
                <q-btn color="primary" type="button" size="sm" @click="isEditing = true">Edit</q-btn>
                <q-btn color="negative" type="button" size="sm" @click="confirm(tag.id)">Delete</q-btn>
            </q-card-actions>
        </q-card>

        <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn :to="{ 'name': 'tags' }" fab icon="undo" color="negative">
            </q-btn>
        </q-page-sticky>
    </q-page>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  width: 350px
</style>
