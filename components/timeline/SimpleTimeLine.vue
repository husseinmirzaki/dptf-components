<template>

  <card
      :card-title="cardTitle"
      :card-description="cardDescription">
    <template v-slot:card-content>
      <!--begin::Timeline-->
      <div class="timeline-label">
        <!--begin::Item-->
        <simple-time-line-item v-bind="item" v-for="(item, index) in items" :key="index"/>
        <!--end::Item-->
      </div>
      <!--end::Timeline-->

    </template>
  </card>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import {MenuComponent} from "@/assets/ts/components/MenuComponent";
import CardMixin from "@/custom/mixins/CardMixin";
import Card from "@/custom/components/Card.vue";
import SimpleTimeLineItem from "@/custom/components/timeline/SimpleTimeLineItem.vue";
import TimeLineItem from "@/custom/components/timeline/TimeLineItem";

export default defineComponent({
  mixins: [CardMixin],
  props: {
    items: [TimeLineItem],
  },
  components: {
    SimpleTimeLineItem,
    Card,
  },
});
</script>
