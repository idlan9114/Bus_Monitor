<script setup lang="ts">
import { onMounted } from 'vue'
import { useBusStore } from '@/stores/busStore'
import Datetime from '@/components/Datetime.vue'

const store = useBusStore()

onMounted(() => {
  store.fetchAllSensorData()  
})
</script>

<template>
  <main class="min-h-screen bg-[#0d1117] p-6 font-mono max-w-screen">

    <header>   
    <div class="mb-6 border-b border-[#30363d] pb-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#e6edf3] tracking-widest uppercase">
            BUS SENSOR MONITOR
          </h1>
          <p class="text-[#8b949e] text-xs mt-1 tracking-wider">REALTIME IOT DATA · LAST 30 RECORDS</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          <span class="text-green-400 text-xs tracking-widest">LIVE</span>
        </div>
      </div>
    </div>
    </header>

    <!-- Loading -->
    <div v-if="store.loading" class="flex justify-center items-center h-64">
      <div class="text-[#58a6ff] text-sm tracking-widest animate-pulse">FETCHING DATA...</div>
    </div>


    <!-- Table -->
    <div v-else-if="store.sensorHistory?.length" class="overflow-x-auto rounded-[10px] border border-[#30363d]">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-[#161b22] border-b border-[#30363d]">
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"></th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> TIMESTAMP</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> ENG TEMP</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> SPEED</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> COOLANT</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> TIRE PSI</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> ACCIDENT</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> LAT</th>
            <th class="text-left px-4 py-3 text-[#8b949e] text-xs tracking-widest font-semibold"> LNG</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in store.sensorHistory.slice(0, 30)"
            :key="index"
            class="border-b border-[#21262d] transition-colors duration-150"
            :class="[
              row.accident === 1
                ? 'bg-red-900/20 hover:bg-red-900/30'
                : index % 2 === 0
                  ? 'bg-[#0d1117] hover:bg-[#161b22]'
                  : 'bg-[#111318] hover:bg-[#161b22]'
            ]"
          >
            <!-- Row # -->
            <td class="px-4 py-3 text-[#484f58] text-xs">{{ index + 1 }}</td>

            <!-- Timestamp -->
            <td class="px-4 py-3 text-[#8b949e] text-xs whitespace-nowrap">{{ row.time }}</td>

            <!-- Engine Temp -->
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="font-bold text-sm"
                :class="row.engine_temp >= 100 ? 'text-red-400' : row.engine_temp >= 85 ? 'text-yellow-400' : 'text-green-400'"
              >
                {{ row.engine_temp }}°C
              </span>
              <span
                v-if="row.engine_temp >= 90"
                class="ml-2 text-xs px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 border border-red-800"
              >HOT</span>
            </td>

            <!-- Speed -->
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="font-bold text-sm"
                :class="row.speed > 90 ? 'text-red-400' : row.speed > 70 ? 'text-yellow-400' : 'text-[#58a6ff]'"
              >
                {{ row.speed }} km/h
              </span>
              <span
                v-if="row.speed > 100"
                class="ml-2 text-xs px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 border border-red-800"
              >OVERSPEED</span>
            </td>

            <!-- Coolant -->
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="font-bold text-sm"
                :class="row.coolant < 30 ? 'text-red-400' : row.coolant < 50 ? 'text-yellow-400' : 'text-cyan-400'"
              >
                {{ row.coolant }}%
              </span>
            </td>

            <!-- Tire Pressure -->
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="font-bold text-sm"
                :class="(row.tire_pressure < 28 || row.tire_pressure > 38) ? 'text-red-400' : 'text-green-400'"
              >
                {{ row.tire_pressure }} PSI
              </span>
              <span
                v-if="row.tire_pressure < 28 || row.tire_pressure > 38"
                class="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-900/50 text-yellow-400 border border-yellow-800"
              >WARN</span>
            </td>

            <!-- Accident -->
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded"
                :class="row.accident === 1
                  ? 'bg-red-900/60 text-red-300 border border-red-700 animate-pulse'
                  : 'bg-green-900/30 text-green-400 border border-green-900'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="row.accident === 1 ? 'bg-red-400' : 'bg-green-400'"></span>
                {{ row.accident === 1 ? 'DETECTED' : 'CLEAR' }}
              </span>
            </td>

            <!-- Latitude -->
            <td class="px-4 py-3 text-[#8b949e] text-xs">{{ row.latitude?.toFixed(4) }}</td>

            <!-- Longitude -->
            <td class="px-4 py-3 text-[#8b949e] text-xs">{{ row.longitude?.toFixed(4) }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    <div v-else class="text-center text-[#484f58] text-sm py-20 tracking-widest">
      NO DATA AVAILABLE
    </div>

  <footer class="flex justify-between">

    <p>
      <Datetime class="text-left text-[#484f58] text-xs mt-3 tracking-wider"/>
    </p>
    <p v-if="store.sensorHistory?.length" class="text-right text-[#484f58] text-xs mt-3 tracking-wider">
      SHOWING {{ Math.min(store.sensorHistory.length, 30) }} OF {{ store.sensorHistory.length }} RECORDS
    </p>
    
  </footer>
    

  </main>
</template>