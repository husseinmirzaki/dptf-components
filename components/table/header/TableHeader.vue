<template>
  <h3 class="card-title align-items-start flex-column">
    <span class="card-label fw-bolder fs-3 mb-1">{{ $props.title }}</span>

    <span class="text-muted mt-2 fw-bold fs-7">{{ $props.description }}</span>
  </h3>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["title", "description"],
});
</script>
