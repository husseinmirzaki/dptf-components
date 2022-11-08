<template>
  <div>
    <i class="fa fa-square" :class="{ 'd-none': state !== 0 }"></i>
    <i class="fa fa-plus-square" :class="{ 'd-none': state !== 1 }"></i>
    <i class="fa fa-minus-square" :class="{ 'd-none': state !== 2 }"></i>
  </div>
</template>
<script>
export default {
  props: {
    state: {
      default: () => 0,
    },
  },
};
</script>
