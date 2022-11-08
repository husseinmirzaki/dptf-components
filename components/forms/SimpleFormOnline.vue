<script lang="ts">
import { h, nextTick, watch } from "vue";
import Card from "@/custom/components/Card.vue";
import FormBuilder from "@/custom/components/FormBuilder.vue";
import FormContainer from "@/custom/components/FormContainer.vue";
import PromiseButton from "@/custom/components/PromiseButton.vue";
import { BuildByModelName } from "@/custom/forms/utils/BuildByModelName";
import FixedHeightAccess from "@/custom/components/forms/FixedHeightAccess.vue";
import FixedHeightLoader from "@/custom/components/forms/FixedHeightLoader.vue";
import { DEFAULT_BUTTONS } from "@/custom/helpers/RenderFunctionHelpers";
import Modal from "@/custom/components/model/Modal.vue";

export default {
  components: { Card, PromiseButton, FormContainer, FormBuilder },
  props: [
    "modelName",
    "overrideOptions",
    "showCancelButton",
    "onBuildFields",
    "onFields",
    "onOrderField",
    "onFormReady",
    "onBeforeSend",
    "onModes",
    "onBeforeSubmit",
    "onAfterSubmit",
    "onSend",
    "isReadOnly",
    "formAsModal",
  ],
  setup(props, context) {
    const onUpdate = (data) => {
      buildByModelName.formInstance!.formInstance.fields.forEach((field) => {
        if (field["is_json_field"]) {
          const value = data[field["name"]];
          if (value == "") {
            delete data[field["name"]];
          } else {
            // data[field['name']] = {
            //   "text": data[field['name']]
            // }
          }
        }
      });
    };

    const buildByModelName = new BuildByModelName(props.modelName, {
      overrideOptions: props.overrideOptions,
      onModes: props.onModes,
      onFields: props.onFields,
      onOrderField: props.onOrderField,
      onBuildFields: props.onBuildFields,
      onBeforeSubmit: props.onBeforeSubmit,
      onAfterSubmit: props.onAfterSubmit,
      onBeforeUpdate: onUpdate,
      onBeforeCreate: onUpdate,
    });

    watch(buildByModelName.formBuilt, (e) => {
      if (e && props.onFormReady) {
        props.onFormReady(buildByModelName);
      }
      nextTick(() => {
        if (!buildByModelName.formInstance!.obj.value["id"]) {
          buildByModelName.formInstance!.formInstance.fields.forEach(
            (field) => {
              if (field.default !== undefined) {
                const s: any = {};
                s[field.name] = field.default;
                buildByModelName.formInstance!.formInstance.setValues(s);
              }
            }
          );
        }
      });
    });

    buildByModelName.getFields();

    const onBeforeSendC = (e) => {
      buildByModelName.formInstance!.formInstance.fields.forEach((field) => {
        if (field["is_json_field"]) {
          const value = buildByModelName.formInstance!.obj[field["name"]];
          if (value && value == "") {
            buildByModelName.formInstance!.obj[field["name"]] = null;
          }
        }
      });

      if (props.onBeforeSend) {
        props.onBeforeSend(buildByModelName);
      }

      if (props.onSend) {
        props.onSend(e, buildByModelName);
      } else {
        e();
      }
    };

    let formInstance: any;
    let modalInstance: any;
    const cardContent = () => {
      if (!buildByModelName.formBuilt.value) {
        if (buildByModelName.formFound.value) return h(FixedHeightLoader);
        return h(FixedHeightAccess);
      }

      const formBuilder = () => {
        return h(FormBuilder, {
          fields: buildByModelName.formInstance?.activeFields,
        });
      };

      if (props.isReadOnly) return formBuilder();

      return [
        h(
          FormContainer,
          {
            validationSchema: buildByModelName.formInstance?.activeSchema,
            ref: (el) => (formInstance = el),
          },
          {
            default: formBuilder,
          }
        ),
        context.slots["multiForm"] ? context.slots["multiForm"]() : undefined,
      ];
    };
    const cardFooter = () => {
      if (!(buildByModelName.formBuilt.value && !props.isReadOnly)) return;

      const promiseButton = h(PromiseButton, {
        text: "ثبت",
        onSubmitDone: (e) => {
          context.emit("done", e, buildByModelName);
          if (props.formAsModal) {
            modalInstance.close();
          }
        },
        onClicked: (event) => {
          onBeforeSendC(() => {
            event(formInstance, buildByModelName.formInstance);
          });
        },
      });

      if (
        !(
          props.showCancelButton || buildByModelName.formInstance?.update.value
        ) ||
        props.formAsModal
      )
        return promiseButton;

      const cancelButton = DEFAULT_BUTTONS.danger(
        {
          onClick: () => {
            context.emit("cancel");
          },
        },
        "لغو"
      );

      return [promiseButton, cancelButton];
    };
    return () => {
      return !props.formAsModal
        ? h(
            Card,
            {},
            {
              "card-content": cardContent,
              "card-footer": cardFooter,
            }
          )
        : h(
            Modal,
            {
              modalTitle: context.attrs["cardTitle"],
              thinFooter: true,
              onClose: () => context.emit("cancel"),
              ref: (el) => {
                modalInstance = el;
                context.expose({
                  modal: el,
                });
              },
            },
            {
              "modal-content": cardContent,
              "modal-footer": cardFooter,
            }
          );
    };
  },
};
</script>
