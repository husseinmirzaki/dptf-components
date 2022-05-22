<template>
  <form-container
      :ref="completeForm.formContainer"
      @submit-form="completeForm.formInstance.submit($event)"
      :validation-schema="completeForm.formInstance.validationSchemas.basic">
    <card :card-title="cardTitle" :header-classes="headerClasses" :card-description="cardDescription">
      <template v-slot:card-content>
        <slot name="card-content">
          <form-builder :fields="completeForm.formInstance.fields"/>
          <slot name="card-extra-content"/>
        </slot>
      </template>
      <template v-slot:card-footer>
        <form-container-buttons
            show-cancel-button="true"
            @reset="completeForm.formInstance.resetForm()"
            :ref="completeForm.formButtonsInstance"/>
        <slot name="card-extra-footer"/>
      </template>
    </card>
  </form-container>
</template>
<script lang="ts">
import FormMixin from "../mixins/FormMixin";
import CardMixin from "../mixins/CardMixin";
import {defineComponent} from "vue";
import FormContainerButtons from "@/custom/components/FormContainerButtons.vue";
import Card from "@/custom/components/Card.vue";
import FormContainer from "@/custom/components/FormContainer.vue";
import FormBuilder from "@/custom/components/FormBuilder.vue";

export default defineComponent({
  components: {FormBuilder, FormContainerButtons, FormContainer, Card},
  mixins: [FormMixin, CardMixin],
  props: ['completeForm'],
  extends: FormContainer,
});
</script>
