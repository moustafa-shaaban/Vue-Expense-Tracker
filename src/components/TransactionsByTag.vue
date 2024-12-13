<script setup>
import { useTransactionsStore } from '@/stores/transactions';
import { useRoute } from 'vue-router';
import { date } from 'quasar';


const route = useRoute();
const transactionsStore = useTransactionsStore();

const transactions = transactionsStore.getTransactionsByTag(route.params.id)

</script>

<template>
    <q-page class="flex flex-center column">
        <q-separator />
        <div v-if="transactions.length">
            <q-card v-for="transaction in transactions" :key="transaction.id" class="card q-mt-md" flat bordered>

                <q-card-section>
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-h6">{{ transaction.name }}</div>
                            <div class="text-subtitle2">
                                {{ date.formatDate(transaction.dateAdded, 'DD MMMM YYYY') }}
                                <q-badge clickable rounded color="primary" class="q-mx-xs" v-for="tag in transaction.tags">
                                    <q-breadcrumbs-el :label="tag.name"
                                        :to="{ name: 'tag-details', params: { id: tag.id } }" />
                                </q-badge>
                            </div>
                        </div>

                        <div class="col-auto">
                            <q-btn color="grey-7" round flat icon="more_vert">
                                <q-menu cover auto-close>
                                    <q-list>
                                        <q-item clickable>
                                            <q-item-section color="negative">Remove Card</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu>
                            </q-btn>
                        </div>
                    </div>
                </q-card-section>

                <q-separator dark inset />

                <q-separator />

                <q-card-actions>
                    <q-btn color="info" flat :to="{ name: 'transaction-details', params: { id: transaction.id } }">Details</q-btn>
                </q-card-actions>
            </q-card>
        </div>
        <div v-else>
            <p>No Tags that has this tag Found, Click on the plus (+) sign to add a new note</p>
        </div>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" :to="{ name: 'add-transaction' }">
            </q-btn>
        </q-page-sticky>
    </q-page>
</template>


<style lang="sass" scoped>
.card
  width: 350px
</style>