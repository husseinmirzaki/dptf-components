<template>
  <Card
      body-padding-class="p-1"
      card-title="یک ابزار"
      :disable-drag="true"
      class="w-100 h-100px bg-light">

  </Card>
</template>
<script lang="ts">
import Card from "@/custom/components/Card.vue";

export default {
  props: {
    activationKey: String,
  },
  name: "MapToolsWindow",
  components: {Card},
}
</script>