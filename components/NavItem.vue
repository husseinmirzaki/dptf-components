<template>
  <li
      class="nav-item mb-2"
      data-bs-toggle="tooltip"
      data-bs-trigger="hover"
      data-bs-placement="right"
      data-bs-dismiss="click"
      data-bs-original-title="Menu"
  >
    <a
        class="
                nav-link
                btn
                btn-icon
                btn-active-color-primary
                btn-color-gray-400
                btn-active-light
              "
        :class="{
          'active': active
        }"
        data-bs-toggle="tab"
        :href="href"
    >
      <slot>
        <span class="svg-icon svg-icon-2x">
          <inline-svg src="media/icons/duotune/finance/fin006.svg"/>
        </span>
      </slot>
    </a>
  </li>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    active: {
      default: false,
    },
    href: String
  }
});
</script>