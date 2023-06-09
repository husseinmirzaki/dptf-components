<template>
  <button
    ref="submitButton"
    class="btn btn-primary mx-2"
    @click="onClickDelegation()"
  >
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
import { defineComponent, ref } from "vue";
import {Configs, VueInstanceService} from "@/Defaults";
import { Actions } from "@/custom/store/enums/StoreEnums";

export default defineComponent({
  name: "promise-button",
  props: {
    text: {
      default: Configs.defaultTexts.submit,
      type: String,
    },
    loadingText: {
      default: `درحال ${Configs.defaultTexts.submit} ...`,
      type: String,
    },
    promise: {
      type: Promise,
    },
    successMessage: {
      type: String,
      default: "با موفقیت انجام شد",
    },
  },
  setup(props, context) {
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
      promise
        .then(
          () => stopLoading(),
          () => stopLoading()
        )
        .finally(() => stopLoading());
    };

    /**
     * this will return a function as event and it that
     */
    const onClickDelegation = () => {
      const delegation = (formContainsRef, formExtend) => {
        loading(
          (async () => {
            await formContainsRef.submitForm();
            if (Object.keys(formContainsRef.errors).length > 0) {
              console.error("form error",formContainsRef.errors);
              return 0;
            }
            try {
              const response = await formExtend.formInstance.submit();
              setTimeout(() => {
                context.emit("submitDone", response);
                VueInstanceService.showSuccessMessage(props.successMessage);
              }, 500);
            } catch (e) {
              console.error(e, formExtend);
              VueInstanceService.store.dispatch(Actions.REQUEST_ERROR_TOAST);
            }
            return 0;
          })()
        );
      };
      context.emit("clicked", delegation);
    };

    return {
      onClickDelegation,
      startLoading,
      stopLoading,
      loading,
      submitButton,
    };
  },
});
</script>
