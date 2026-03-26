<script setup lang="ts">
  
  import { useNow } from '@vueuse/core'
  const { now } = useNow({ controls: true })


</script>

<<template>
  <div>

    <div class="">
      {{ now }}
    </div>

  </div>
</template>