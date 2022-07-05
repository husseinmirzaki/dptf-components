<template>
  <div class="d-flex justify-content-center align-items-center">
    <slot name="tabs" v-if="show" :setActiveItem="setActiveItem"/>
  </div>
  <div class="d-flex justify-content-center align-items-center">
    <slot :name="tabNames[activeItem]"/>
  </div>
</template>
<script>
import {onMounted, ref} from "vue";

export default {
  props: {
    activeIndex: {
      default: 0,
    }
  },
  setup(props, context) {
    const show = ref(false)
    const activeContent = ref('')
    const activeItem = ref(props.activeIndex);

    let childCounter = 0;
    let tabNames = ref([]);

    const setActiveItem = (index) => {
      activeItem.value = index;
    }

    const introduce = (tabName) => {
      console.log(tabName)
      const current = childCounter;
      if (tabName) {
        tabNames.value.push(tabName);
      } else {
        tabNames.value.push(`tab_${current}`);
      }
      childCounter++;
      return current;
    }

    onMounted(() => {
      tabNames.value = [];
      show.value = true;
    })

    return {
      // data
      activeContent,
      activeItem,
      tabNames,
      show,

      // function
      setActiveItem,
      introduce,
    }
  }
}
</script>
<style lang="scss">
.tab-item {

}
</style>