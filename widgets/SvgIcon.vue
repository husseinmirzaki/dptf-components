<template>
  <span class="svg-icon svg-icon-primary" :class="[sizeClass]">
    <slot/>
  </span>
</template>
<script>
export default {
  props: {
    sizeClass: {
      default: 'svg-icon-2x',
    }
  },
}
</script>