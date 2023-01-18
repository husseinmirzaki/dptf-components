<template>
  <div>
    <ul class="tabs__header">
      <li v-for="tab in tabs" :key="tab.title">{{ tab.title }}</li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";

export default {
  name: "TabsV3",
  setup(props, context) {
    const selectedIndex = ref(0)
    const tabs = ref([])

    onMounted(()=>{
      tabs.value = context.children()
    })

    return{
      selectedIndex,
      tabs,
    }
  }
}
</script>

<style scoped>

</style>