<template>
  <LControl position="topright">
    <div class="w-350px" v-if="$slots['default']">
      <slot/>
    </div>
  </LControl>
</template>
<script lang="ts">
import {LControl} from "@vue-leaflet/vue-leaflet"

export default {
  name: "MapToolsWindow",
  components: {LControl},
}
</script>