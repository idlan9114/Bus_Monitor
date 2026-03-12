import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, auth } from '@/firebase'
import { ref as dbRef, push, onValue, remove } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'

export interface Driver {
  key?: string
  id: string
  name: string
  age: number
}

export const useDriverStore = defineStore('driver', () => {
  const drivers = ref<Driver[]>([])
  const loading = ref(false)
  const error = ref('')

  const driversRef = dbRef(db, 'driver_data')

  function fetchDrivers() {
    loading.value = true
    error.value = ''

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        error.value = 'Not authenticated.'
        loading.value = false
        return
      }

      onValue(driversRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          drivers.value = Object.entries(data).map(([key, val]: [string, any]) => ({
            key,
            id: val.id,
            name: val.name,
            age: val.age,
          }))
        } else {
          drivers.value = []
        }
        loading.value = false
      }, () => {
        error.value = 'Failed to fetch driver data.'
        loading.value = false
      })
    })
  }

  async function addDriver(name: string, age: number, id: string) {
    if (!name.trim() || !id.trim()) return
    await push(driversRef, { id, name, age })
  }

  async function deleteDriver(key: string) {
    await remove(dbRef(db, `driver_data/${key}`))
  }

  return { drivers, loading, error, fetchDrivers, addDriver, deleteDriver }
})