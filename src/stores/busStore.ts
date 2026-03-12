import { defineStore } from 'pinia'
import { ref } from 'vue'
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

export const useBusStore = defineStore('bus', () => {
  const sensorData = ref<BusSensor | null>(null)
  const sensorHistory = ref<BusSensor[]>([])
  const loading = ref(false)
  const error = ref('')

  function fetchAllSensorData() {
    loading.value = true
    error.value = ''

    // ✅ Wait for auth before reading DB
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        error.value = 'Not authenticated.'
        loading.value = false
        return
      }

      const sensorRef = dbRef(db, '/sensor_data')
      onValue(sensorRef, (snapshot) => {
        if (snapshot.exists()) {
          const allData = snapshot.val() as Record<string, BusSensor>
          sensorHistory.value = Object.values(allData).reverse()
        } else {
          error.value = 'No sensor data found.'
        }
        loading.value = false
      }, () => {
        error.value = 'Failed to fetch sensor data.'
        loading.value = false
      })
    })
  }

  return { sensorData, sensorHistory, loading, error, fetchAllSensorData }
})