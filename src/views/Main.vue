<script setup lang="ts">
import DriverRegistry from '@/components/DriverRegistry.vue';
import DeletePopUp from '@/components/DeletePopUp.vue';
</script>

<template>
  <main class="bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-mono">
    
    <section class="px-8 py-8 w-screen md:w-200">
      <div class="max-w-screen">
        <img 
        src="@/assets/Images/picture.jpg" 
        alt="Image"
        class="">

      </div>
      <div>
        <p class="py-2 ">adssfasefa</p>
      </div>
    </section>

    <section class="maw-screen flex-1">
      <DriverRegistry />
    </section>

    
   
  </main>
</template>