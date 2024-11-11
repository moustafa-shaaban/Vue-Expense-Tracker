import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: useStorage("expensesStorage", []),
    tags: useStorage("tagsStorage", [
      { id: nanoid(), name: "Food" },
      { id: nanoid(), name: "Salary" },
      { id: nanoid(), name: "Commute" },
    ]),
    totalAmount: 1000,
  }),

  actions: {
    addExpense(expense) {
      this.expenses.push(expense);
      if (expense.increase) {
        this.totalAmount = this.totalAmount + Number(expense.amount)
      } else {
        this.totalAmount = this.totalAmount - Number(expense.amount)
      }
    }
  }
})
