<template>
  <Card body-padding-class="p-0 flex-grow-0">
    <template v-slot:toolbar>
      <button
        type="button"
        class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="top-end"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="media/icons/duotune/general/gen024.svg" />
        </span>
      </button>
      <DropdownV2>
        <ChartCardToolbarButtons
          :horizontal="true"
          @stateChanged="
            toggleState = $event.toggleState;
            reportState = $event.reportState;
          "
        />
      </DropdownV2>
    </template>

    <template v-slot:card-content>
      <slot :name="toggleState" />
    </template>
  </Card>
</template>
<script>
import Card from "@/custom/components/Card";
import { MenuComponent } from "@/assets/ts/components";
import ChartCardToolbarButtons from "@/custom/components/ChartCardToolbarButtons";
import DropdownV2 from "@/custom/components/DropdownV2";
import { onMounted, ref, watch } from "vue";

export default {
  components: { DropdownV2, ChartCardToolbarButtons, Card },
  emits: ["toggleStateChanged", "reportStateChanged"],
  setup(props, context) {
    const toggleState = ref("chart");
    const reportState = ref("weekly");

    watch(toggleState, () => {
      context.emit("toggleStateChanged", toggleState.value);
    });

    watch(reportState, () => {
      context.emit("reportStateChanged", reportState.value);
    });

    onMounted(() => {
      MenuComponent.reinitialization();
    });

    return {
      reportState,
      toggleState,
    };
  },
};
</script>
