<script setup lang="ts">
import { ref } from 'vue'
import { useDriverStore } from '@/stores/driverStore'

const store = useDriverStore()

const confirmKey = ref<string | null>(null)
const confirmName = ref<string>('')

function confirmDelete() {
  if (confirmKey.value) {
    store.deleteDriver(confirmKey.value)
    confirmKey.value = null
    confirmName.value = ''
  }
}

function cancelDelete() {
  confirmKey.value = null
  confirmName.value = ''
}

function askDelete(key: string, name: string) {
  confirmKey.value = key
  confirmName.value = name
}

defineExpose({ askDelete })
</script>

<template>

    <div
      v-if="confirmKey"
      class="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="cancelDelete"
    >
      <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-80 flex flex-col gap-5 shadow-2xl">

        <div class="flex justify-center">
          <div class="w-12 h-12 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center text-2xl">
            🗑️
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-white font-bold text-lg tracking-tight">Delete Driver?</h2>
          <p class="text-zinc-400 text-sm mt-1">
            Are you sure you want to delete
            <span class="text-white font-semibold">{{ confirmName }}</span>?
            This cannot be undone.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-2 text-sm font-bold text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 active:scale-95 transition-all"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
    
</template>