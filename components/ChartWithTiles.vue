<template>
  <!--begin::Mixed Widget 1-->
  <card ref="root" class="card card-xxl-stretch" body-padding-class="p-0">
    <template v-slot:card-header>
      <div :class="`bg-${widgetColor}`" class="card-header border-0 py-5">
        <h3 class="card-title fw-bolder text-white">{{ cardTitle }}</h3>
      </div>
    </template>
    <template v-slot:card-content>
      <!--begin::Chart-->
      <apexchart
        :class="`bg-${widgetColor}`"
        class="mixed-widget-2-chart card-rounded-bottom"
        :options="chartOptions"
        :series="series"
        height="150"
        style="padding-bottom: 50px"
        type="area"
      ></apexchart>
      <!--end::Chart-->
      <!--begin::Stats-->
      <div class="card-p mt-n20 position-relative">
        <!--begin::Row-->
        <div class="row m-0">
          <div class="col bg-light-warning px-6 py-8 rounded-2 text-center">
            <span class="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
              <inline-svg src="media/icons/duotune/general/gen032.svg" />
            </span>
            <router-link to="/letter/view" class="text-black-50 fw-bold fs-6"
              >صندوق موجودیت</router-link
            >
          </div>
          <div
            class="col bg-light-primary px-6 py-8 rounded-2 mx-3 text-center"
          >
            <span class="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
              <inline-svg src="media/icons/duotune/communication/com002.svg" />
            </span>
            <router-link to="/letter/send" class="text-primary fw-bold fs-6">
              ارسال موجودیت جدید
            </router-link>
          </div>
          <div
            class="col bg-secondary px-6 py-8 rounded-2 text-center bgi-no-repeat bgi-size-cover"
          >
            <span class="svg-icon svg-icon-3x svg-icon-successs d-block my-2">
              <inline-svg src="media/icons/duotune/communication/com006.svg" />
            </span>
            <a href="#" class="text-primary fw-bold fs-6"> ایجاد کاربر جدید </a>
          </div>
        </div>
        <!--end::Row-->
      </div>
      <!--end::Stats-->
      <!--end::Body-->
    </template>
  </card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { MenuComponent } from "@/assets/ts/components/MenuComponent";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import Card from "@/custom/components/Card.vue";
import CardMixin from "@/custom/mixins/CardMixin";

export default defineComponent({
  components: { Card },
  mixins: [CardMixin],
  props: {
    widgetClasses: String,
    widgetColor: String,
    strokeColor: String,
  },
  setup(props) {
    const root = ref();
    const labelColor = getCSSVariableValue("--bs-gray-500");
    const borderColor = getCSSVariableValue("--bs-gray-200");

    const color = getCSSVariableValue("--bs-" + props.widgetColor);

    const strokeColor = ref(props.strokeColor);

    const chartOptions = {
      chart: {
        fontFamily: "inherit",
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 5,
          left: 0,
          blur: 3,
          color: strokeColor.value,
          opacity: 0.5,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "solid",
        opacity: 0,
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [strokeColor.value],
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
        crosshairs: {
          show: false,
          position: "front",
          stroke: {
            color: borderColor,
            width: 1,
            dashArray: 3,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 80,
        labels: {
          show: false,
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
        },
        x: {
          formatter: function (val) {
            return [
              "فروردین",
              "اردیبهشت",
              "خرداد",
              "تیر",
              "مرداد",
              "شهریور",
              "مهر",
              "آبان",
              "آذر",
              "دی",
              "بهمن",
              "اسفند",
            ][val - 1];
          },
        },
        y: {
          formatter: function (val) {
            return val;
          },
        },
        marker: {
          show: false,
        },
      },
      markers: {
        colors: [color],
        strokeColor: [strokeColor.value],
        strokeWidth: 3,
      },
    };

    const series = [
      {
        name: "موجودیت",
        data: [
          {
            x: 1,
            y: 0,
          },
          {
            x: 2,
            y: 0,
          },
        ],
      },
    ];
    onMounted(() => {
      MenuComponent.reinitialization();
    });

    return {
      root,
      series,
      chartOptions,
    };
  },
});
</script>
