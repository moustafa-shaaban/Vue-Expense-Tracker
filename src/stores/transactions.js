import { computed } from 'vue'
import { defineStore } from 'pinia'
import { uid, date } from 'quasar'
import { db } from 'src/db'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    tags: [],
    groupBy: 'month',
    totalAmount: 0,
    filter: {
      searchText: '',
      selectedTypes: [],
      selectedTags: [],
    },
  }),
  persist: {
    pick: ['groupBy', 'totalAmount'],
  },
  getters: {
    filteredTransactions(state) {
      return state.transactions.filter((transaction) => {
        const matchesSearch =
          state.filter.searchText === '' ||
          transaction.name.toLowerCase().includes(state.filter.searchText.toLowerCase()) ||
          transaction.amount.toString().includes(state.filter.searchText)

        const matchesType =
          state.filter.selectedTypes.length === 0 ||
          state.filter.selectedTypes.includes(transaction.type)

        const matchesTags =
          state.filter.selectedTags.length === 0 ||
          state.filter.selectedTags.every((tagId) => transaction.tags.includes(tagId))

        return matchesSearch && matchesType && matchesTags
      })
    },

    tagOptions(state) {
      return state.tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
        color: tag.color,
      }))
    },

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

    getIncomesList: (state) => {
      return state.transactions.filter((transaction) => transaction.type === 'Income')
    },

    getExpensesList: (state) => {
      return state.transactions.filter((transaction) => transaction.type === 'Expense')
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
  },

  actions: {
    async loadData() {
      try {
        const transactionsData = await db.transactions.toArray()
        const tagsData = await db.tags.toArray()
        this.transactions = JSON.parse(JSON.stringify(transactionsData))
        this.tags = JSON.parse(JSON.stringify(tagsData))
      } catch (error) {
        console.error('Error loading data:', error)
        throw error
      }
    },

    setGroupBy(value) {
      this.groupBy = value
    },

    async addTransaction(transaction) {
      const newTransaction = {
        id: uid(),
        name: transaction.name,
        amount: transaction.amount,
        type: transaction.type,
        tags: transaction.tags,
        date: transaction.date || date.formatDate(new Date(), 'YYYY/MM/DD'),
      }
      await db.transactions.add(newTransaction)
      await this.loadData()
    },

    async updateTransaction(transaction) {
      await db.transactions.update(transaction.id, transaction)
      await this.loadData()
    },

    async deleteTransaction(id) {
      await db.transactions.delete(id)
      await this.loadData()
    },

    async addTag(tag) {
      const newTag = {
        id: uid(),
        name: tag.name,
        type: tag.type,
        color: tag.color,
      }
      await db.tags.add(newTag)
      await this.loadData()
    },

    async updateTag(tag) {
      await db.tags.update(tag.id, tag)
      await this.loadData()
    },

    async deleteTag(id) {
      await db.tags.delete(id)
      await this.loadData()
    },
  },
})

// import { computed } from 'vue'
// import { defineStore } from 'pinia'
// import { uid, date } from 'quasar'

// export const useTransactionsStore = defineStore('transactions', {
//   state: () => ({
//     transactions: [],
//     tags: [
//       { id: uid(), name: 'Salary', type: 'income', color: 'indigo' },
//       { id: uid(), name: 'Gift', type: 'income', color: 'teal-6' },
//       { id: uid(), name: 'Freelance', type: 'income', color: 'purple-4' },
//       { id: uid(), name: 'Food', type: 'expense', color: 'red-14' },
//       { id: uid(), name: 'Commute', type: 'expense', color: 'pink-7' },
//       { id: uid(), name: 'Rent', type: 'expense', color: 'red-3' },
//     ],
//     groupBy: 'month',
//     totalAmount: 0,
//   }),
//   persist: true,
//   getters: {
//     balance: (state) => {
//       let balance = computed(() => {
//         return state.transactions.reduce((total, transactions) => {
//           return total + parseInt(transactions.amount)
//         }, 0)
//       })
//       return balance
//     },
//     getExpenses: (state) => {
//       // Source: https://stackoverflow.com/a/43737380
//       let expenses = state.transactions.filter((transaction) => transaction.type === 'Expense')
//       let expensesValue = computed(() => {
//         return expenses.reduce((total, expenes) => {
//           return total + parseInt(expenes.amount)
//         }, 0)
//       })
//       return expensesValue
//       // return state.transactions.filter((transaction) => {
//       //   return transaction.type.find((transaction) => transaction.type === 'Expense')
//       // })
//     },
//     getIncomes: (state) => {
//       // Source: https://stackoverflow.com/a/43737380
//       let incomes = state.transactions.filter((transaction) => transaction.type === 'Income')
//       let incomesValue = computed(() => {
//         return incomes.reduce((total, income) => {
//           return total + parseInt(income.amount)
//         }, 0)
//       })
//       return incomesValue
//     },

//     getIncomesList: (state) => {
//       return state.transactions.filter((transaction) => transaction.type === 'Income')
//     },

//     getExpensesList: (state) => {
//       return state.transactions.filter((transaction) => transaction.type === 'Expense')
//     },

//     getTransactionById: (state) => {
//       return (id) => state.transactions.find((transaction) => transaction.id === id)
//     },

//     getTransactionsByTag: (state) => {
//       return (id) =>
//         state.transactions.filter((transaction) => {
//           return transaction.tags.find((tag) => tag.id === id)
//         })
//     },

//     getTagById: (state) => {
//       return (id) => state.tags.find((tag) => tag.id === id)
//     },

//     getExpensesTags: (state) => {
//       return state.tags.filter((tag) => tag.type === 'expense')
//     },

//     getIncomesTags: (state) => {
//       return state.tags.filter((tag) => tag.type === 'income')
//     },
//   },

//   actions: {
//     setGroupBy(value) {
//       this.groupBy = value
//     },
//     addTransaction(transaction) {
//       const newTransaction = {
//         id: uid(),
//         name: transaction.name,
//         amount: transaction.amount,
//         type: transaction.type,
//         tags: transaction.tags,
//         date: transaction.date || date.formatDate(new Date(), 'YYYY/MM/DD'),
//       }
//       this.transactions.unshift(newTransaction)
//     },

//     updateTransaction(id, newTransaction) {
//       const transactionToEdit = this.transactions.find((transaction) => transaction.id === id)
//       if (transactionToEdit) Object.assign(transactionToEdit, newTransaction)
//       // transactionToEdit.name = newTransaction.name
//       // transactionToEdit.amount = newTransaction.amount
//       // transactionToEdit.type = newTransaction.type
//       // transactionToEdit.tags = newTransaction.tags
//     },

//     deleteTransaction(id) {
//       this.transactions = this.transactions.filter((transaction) => {
//         return transaction.id !== id
//       })
//     },

//     addTag(tag) {
//       this.tags.push(tag)
//     },

//     updateTag(id, newTag) {
//       let transactionsArray = this.transactions.filter((transaction) => {
//         return transaction.tags.find((tag) => tag.id === id)
//       })

//       transactionsArray.forEach((value) => {
//         let tagsArray = value.tags
//         tagsArray.forEach((item) => {
//           item.name = newTag.name
//         })
//       })

//       const tagToEdit = this.tags.find((tag) => tag.id === id)
//       tagToEdit.name = newTag.name
//     },

//     deleteTag(id) {
//       this.transactions.filter((transaction) => {
//         transaction.tags = transaction.tags.find((tag) => {
//           return tag.id !== id
//         })
//       })
//       this.tags = this.tags.filter((tag) => {
//         return tag.id !== id
//       })
//     },
//   },
// })
