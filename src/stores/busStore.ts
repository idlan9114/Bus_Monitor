import { defineStore } from 'pinia'
import { db, auth } from '@/firebase'
import { ref as dbRef, onValue } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'

export interface BusSensor {
  engine_temp: number
  speed: number
  coolant: number
  tire_pressure: number
  accident: number
  latitude: number
  longitude: number
  time: string
}

export const useBusStore = defineStore('bus', {
  state: () => ({
    sensorData: null as BusSensor | null,
    sensorHistory: [] as BusSensor[],
    loading: false,
    error: '',
  }),

  getters: {
    latestSensor: (state): BusSensor | null =>
      state.sensorHistory[0] ?? null,

    hasError: (state): boolean =>
      state.error !== '',

    isAccident: (state): boolean =>
      state.sensorHistory.some((s) => s.accident === 1),

    averageSpeed: (state): number => {
      if (!state.sensorHistory.length) return 0
      const total = state.sensorHistory.reduce((sum, s) => sum + s.speed, 0)
      return Math.round(total / state.sensorHistory.length)
    },
  },

  actions: {
    fetchAllSensorData() {
      this.loading = true
      this.error = ''

      onAuthStateChanged(auth, (user) => {
        if (!user) {
          this.error = 'Not authenticated.'
          this.loading = false
          return
        }

        const sensorRef = dbRef(db, '/sensor_data')
        onValue(
          sensorRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const allData = snapshot.val() as Record<string, BusSensor>
              this.sensorHistory = Object.values(allData).reverse()
              this.sensorData = this.sensorHistory[0] ?? null
            } else {
              this.error = 'No sensor data found.'
            }
            this.loading = false
          },
          () => {
            this.error = 'Failed to fetch sensor data.'
            this.loading = false
          },
        )
      })
    },

    clearError() {
      this.error = ''
    },

    resetStore() {
      this.sensorData = null
      this.sensorHistory = []
      this.loading = false
      this.error = ''
    },
  },
})