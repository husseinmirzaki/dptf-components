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
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content fs-6 text-dark fw-bolder px-3 py-4">
        {{ title }}
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator mb-3 opacity-75"></div>
    <!--end::Menu separator-->
    <slot/>
  </div>
  <!--end::Menu 2-->
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {randomId} from "@/custom/helpers/random";
import MenuItemModel from "@/custom/models/MenuItemModel";

export default defineComponent({
  props: {
    title: {
      default: "ابزار"
    },
    dropdownId: {
      type: String,
      default: () => {
        return `id-dropdown-${randomId(3)}`;
      },
    },
  }
});
</script>
