<template>
  <!--begin::Menu 2-->
  <div :id="dropdownId"
       class="
      menu
      menu-sub
      menu-sub-dropdown
      menu-column
      menu-rounded
      menu-gray-600
      menu-state-bg-light-primary
      fw-bold
      w-200px
      pb-3
    "
       data-kt-menu="true"
       v-bind="$attrs"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content fs-6 text-dark fw-bolder px-3 py-4">
        {{ title }}
      <span class="text-muted  fs-9 ms-3" v-if="description">{{description}}</span>
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator mb-3 opacity-75"></div>
    <!--end::Menu separator-->
    <slot/>
  </div>
  <div class="overlay"></div>
  <!--end::Menu 2-->
</template>
<style scoped>
.show {
  z-index: 1052 !important;
  box-shadow: 0 0 18px 0 #dad3d3;
}

.overlay {
  display: none;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  animation: 0.5s linear show-animation;
}

.show + .overlay {
  display: block;
  z-index:  1051;
}
@keyframes show-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
<script lang="ts">
import {defineComponent} from "vue";
import {randomId} from "@/custom/helpers/random";

export default defineComponent({
  props: {
    title: {
      default: "ابزار"
    },
    description: [String],
    dropdownId: {
      type: String,
      default: () => {
        return `id-dropdown-${randomId(3)}`;
      },
    },
  }
});
</script>
