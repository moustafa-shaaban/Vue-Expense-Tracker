import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { date } from 'quasar'
import moment from 'moment'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: useStorage("transactionsStorage", []),
    tags: useStorage("tagsStorage", [
      { id: nanoid(), name: "Food" },
      { id: nanoid(), name: "Salary" },
      { id: nanoid(), name: "Commute" },
    ]),

    totalAmount: useStorage("totalAmount", 0),
  }),

  getters: {
    balance: (state) => {
      let balance = computed(() => {
        return state.transactions.reduce((total, transactions) => {
          return total + parseInt(transactions.amount)
        }, 0)
      })
      return balance
    },
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
    },

    getTransactionById: (state) => {
      return (id) => state.transactions.find((transaction) => transaction.id === id);
    },

    getTransactionsByTag: (state) => {
      return (id) => state.transactions.filter((transaction) => {
        return transaction.tags.find((tag) => tag.id === id);
      });
    },

    getTagById: (state) => {
      return (id) => state.tags.find((tag) => tag.id === id);
    },

    // groups: (state) => {
    //   // Source: https://stackoverflow.com/a/53108499
    //   let groupedTransactions = {};

    //   state.transactions.forEach((transaction) => {
    //     const month = moment(transaction.dateAdded).month();
    //     groupedTransactions[month] = groupedTransactions[month] || [];
    //     groupedTransactions[month].push(transaction);
    //   })

    //   return groupedTransactions;
    // }
  },

  actions: {
    addTransaction(transaction) {
      
      this.transactions.push(transaction);
    },

    updateTransaction(id, newTransaction) {
      const transactionToEdit = this.transactions.find((transaction) => transaction.id === id);
      // transactionToEdit = newTransaction
      // transactionToEdit.name = newTransaction.name;
      // transactionToEdit.amount = newTransaction.amount;
      // transactionToEdit.type = newTransaction.type;
      // transactionToEdit.tags = newTransaction.tags;
  
    },

    deleteTransaction(id) {
      this.transactions = this.transactions.filter((transaction) => {
        return transaction.id !== id;
      })
    },

    addTag(tag) {
      this.tags.push(tag);
    },

    updateTag(id, newTag) {
      const tagToEdit = this.tags.find((tag) => tag.id === id);
      tagToEdit.name = newTag.name;
    },

    deleteTag(id) {
      this.transactions.filter((transaction) => {
        transaction.tags.find((tag) => tag.id === id);

        transaction.tags = transaction.tags.filter((tag) => {
          return tag.id !== id;
        });
      });
      this.tags = this.tags.filter((tag) => {
        return tag.id !== id;
      });
    }
  }
})
