<template>
  <FormContainer
      ref="formFormInstance"
      :validation-schema="formExtend.formInstance.validationSchemas[formExtend.formInstance.activeMode.value]"
  >
    <FormBuilder
        :fields="formExtend.formInstance.modeFields[formExtend.formInstance.activeMode.value]"
    />
    <PromiseButton
        @submitDone="$emit('submitDone', $event)"
        @clicked="$event($refs.formFormInstance, formExtend);$emit('clicked', $event)"
    />
  </FormContainer>
</template>
<script>
import FormContainer from "@/custom/components/FormContainer";
import FormBuilder from "@/custom/components/FormBuilder";
import PromiseButton from "@/custom/components/PromiseButton";

export default {
  props: ['formExtend'],
  components: {PromiseButton, FormBuilder, FormContainer}
}
</script>