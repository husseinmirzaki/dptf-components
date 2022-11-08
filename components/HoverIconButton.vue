<template>
  <a
    href="#"
    class="btn w-100 d-flex justify-content-start align-items-center the-nav-buttons"
    :class="{ active }"
  >
    <i
      v-if="iconClass"
      :class="iconClass"
      class="fs-4 me-2"
      style="width: 18px"
    ></i>
    <i v-else class="fas fa-envelope-open-text fs-4 me-2"></i>
    <b v-if="bold">
      <slot />
    </b>
    <slot v-else />

    <span class="position-absolute">
      <span
        v-if="badgeText"
        class="badge other-badge"
        :class="{
          'badge-danger': color,
          'text-dark': !color,
        }"
      >
        <template v-if="bold">
          <b>{{ badgeText }}</b>
        </template>
        <template v-else>
          {{ badgeText }}
        </template>
      </span>

      <span
        class="main-badge badge"
        :class="{
          'badge-primary':
            color &&
            badgeNumber &&
            Number(badgeNumber) > 0 &&
            Number(badgeNumber) < 3,
          'badge-warning':
            color &&
            badgeNumber &&
            Number(badgeNumber) > 2 &&
            Number(badgeNumber) < 6,
          'badge-danger': color && badgeNumber && Number(badgeNumber) > 5,
          'badge-dark': !color,
        }"
        v-if="badgeNumber"
        >{{ badgeNumber }}</span
      >
    </span>
  </a>
</template>
<style scoped>
b {
  text-shadow: 0 0 1px #000, 1px 0 1px #fff;
}
</style>
<script>
export default {
  props: {
    active: {
      default: false,
    },
    badgeNumber: {
      default: 0,
    },
    iconClass: {
      default: "",
    },
    badgeText: {
      default: "",
    },
    color: {
      default: true,
    },
    bold: {
      default: false,
    },
  },
};
</script>
<style lang="scss">
.the-nav-buttons {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  font-size: 12px;

  position: relative;
  margin-top: 3px;
  padding: 5px 5px 5px 35px !important;

  &.active {
    background-color: rgba(70, 70, 248, 0.22);
  }

  &:not(.active):hover {
    background-color: rgba(56, 56, 124, 0.22);
  }

  > span {
    left: 6px;
    top: 50% !important;
    transform: translateY(-50%);
    font-size: 10px;
    padding: 6px;
  }
}
</style>
