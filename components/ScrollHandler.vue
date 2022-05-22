<template>
  <div>
    <div
        ref="root"
        class="hover-scroll-y bg-transparent p-2"
        :class="[{
          'flex-column-fluid': isFluid,
        }, paddingClass]"
        @scroll="$emit('scroll', $event)"
        :id="bodyId"
        data-kt-scroll="true"
        data-kt-scroll-activate="true"
        :data-kt-scroll-max-height="maxHeight"
        :data-kt-scroll-dependencies="dependencies"
        :data-kt-scroll-wrappers="wrappers"
        :data-kt-scroll-offset="`${offset}px`"
    >
      <slot/>
    </div>
  </div>
</template>

<script type="ts">
import {randomId} from "@/custom/helpers/random";
import {defineComponent, ref, toRef} from "vue";
import {ScrollComponent} from "@/assets/ts/components";

export default defineComponent({
  name: "scroll-handler",
  props: {
    "wrappers": String,
    "isFluid": {
      default: true
    },
    "maxHeight": {
      default: "auto",
    },
    "paddingClass": {
      default: "",
    },
    "offset": {
      default: 0,
    },
    "activate": {
      default: "{default: false, lg: true}",
    },
    "dependencies": {
      default: 'false'
    },
    "bodyClass": {
      default: "modal-body py-10 px-lg-17"
    },
    "bodyId": {
      default: () => {
        return `id-body-${randomId(3)}`;
      }
    }
  },
  setup(props) {
    const root = ref();
    const update = () => {
      if (root.value) {
        ScrollComponent.getInstance(root.value).update();
      }
    }
    return {
      root,
      update
    }
  }
});
</script>

<style scoped>

</style>