<template>
  <!--begin::CancelButton-->
  <button
    v-if="showCancelButton"
    @click="$emit('reset')"
    type="reset"
    class="btn btn-warning me-0 ms-3 mt-4"
  >
    لغو
  </button>
  <!--end::CancelButton-->
  <slot name="extra-buttons" />
  <!--begin::LoadingButton-->
  <PromiseButton
    class="btn btn-primary mt-4 text-left"
    :class="[submitButtonClass]"
    type="submit"
    ref="loadingButton"
    :text="submitButtonText"
  >
  </PromiseButton>
  <!--end::LoadingButton-->
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoadingButton from '@/custom/components/LoadingButton.vue';
import PromiseButton from '@/custom/components/PromiseButton.vue';

export default defineComponent({
  components: { PromiseButton },
  inheritAttrs: false,
  props: {
    showCancelButton: {
      type: Boolean,
    },
    submitButtonText: {
      type: String,
    },
    submitButtonClass: {
      type: String,
    },
    mt: {
      type: Boolean,
    },
  },
  setup() {
    const loadingButton = ref();
    const loading = (promise) => {
      if (loadingButton.value) loadingButton.value.loading(promise);
    };
    return {
      // method
      loading,
      // ref
      loadingButton,
    };
  },
});
</script>
