<template>
  <div class="helper show" ref="helper">
    <div class="helper-content"></div>
    <div class="helper-overlay"></div>
    <slot/>
  </div>
</template>
<script lang="ts">
import {onMounted, ref} from "vue";

export default {
  setup() {
    const helper = ref();

    onMounted(() => {
      helper.value.lastElementChild.classList.add('helper-child')
    })

    return {helper};
  },
}
</script>
<style lang="scss" scoped>
.helper {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}


.show {
  &.helper {
  }
  .helper-overlay {
    position: absolute;
    width: 10px;
    height: 10px;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 9999;
    border-radius: 9999px;
    box-shadow: 0 0 0 150px rgba(0, 0, 0, .8);
  }
}
</style>