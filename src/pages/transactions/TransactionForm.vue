<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar';
import { useTransactionsStore } from '../../stores/transactions';

const transactionsStore = useTransactionsStore();
const route = useRoute();
const router = useRouter();

const isUpdate = computed(() => route.params.id && route.path.includes('/update'))
const isClone = computed(() => route.path.includes('/clone'))

const toggleIncome = ref(false)

const transaction = ref({
  id: route.params.id || null,
  name: '',
  amount: '',
  type: '',
  date: '',
  tags: []
})

if (isUpdate.value || isClone.value) {
  const existingTransaction = transactionsStore.transactions.find(item => item.id === route.params.id)

  if (existingTransaction.type === 'Income') {
    toggleIncome.value = true
  }

  if (existingTransaction) {
    transaction.value = {
      id: isUpdate.value ? existingTransaction.id : null,
      name: existingTransaction.name,
      amount: existingTransaction.amount,
      type: existingTransaction.type,
      value: existingTransaction.value,
      tags: existingTransaction.tags,
      date: existingTransaction.date
    }
  }
}

function save() {
  if (toggleIncome.value) {
    transaction.value.type = 'Income'
    transaction.value.amount = Math.abs(transaction.value.amount)
  } else {
    transaction.value.type = 'Expense'
    transaction.value.amount = -Math.abs(transaction.value.amount)
  }
  if (isUpdate.value) {
    transactionsStore.updateTransaction(transaction.value.id, transaction.value)
    router.push('/');
    Notify.create({
      message: 'Transaction Updated Successfully',
      type: "positive",
      actions: [
        { icon: 'close', color: 'white', round: true, }
      ]
    })
  } else {
    transactionsStore.addTransaction(transaction.value)
    router.push('/');
    Notify.create({
      message: isClone.value ? 'Transaction Cloned Successfully' : 'Transaction Created Successfully',
      type: "positive",
      actions: [
        { icon: 'close', color: 'white', round: true, }
      ]
    })
  }
}

const tags = ref(transactionsStore.getExpensesTags);



watch(toggleIncome, () => {
  if (toggleIncome.value) {
    tags.value = transactionsStore.getIncomesTags;
  } else {
    tags.value = transactionsStore.getExpensesTags;
  }
})

function cancel() {
  router.push('/')
}
</script>

<template>
  <q-page class="flex items-center column q-my-lg">
    <q-card flat bordered class="form-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 q-mb-md">{{ $t('createTransaction') }}</div>
        <q-space />
        <!-- <q-btn-toggle v-model="toggleIncome" no-caps rounded unelevated toggle-color="primary" color="white"
          text-color="primary" :options="[
            { label: $t('expense'), value: false },
            { label: $t('income'), value: true },
          ]" /> -->
        <div class="q-gutter-sm">
          <q-radio v-model="toggleIncome" :val="false" :label="$t('expense')" color="primary" />
          <q-radio v-model="toggleIncome" :val="true" :label="$t('income')" color="primary" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="save">
          <div v-if="toggleIncome">
            <q-input autocomplete filled v-model="transaction.name" :label="$t('incomeName')" required lazy-rules
              :rules="[val => val && val.length > 0 || $t('incomeNameRequired')]" />

            <q-input filled v-model.number="transaction.amount" type="number" required :label="$t('incomeAmount')" />
          </div>

          <div v-else>
            <q-input autocomplete filled v-model="transaction.name" :label="$t('expenseName')" required lazy-rules
              :rules="[val => val && val.length > 0 || $t('expenseNameRequired')]" />

            <q-input filled v-model.number="transaction.amount" type="number" required :label="$t('expenseAmount')" />
          </div>

          <q-btn icon="event" class="q-my-md" round color="primary">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="transaction.date">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn :label="$t('cancel')" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>

          <q-select class="q-my-md" filled dense options-dense :label="$t('tags')" counter v-model="transaction.tags"
            :options="tags" option-value="id" option-label="name" multiple use-chips map-options clearable>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn type="submit" fab icon="done" color="primary">
            </q-btn>
          </q-page-sticky>
        </q-form>
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn type="submit" fab icon="arrow_back" @click="cancel" color="negative">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass">
.form-card
  width: 100%
  height: 100%
</style>
