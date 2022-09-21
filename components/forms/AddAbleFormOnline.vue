<template>
  <template v-for="model in Object.keys(modalsToDraw)" :key="model">
    <ModalFormOnline
        :on-fields="localModalField(model)"
        :onFormReady="localModalFormReady(model)"
        :model-name="model" :ref="(el) => modalsToDraw[model] = el"/>
  </template>
  <SimpleFormOnline
      :disable-drag="true"
      @cancel="$emit('cancel')"
      :on-form-ready="onFormReadyC"
      :show-cancel-button="isFormReady(formReady)"
      :onFields="onFieldsC"
      :onBuildFields="onBuildFields"
      :onBeforeSubmit="onBeforeSubmit"
      :onAfterSubmit="onAfterSubmit"
      v-bind="$attrs"
  >
    <template #multiForm>
      <slot/>
    </template>
  </SimpleFormOnline>
</template>
<script lang="ts">
import SimpleFormOnline from "@/custom/components/forms/SimpleFormOnline.vue";
import {modelToServiceMap} from "@/ModelToServiceMap";
import {defineComponent, Ref, ref, shallowRef, watch} from "vue";
import ModalFormOnline from "@/custom/components/forms/ModalFormOnline.vue";

export default defineComponent({
  components: {ModalFormOnline, SimpleFormOnline},
  props: ['onFields', 'onFormModalField', 'onFormReady', 'onBuildFields', 'onModalFormReady', 'modelMainName', 'onBeforeSubmit', 'onAfterSubmit'],
  setup(props) {
    const formReady: Ref<boolean> = ref(false);
    let formInstance: any = shallowRef(null);

    const watchFinished = ref(false);
    let lastSetTimeout: any = null;
    const modalsToCreate: Record<string, any> = [];
    const modalsToDraw: Ref<Record<string, any>> = ref({});

    const onFormReadyC = (f) => {
      formInstance.value = f;
      formReady.value = true;
      if (props.onFormReady) {
        props.onFormReady(f);
      }
    }

    const isFormReady = () => {
      if (formReady.value) {
        return formInstance.value.formInstance.update.value
      }
      return false;
    }

    watch(watchFinished, (e) => {
      if (e) {
        Object.keys(modalsToCreate).forEach((key) => {
          modalsToDraw.value[key] = ref();
        });
      }
    });

    const onFieldsC = (f: any) => {
      // fixed classes for all fields
      f['col_class'] = 'col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-2';

      // set select_url
      if (f['rel_model'] && !f['select_url']) {
        if (modelToServiceMap[f['rel_model']]) {
          f['select_url'] = modelToServiceMap[f['rel_model']].selectUrl;
          f['canAddItem'] = true;
          f['onAddClick'] = () => {
            modalsToDraw.value[f['rel_model']].open();
          };
          modalsToCreate[f['rel_model']] = 0;
        } else
          console.log("Add required service for", f['rel_model']);
      }

      if (props.onFields) {
        f = props.onFields(f);
      }

      clearInterval(lastSetTimeout);
      lastSetTimeout = setInterval(() => {
        watchFinished.value = true;
      }, 100);
      return f;
    }

    const localModalFormReady = (modal) => {
      if (props.onModalFormReady) {
        return (formInstance) => {
          return props.onModalFormReady(formInstance, modalsToDraw, modal)
        }
      }
    }

    const localModalField = (modal) => {
      if (props.onFormModalField) {
        return (field) => {
          return props.onFormModalField(field, modalsToDraw, modal)
        }
      }
    }

    return {
      onFieldsC,
      onFormReadyC,
      formInstance,
      formReady,
      localModalFormReady,
      localModalField,
      isFormReady,
      modalsToDraw,
    }
  }
});
</script>