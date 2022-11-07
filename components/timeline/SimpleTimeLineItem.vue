<template>
  <div class="timeline-item">
    <!--begin::Label-->
    <div class="timeline-label fw-bolder text-gray-800 fs-6">{{ title }}</div>
    <!--end::Label-->

    <!--begin::Badge-->
    <div class="timeline-badge">
      <i class="fa fa-genderless fs-1" :class="[colorClass]"></i>
    </div>
    <!--end::Badge-->

    <!--begin::Text-->
    <div class="fw-mormal timeline-content text-muted ps-3">
      {{ description }}
    </div>
    <!--end::Text-->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { MenuComponent } from "@/assets/ts/components/MenuComponent";
import CardMixin from "@/custom/mixins/CardMixin";
import Card from "@/custom/components/Card.vue";

export default defineComponent({
  props: {
    title: String,
    description: String,
    colorClass: String,
  },
});
</script>
