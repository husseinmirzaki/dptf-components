<template>
  <div class="d-flex" :class="{ 'flex-column': horizontal }">
    <a
      :class="{
        active: localOptions.reportState == 'daily',
      }"
      @click="localOptions['reportState'] = 'daily'"
      class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1"
      >سالانه</a
    >
    <a
      :class="{
        active: localOptions.reportState == 'monthly',
      }"
      @click="localOptions['reportState'] = 'monthly'"
      class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1"
      >ماهانه</a
    >
    <a
      :class="{
        active: localOptions.reportState == 'weekly',
      }"
      @click="localOptions['reportState'] = 'weekly'"
      class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4"
      >هفتگی</a
    >
    <a
      v-if="localOptions.showDaily"
      :class="{
        active: localOptions.reportState == 'daily',
      }"
      @click="localOptions['reportState'] = 'daily'"
      class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4"
      >روزانه</a
    >
    <div
      class="vertical-divider"
      v-if="!horizontal && localOptions.showMapToggle"
    ></div>
    <div
      class="separator mb-3 opacity-75"
      v-if="horizontal && localOptions.showMapToggle"
    ></div>
    <a
      v-if="localOptions.showMapToggle"
      :class="{
        active: localOptions.toggleState == 'map',
      }"
      @click="localOptions['toggleState'] = 'map'"
      class="btn btn-sm btn-color-muted btn-active btn-active-warning px-4 me-1"
      >نقشه</a
    >
    <a
      v-if="localOptions.showMapToggle"
      :class="{
        active: localOptions.toggleState == 'chart',
      }"
      @click="localOptions['toggleState'] = 'chart'"
      class="btn btn-sm btn-color-muted btn-active btn-active-warning px-4 me-1"
      >نمودار</a
    >
  </div>
</template>
<script>
import { ref, toRef, watch } from "vue";

export default {
  props: {
    horizontal: {
      default: false,
    },
    options: {
      default: () => {
        return {};
      },
    },
    state: {
      default: () => {
        return {
          reportState: "weekly",
          toggleState: "chart",
        };
      },
    },
  },
  setup(props, context) {
    const localOptions = ref({
      showDaily: false,
      showMapToggle: true,
      reportState: "weekly",
      toggleState: "chart",
    });
    const options = toRef(props, "options");

    options.value = Object.assign(localOptions.value, options.value);

    watch(
      localOptions,
      () => {
        context.emit("stateChanged", localOptions.value);
      },
      {
        deep: true,
      }
    );

    return {
      localOptions,
    };
  },
};
</script>
