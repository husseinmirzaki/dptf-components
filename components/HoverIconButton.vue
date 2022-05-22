<template>
  <a href="#" class="btn w-100 d-flex justify-content-start align-items-center the-nav-buttons" :class="{active}">
    <i class="fas fa-envelope-open-text fs-4 me-2"></i>
    <slot/>
    <span
        class="badge position-absolute" :class="{
          'badge-primary': badgeNumber && (Number(badgeNumber) > 0 && Number(badgeNumber) < 3),
          'badge-warning': badgeNumber && (Number(badgeNumber) > 2 && Number(badgeNumber) < 6),
          'badge-danger': badgeNumber && (Number(badgeNumber) > 5),
        }"
        v-if="badgeNumber">{{ badgeNumber }}</span>
  </a>

</template>
<script>
export default {
  props: ["active", "badgeNumber"]
}
</script>
<style lang="scss">
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