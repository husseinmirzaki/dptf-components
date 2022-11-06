<template>
  <div class="row">
    <div class="col-md-10">
      <div
        class="fields-container position-relative mt-3"
        v-for="(cForm, index) in forms"
        :key="index"
      >
        <form-container
          :validation-schema="
            formInstances[index].formInstance.validationSchemas.basic
          "
          :ref="formInstances[index].formContainer"
        >
          <div class="buttons-container" @click="removeForm(index)">
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen040.svg" />
            </span>
          </div>
          <form-builder :fields="formInstances[index].formInstance.fields" />
        </form-container>
      </div>
    </div>
    <div class="col-md-2">
      <div class="col-12 d-flex flex-row justify-content-center">
        <button
          type="button"
          class="btn btn-sm btn-success mt-2"
          @click="addForm"
        >
          <span class="svg-icon svg-icon-3">
            <inline-svg src="media/icons/duotune/general/gen041.svg" />
          </span>
          {{ addButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.fields-container {
  margin-bottom: 20px;
  padding: 5px 5px 10px;
  border-radius: 8px;
  border: 1px solid #000000;

  button {
    //margin: 0;
    padding: 5px 0 5px 5px !important;
  }

  .buttons-container {
    position: absolute;
    background: #ef253d;
    top: -16px;
    right: -9px;
    padding: 1px;
    border-radius: 19px;

    &.buttons-bottom-container {
      display: flex;
      background: transparent;
      left: 0;
      right: 0;
      top: auto;
      border-radius: 0;

      button {
        margin: 0 auto;
      }
    }
  }
}
</style>
<script lang="ts">
import { defineComponent, nextTick, ref, toRefs, watch } from 'vue';
import { CreateFormExtend } from '@/custom/helpers/BaseForm';
import FormContainer from '@/custom/components/FormContainer.vue';
import FormBuilder from '@/custom/components/FormBuilder.vue';
// @ts-ignore
import { LetterReceiverForm } from '@/mail_box_custom/forms/LetterReceiverForm';

export default defineComponent({
  components: { FormBuilder, FormContainer },
  props: ['formClass', 'addButtonText'],
  setup(props, context) {
    const { formClass } = toRefs(props);
    const forms = ref<any>([]);
    const formInstances: Array<CreateFormExtend<LetterReceiverForm>> = [];

    const reset = () => {
      Object.values(formInstances).forEach((_formInstance) => {
        removeForm(_formInstance);
      });
    };

    const addForm = () => {
      const newItem = new formClass.value().extend();
      watch(
        newItem.obj,
        (newData, oldData) => {
          context.emit('data-change', { formInstances, newData, oldData });
        },
        {
          deep: true,
        }
      );
      formInstances.push(newItem);
      nextTick(() => {
        const newIndex = forms.value.length;
        forms.value.push(newIndex);
        context.emit('addedForm', {
          formInstances,
          newIndex,
          newItem,
        });
        context.emit('change', formInstances);
      });
    };

    const removeForm = (form) => {
      const removedIndex = forms.value.splice(form, 1);
      const removedItem = formInstances.splice(form, 1);
      context.emit('removedForm', {
        formInstances,
        removedIndex,
        removedItem,
      });
      context.emit('change', formInstances);
    };

    addForm();

    return {
      // refs
      forms,
      formInstances,
      // methods
      reset,
      addForm,
      removeForm,
    };
  },
});
</script>
