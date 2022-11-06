<template>
  <Form
    class="form"
    :class="{
      'show-no-error': $props.showToastingErrors,
    }"
    @submit="submit"
    ref="formInstance"
    :id="formId"
    :validation-schema="validationSchema"
    v-slot="{ submitForm, submitCount, validate, values, errors }"
  >
    <SetToRef :the-ref="this" the-key="submitForm" :the-value="submitForm" />
    <SetToRef :the-ref="this" the-key="errors" :the-value="errors" />
    <ShowToastingErrors
      v-if="$props.showToastingErrors"
      :submit-count="submitCount"
      :validate="validate"
    />
    <ValidationListener
      v-if="$props.captureAllSubmit"
      @submit="onCapture(validate, values)"
      :data="submitCount"
    />
    <slot />
  </Form>
</template>
<style>
.show-no-error .fv-plugins-message-container {
  display: none;
}
</style>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Form } from 'vee-validate';
import FormMixin from '@/custom/mixins/FormMixin';
import ValidationListener from '@/custom/components/ValidationListener.vue';
import ShowToastingErrors from '@/custom/components/ShowToastingErrors.vue';
import SetToRef from '@/custom/components/helpers/SetToRef.vue';

export default defineComponent({
  components: { SetToRef, ShowToastingErrors, ValidationListener, Form },
  mixins: [FormMixin],
  props: ['captureAllSubmit', 'showToastingErrors'],
  data() {
    return {
      time: new Date().getTime(),
    };
  },
  methods: {
    submit(event) {
      const now = new Date().getTime();
      if (now - this.time > 150) {
        this.$emit('submit-form', event);
        this.time = now;
      }
    },
  },
  setup(props, context) {
    const formInstance: any = ref();
    const testConsole = (e) => {
      return e;
    };
    const onCapture = async (validate, values) => {
      const a = await validate();
      if (Object.keys(a.errors).length > 0) {
        context.emit('capture', null);
      } else {
        context.emit('capture', values);
      }
    };
    return {
      formInstance,
      testConsole,
      onCapture,
    };
  },
});
</script>
