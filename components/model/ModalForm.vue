<template>
  <FormContainer
      :validation-schema="form.formInstance.validationSchemas.basic"
      @submit-form="$emit('formSubmit', form)">
    <Modal ref="modal"  @close="$emit('close', $event)" @open="$emit('open', $event)" :modal-title="$attrs['title']" @opened="$emit('opened', $event)">
      <template v-slot:modal-content>
        <FormBuilder :fields="form.formInstance.fields"/>
      </template>
      <template v-slot:modal-footer>
        <FormContainerButtons
            ref="assignSubmit"
            :show-cancel-button="form.update.value"
            @reset="form.formInstance.resetForm()"/>
      </template>
    </Modal>
  </FormContainer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {modalExtend} from "@/custom/helpers/ModalExtendHelper";
import FormContainer from "@/custom/components/FormContainer.vue";
import FormBuilder from "@/custom/components/FormBuilder.vue";
import FormContainerButtons from "@/custom/components/FormContainerButtons.vue";
import Modal from "@/custom/components/model/Modal.vue";

export default defineComponent({
  components: {FormContainerButtons, FormBuilder, FormContainer, Modal},
  props: ['form'],
  setup() {
    const _modalExtend = modalExtend();
    return {
      ..._modalExtend
    }
  },
});
</script>
