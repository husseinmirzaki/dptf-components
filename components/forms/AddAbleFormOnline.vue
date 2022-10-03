<script lang="ts">
import SimpleFormOnline from "@/custom/components/forms/SimpleFormOnline.vue";
import {modelToServiceMap} from "@/ModelToServiceMap";
import {defineComponent, h, Ref, ref} from "vue";
import ModalFormOnline from "@/custom/components/forms/ModalFormOnline.vue";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {fieldFieldSelect} from "@/custom/components/forms/utils/fixers";

export default defineComponent({
  components: {ModalFormOnline, SimpleFormOnline},
  props: [
    'onFields', 'onFormModalField', 'onFormReady', 'onBuildFields',
    'onModalBuildFields', 'onModalFormReady',
    'modelMainName', 'modelName',
    'onBeforeSubmit', 'onAfterSubmit', 'onModes', 'onModalModes',
    'onOrderField', 'onModalOrderField', 'cardTitle',
      'onFormSend',
  ],
  setup(props, context) {
    let formInstance: any;
    const formReady: Ref<boolean> = ref(false);
    const modalsToCreate: Record<string, any> = {};

    const onFormReadyC = (f) => {
      formInstance = f;
      formReady.value = true;
      if (props.onFormReady) {
        props.onFormReady(f);
      }
    }

    const onFieldsC = (f: any) => {
      // fixed classes for all fields
      f['col_class'] = 'col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-2';

      // set select_url
      if (f['rel_model'] && !f['select_url']) {
        if (modelToServiceMap[f['rel_model']]) {
          f['select_url'] = modelToServiceMap[f['rel_model']].selectUrl;
          f['canAddItem'] = true;
          f['onAddClick'] = () => {
            modalsToCreate[f['rel_model']].ref.open();
          };
          modalsToCreate[f['rel_model']] = {
            title: f['label']
          };
        } else
          console.warn("Add required service for", f['rel_model']);
      }

      if (props.onFields) {
        const result = props.onFields(Object.assign({}, f));
        if (result)
          f = result;
      }

      return f;
    }

    const localOrderField = (modal) => {
      if (props.onModalOrderField) {
        return (f: Array<string>) => {
          return props.onModalOrderField(f, modal).map((e) => {
            if (typeof e == "string")
              return e;
            return e.name;
          });
        }
      }
    }

    const localModes = (modal) => {
      if (props.onModalModes) {
        return (f: Array<string>) => {
          return props.onModalModes(f, modal);
        }
      }
    }

    const localModalFormReady = (modal) => {
      if (props.onModalFormReady) {
        return (formInstance) => {
          return props.onModalFormReady(formInstance, modalsToCreate, modal)
        }
      }
    }

    const localModalOnBuildFields = (modalName) => {
      return (fields: Array<FieldComponentPropsInterface>, instance) => {
        const notHiddenFields = fields.filter((e) => e.field_type != 'hidden').length;
        if (notHiddenFields == 1) {
          const notHiddenIndex = fields.findIndex((e) => e.field_type != 'hidden');
          if (notHiddenIndex > -1) {
            // fields[notHiddenIndex]['col_class'] = 'col-12'
            modalsToCreate[modalName]['maximize'] = true;
          }
        }

        if (props.onModalBuildFields) {
          props.onModalBuildFields(fields, instance, modalName, modalsToCreate);
        }

        return fields;
      };
    }

    const localModalField = (modal) => {

      if (props.onFormModalField) {
        return (field) => {

          field = fieldFieldSelect(field, (f) => {
            field['canAddItem'] = true;
            field['onAddClick'] = () => {
              modalsToCreate[field['rel_model']].open();
            };
            modalsToCreate[field['rel_model']] = {
              title: field['label']
            };
            return field;
          });

          const onFormModalField = props.onFormModalField(field, modalsToCreate, modal);

          if (modalsToCreate[modal]['maximize']) {
            onFormModalField['col_class'] = 'col-12'
          }

          return onFormModalField
        }
      }
      return (field) => {

        field = fieldFieldSelect(field, (f) => {
          field['canAddItem'] = true;
          field['onAddClick'] = () => {
            modalsToCreate[field['rel_model']].open();
          };
          modalsToCreate[field['rel_model']] = {
            title: field['label']
          };
          return field;
        });

        if (modalsToCreate[modal]['maximize']) {
          field['col_class'] = 'col-12'
        }

        return field
      }
    }

    const localModalTitle = (modal) => {
      return modalsToCreate[modal].title;
    }

    return () => {
      const modalNames = Object.keys(modalsToCreate);
      const modals = modalNames.map((modal) => {
        return h(
            ModalFormOnline, {
              key: modal,
              modalTitle: " ",
              onFields: localModalField(modal),
              onBuildFields: localModalOnBuildFields(modal),
              onFormReady: localModalFormReady(modal),
              onOrderField: localOrderField(modal),
              onModes: localModes(modal),
              modelName: modal,
              ref: (el) => modalsToCreate[modal]['ref'] = el,
            }
        )
      });

      const onlineForm = h(
          SimpleFormOnline, {
            cardTitle: props.cardTitle,
            modelName: props.modelName || props.modelMainName,
            onCancel: () => context.emit("cancel"),
            onDone: () => context.emit("done"),
            disableDrag: true,
            onFormReady: onFormReadyC,
            showCancelButton: formReady.value && formInstance.formInstance.update.value,
            onFields: onFieldsC,
            onBuildFields: props.onBuildFields,
            onAfterSubmit: props.onAfterSubmit,
            onOrderField: props.onOrderField,
            onSend: props.onFormSend,
            onModes: props.onModes,
            onBeforeSubmit: props.onBeforeSubmit,
          }, {
            multiForm: () => {
              if (context.slots && context.slots.default) {
                return context.slots.default();
              }
            }
          }
      )

      return [
        ...modals,
        onlineForm
      ]
    }
  }
});
</script>