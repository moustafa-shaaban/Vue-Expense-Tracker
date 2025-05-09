import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { uid } from 'quasar'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: useStorage('transactionsStorage', []),
    tags: useStorage('tagsStorage', [
      { id: uid(), name: 'Salary', type: 'income', color: 'indigo' },
      { id: uid(), name: 'Gift', type: 'income', color: 'teal-6' },
      { id: uid(), name: 'Freelance', type: 'income', color: 'purple-4' },
      { id: uid(), name: 'Food', type: 'expense', color: 'red-14' },
      { id: uid(), name: 'Commute', type: 'expense', color: '#pink-7' },
      { id: uid(), name: 'Rent', type: 'expense', color: 'red-3' },
    ]),

    totalAmount: useStorage('totalAmount', 0),
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
      })
      return expensesValue
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
      })
      return incomesValue
    },

    getTransactionById: (state) => {
      return (id) => state.transactions.find((transaction) => transaction.id === id)
    },

    getTransactionsByTag: (state) => {
      return (id) =>
        state.transactions.filter((transaction) => {
          return transaction.tags.find((tag) => tag.id === id)
        })
    },

    getTagById: (state) => {
      return (id) => state.tags.find((tag) => tag.id === id)
    },

    getExpensesTags: (state) => {
      return state.tags.filter((tag) => tag.type === 'expense')
    },

    getIncomesTags: (state) => {
      return state.tags.filter((tag) => tag.type === 'income')
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
      const newTransaction = {
        id: uid(),
        name: transaction.name,
        amount: transaction.amount,
        type: transaction.type,
        tags: transaction.tags,
        date: transaction.date || Date.now(),
      }
      this.transactions.unshift(newTransaction)
    },

    updateTransaction(id, newTransaction) {
      const transactionToEdit = this.transactions.find((transaction) => transaction.id === id)
      if (transactionToEdit) Object.assign(transactionToEdit, newTransaction)
      // transactionToEdit.name = newTransaction.name
      // transactionToEdit.amount = newTransaction.amount
      // transactionToEdit.type = newTransaction.type
      // transactionToEdit.tags = newTransaction.tags
    },

    deleteTransaction(id) {
      this.transactions = this.transactions.filter((transaction) => {
        return transaction.id !== id
      })
    },

    addTag(tag) {
      this.tags.push(tag)
    },

    updateTag(id, newTag) {
      let transactionsArray = this.transactions.filter((transaction) => {
        return transaction.tags.find((tag) => tag.id === id)
      })

      transactionsArray.forEach((value) => {
        let tagsArray = value.tags
        tagsArray.forEach((item) => {
          item.name = newTag.name
        })
      })

      const tagToEdit = this.tags.find((tag) => tag.id === id)
      tagToEdit.name = newTag.name
    },

    deleteTag(id) {
      this.transactions.filter((transaction) => {
        transaction.tags = transaction.tags.find((tag) => {
          return tag.id !== id
        })
      })
      this.tags = this.tags.filter((tag) => {
        return tag.id !== id
      })
    },
  },
})
