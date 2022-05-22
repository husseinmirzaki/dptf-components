<template>
  <td>
    <button
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#user-view-model"
        class="btn btn-primary btn-sm" @click="onClick ? onClick : null">
      نمایش
    </button>
  </td>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: ['text', 'onClick', 'modelSelector'],
});
</script>