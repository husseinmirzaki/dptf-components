<script lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { h } from "vue";

export default {
  setup() {
    return () => {
      return h(VueApexCharts as any, {
        class: "dptf-custom-vue-apex-charts",
      });
    };
  },
};
</script>
<style lang="scss">
.dptf-custom-vue-apex-charts {
  direction: ltr;
}
</style>
