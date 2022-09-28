<script lang="ts">
import {h, ref, watch} from "vue";
import Modal from "@/custom/components/model/Modal.vue";
import FormBuilder from "@/custom/components/FormBuilder.vue";
import FormContainer from "@/custom/components/FormContainer.vue";
import PromiseButton from "@/custom/components/PromiseButton.vue";
import {BuildByModelName} from "@/custom/forms/utils/BuildByModelName";
import FixedHeightLoader from "@/custom/components/forms/FixedHeightLoader.vue";
import FixedHeightAccess from "@/custom/components/forms/FixedHeightAccess.vue";

export default {
  props: ['modelName', 'overrideOptions', 'onFields', 'onOrderField', 'onBuildFields', 'onFormReady'],
  setup(props, context) {
    const modal = ref();
    const formRef = ref();

    const buildByModelName = new BuildByModelName(
        props.modelName,
        {
          overrideOptions: props.overrideOptions,
          onBuildFields: props.onBuildFields,
          onFields: props.onFields,
          onOrderField: props.onOrderField,
          isUsingModal: true,
        }
    );

    buildByModelName.getFields();


    watch(buildByModelName.formBuilt, (e) => {
      if (e && props.onFormReady) {
        props.onFormReady(buildByModelName);
      }
    });

    const open = () => {
      modal.value.open()
    }

    context.expose({
      open,
    })

    return () => {
      return h(Modal, {
        ref: (el) => modal.value = el,
        thinFooter: true,
      }, {
        'modal-content': () => {
          if (!buildByModelName.formBuilt.value && buildByModelName.formFound.value) {
            return h(FixedHeightLoader);
          } else if (!buildByModelName.formFound.value) {
            return h(FixedHeightAccess);
          }

          console.log("returning form container");

          return h(FormContainer, {
            validationSchema: buildByModelName.formInstance!.activeSchema,
            ref: (el) => formRef.value = el,
          }, {
            default: () => {
              return h(FormBuilder, {
                fields: buildByModelName.formInstance!.activeFields
              });
            }
          })
        },
        'modal-footer': () => {
          return h(PromiseButton, {
            onSubmitDone: () => {
              buildByModelName.formInstance!.formInstance.resetForm();
              modal.value.close();
              context.emit('done')
            },
            onClicked: (event) => {
              event(formRef.value, buildByModelName.formInstance);
            }
          });
        }
      });
    }
  }
}
</script>