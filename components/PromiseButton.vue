<template>
  <button ref="submitButton" class="btn btn-primary">
    <span class="indicator-label"> {{ text }} </span>
    <span class="indicator-progress">
      {{ loadingText }}
      <slot name="icon">
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
      </slot>
    </span>
  </button>
</template>
<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "promise-button",
  props: {
    text: {
      default: "ارسال",
      type: String,
    },
    loadingText: {
      default: "درحال ارسال ...",
      type: String,
    },
    promise: {
      type: Promise,
    },
  },
  setup() {
    const submitButton = ref<any>();

    const startLoading = () => {
      if (!submitButton.value) return;
      //Disable button
      submitButton.value.disabled = true;
      // Activate indicator
      submitButton.value.setAttribute("data-kt-indicator", "on");
    };

    const stopLoading = () => {
      if (!submitButton.value) return;
      //Disable button
      submitButton.value.disabled = false;
      // Activate indicator
      submitButton.value.removeAttribute("data-kt-indicator");
    };

    const loading = (promise: Promise<any>) => {
      startLoading();
      promise.then(() => stopLoading(), () => stopLoading()).finally(() => stopLoading());
    };

    return {
      startLoading,
      stopLoading,
      loading,
      submitButton,
    };
  },
});
</script>
