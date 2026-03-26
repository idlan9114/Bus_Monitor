<script setup lang="ts">

import { ref, onMounted, computed } from 'vue'
import { useDriverStore } from '@/stores/driverStore'
import DeletePopUp from '@/components/DeletePopUp.vue'


const store = useDriverStore()

const newDriverName = ref("")
const newDriverAge = ref<number | null>(null)
const deletePopUp = ref<InstanceType<typeof DeletePopUp> | null>(null)

const nextDriverID = computed(() => {
  const ids = store.drivers
    .map(d => d.id)
    .filter(id => /^CD\d+$/.test(id))
    .map(id => parseInt(id.replace('CD', '')))
  
  const max = ids.length > 0 ? Math.max(...ids) : 0
  return `CD${String(max + 1).padStart(3, '0')}`
})

onMounted(() => {
  store.fetchDrivers()
})

function addDriver() {
    store.addDriver(
    newDriverName.value,
    newDriverAge.value ?? 0,
    nextDriverID.value
  )
  newDriverName.value = ""
  newDriverAge.value = null
}

</script>

<template>
    <main class="flex-1 p-10 flex flex-col gap-8 min-h-screen max-w-screen">

      <div class="flex items-center justify-between">
        <h1 class="text-[20px] md:text-2xl font-bold tracking-tight text-white">Driver Registry</h1>
        <span class="text-xs text-zinc-500 tracking-widest uppercase">{{ store.drivers.length }} drivers</span>
      </div>

      <div class="rounded-lg border border-zinc-800 overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-widest">
            <tr>
              <th class="text-left px-5 py-3 font-medium">Name</th>
              <th class="text-left px-5 py-3 font-medium">Age</th>
              <th class="text-left px-5 py-3 font-medium">ID</th>
              <th class="text-left px-5 py-3 font-medium">🗑️</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800">
            <tr
              v-for="driver in store.drivers"
              :key="driver.id"
              class="hover:bg-zinc-700 transition-colors"
            >
              <td class="px-5 py-3 text-white">{{ driver.name }}</td>
              <td class="px-5 py-3 text-white">{{ driver.age }}</td>
              <td class="px-5 py-3 text-white">{{ driver.id }}</td>
              <td class="px-5 py-3">
                <button @click="deletePopUp?.askDelete(driver.key!, driver.name)" class="opacity-100 hover:opacity-50">⛔</button>
              </td>
            </tr>
            <tr v-if="store.drivers.length === 0">
              <td colspan="4" class="px-5 py-8 text-center text-zinc-600">No drivers yet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Driver Form -->
      <div class="flex flex-wrap gap-3 items-center max-w-screen min-w-35">
        <input
          type="text"
          v-model="newDriverName"
          placeholder="Name..."
          class="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
        />
        <input
          type="number"
          v-model="newDriverAge"
          placeholder="Age..."
          class="w-24 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
        />

        <button
          @click="addDriver"
          class="px-4 py-2 bg-white text-zinc-950 text-sm font-bold rounded hover:bg-zinc-200 active:scale-95 transition-all shrink-0"
        >
          Add Driver
        </button>
      </div>

      <DeletePopUp ref="deletePopUp"/>

    </main>
</template>