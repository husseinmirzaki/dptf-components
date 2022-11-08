<template>
  <button ref="submitButton" type="submit" class="btn btn-primary">
    <span class="indicator-label"> {{ text }} </span>
    <span class="indicator-progress">
      لطفاً صبر کنید...
      <slot name="icon">
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
      </slot>
    </span>
  </button>
</template>
<script lang="ts">
import { defineComponent, ref, toRef, watch } from "vue";

export default defineComponent({
  name: "loading-button",
  props: {
    text: {
      default: "ارسال",
      type: String,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
    loadingText: {
      default: "لطفاً صبر کنید...",
      type: String,
    },
  },
  setup(props) {
    const isLoading = toRef(props, "isLoading");
    const submitButton = ref<HTMLButtonElement | null>();

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
      promise.then(
        () => stopLoading(),
        () => stopLoading()
      );
    };

    watch(isLoading, (newValue) => {
      if (newValue) startLoading();
      else stopLoading();
    });

    return {
      startLoading,
      stopLoading,
      loading,
      submitButton,
    };
  },
});
</script>
