import { defineStore } from 'pinia'
import { db, auth } from '@/firebase'
import { ref as dbRef, push, onValue, remove } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'

export interface Driver {
  key?: string
  id: string
  name: string
  age: number
}

export const useDriverStore = defineStore('driver', {
  state: () => ({
    drivers: [] as Driver[],
    loading: false,
    error: '',
  }),

  getters: {
    totalDrivers: (state): number =>
      state.drivers.length,

    hasError: (state): boolean =>
      state.error !== '',

    getDriverById: (state) => (id: string): Driver | undefined =>
      state.drivers.find((d) => d.id === id),

    averageAge: (state): number => {
      if (!state.drivers.length) return 0
      const total = state.drivers.reduce((sum, d) => sum + d.age, 0)
      return Math.round(total / state.drivers.length)
    },
  },

  actions: {
    fetchDrivers() {
      this.loading = true
      this.error = ''

      const driversRef = dbRef(db, 'driver_data')

      onAuthStateChanged(auth, (user) => {
        if (!user) {
          this.error = 'Not authenticated.'
          this.loading = false
          return
        }

        onValue(
          driversRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val()
              this.drivers = Object.entries(data).map(([key, val]: [string, any]) => ({
                key,
                id: val.id,
                name: val.name,
                age: val.age,
              }))
            } else {
              this.drivers = []
            }
            this.loading = false
          },
          () => {
            this.error = 'Failed to fetch driver data.'
            this.loading = false
          },
        )
      })
    },

    async addDriver(name: string, age: number, id: string) {
      if (!name.trim() || !id.trim()) return
      try {
        await push(dbRef(db, 'driver_data'), { id, name, age })
      } catch {
        this.error = 'Failed to add driver.'
      }
    },

    async deleteDriver(key: string) {
      try {
        await remove(dbRef(db, `driver_data/${key}`))
      } catch {
        this.error = 'Failed to delete driver.'
      }
    },

    clearError() {
      this.error = ''
    },

    resetStore() {
      this.drivers = []
      this.loading = false
      this.error = ''
    },
  },
})