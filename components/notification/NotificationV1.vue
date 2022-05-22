<template>
  <!--begin::Statistics Widget 1-->
  <card
      :class="widgetClasses"
      :style="`background-image: url('${background}')`"
      class="card bgi-no-repeat"
      style="background-position: left top;"
  >
    <template v-slot:card-content>
      <a
          href="#"
          class="card-title fw-bolder text-muted text-hover-primary fs-4"
      >{{ title }}</a
      >
      <div class="fw-bolder text-primary my-6">{{ time }}</div>
      <p class="text-dark-75 fw-bold fs-5 m-0">
        <span v-html="description"></span>
      </p>

    </template>
  </card>
  <!--end::Statistics Widget 1-->
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Card from "@/custom/components/Card.vue";

export interface NotificationV1Interface {
  id?: string;
  widgetClasses?: string;
  background?: string;
  title?: string;
  time?: string;
  description?: string;
}

export default defineComponent({
  props: {
    widgetClasses: String,
    background: String,
    title: String,
    time: String,
    description: String,
  },
  components: {Card},
});
</script>
