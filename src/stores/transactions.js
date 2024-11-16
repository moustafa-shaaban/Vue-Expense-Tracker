import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: useStorage("transactionsStorage", []),
    tags: useStorage("tagsStorage", [
      { id: nanoid(), name: "Food" },
      { id: nanoid(), name: "Salary" },
      { id: nanoid(), name: "Commute" },
    ]),
    totalAmount: useStorage("totalAmount", 0),
    totalIncomes: useStorage("totalIncomes", 0),
    totalExpenses: useStorage("totalExpenses", 0),
  }),

  getters: {
    getExpenses: (state) => {
      // Source: https://stackoverflow.com/a/43737380
      let expenses = state.transactions.filter((transaction) => transaction.type === 'Expense')
      let expensesValue = computed(() => {
        return expenses.reduce((total, expenes) => {
          return total + parseInt(expenes.amount)
        }, 0)
      });
      return expensesValue;
      // return state.transactions.filter((transaction) => {
      //   return transaction.type.find((transaction) => transaction.type === 'Expense')
      // })
    },
    getIncomes: (state) => {
      // Source: https://stackoverflow.com/a/43737380
      let incomes = state.transactions.filter((transaction) => transaction.type === 'Income')
      let incomesValue = computed(() => {
        return incomes.reduce((total, income) => {
          return total + parseInt(income.amount)
        }, 0)
      });
      return incomesValue;
    }
  },

  actions: {
    addTransaction(transaction) {
      this.transactions.push(transaction);
      if (transaction.transactionValue) {
        this.totalAmount = this.totalAmount + Number(transaction.amount)
        this.totalIncomes = this.totalIncomes + Number(transaction.amount)
      } else {
        this.totalAmount = this.totalAmount - Number(transaction.amount)
        this.totalExpenses = this.totalExpenses - Number(transaction.amount)
      }
    }
  }
})
