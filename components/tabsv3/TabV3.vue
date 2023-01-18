<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "TabV3",
  props: {
    title: {
      type: String,
      default: 'Tab'
    }
  },
  setup() {
    const isActive = ref(true)
    return {
      isActive
    }
  }
}
</script>

<style scoped>

</style>