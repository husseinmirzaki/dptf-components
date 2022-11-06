<template>
  <div
    href="#"
    class="btn w-100 d-flex justify-content-between align-items-center the-nav-buttons"
    :class="{ active }"
  >
    <div class="col-8">
      <i v-if="iconClass" :class="iconClass" class="fs-4 me-2"></i>
      <i v-else class="fas fa-envelope-open-text fs-4 me-2"></i>
      <slot />
    </div>
    <div class="col-4">
      <button
        class="btn btn-icon btn-secondary"
        @click="$emit('update', $event)"
      >
        <i class="fa fa-edit"></i>
      </button>
      <button
        class="btn btn-icon btn-secondary ml-2"
        @click="$emit('delete', $event)"
      >
        <i class="fa fa-trash"></i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['active', 'badgeNumber', 'iconClass', 'badgeText'],
};
</script>
<style lang="scss" scoped>
.the-nav-buttons {
  font-size: 12px;

  position: relative;
  margin-top: 5px;
  padding-left: 35px !important;
  padding-right: 5px !important;

  &.active {
    background-color: rgba(70, 70, 248, 0.22);
  }

  &:not(.active):hover {
    background-color: rgba(56, 56, 124, 0.22);
  }

  span {
    left: 6px;
    top: 50% !important;
    transform: translateY(-50%);
    font-size: 10px;
    padding: 6px;
  }
}
</style>
