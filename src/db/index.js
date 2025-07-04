import Dexie from 'dexie'
import { uid } from 'quasar'

export const db = new Dexie('TransactionsDB')

db.version(1).stores({
  transactions: 'id, name, amount, type, date, *tags',
  tags: 'id, name, type, color',
})

// Add initialization data when database is first created
db.on('populate', async () => {
  try {
    await db.tags.bulkAdd([
      { id: uid(), name: 'Salary', type: 'income', color: 'indigo' },
      { id: uid(), name: 'Gift', type: 'income', color: 'teal-6' },
      { id: uid(), name: 'Freelance', type: 'income', color: 'purple-4' },
      { id: uid(), name: 'Food', type: 'expense', color: 'red-14' },
      { id: uid(), name: 'Commute', type: 'expense', color: 'pink-7' },
      { id: uid(), name: 'Rent', type: 'expense', color: 'red-3' },
    ])
  } catch (error) {
    console.error('Error populating default tags:', error)
  }
})
