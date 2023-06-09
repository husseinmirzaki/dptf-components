<script lang="ts">
import { defineComponent, h } from "vue";
import TableByModelName from "@/custom/components/forms/TableByModelName.vue";
import AddAbleFormOnline from "@/custom/components/forms/AddAbleFormOnline.vue";
import ShowModelHistoryButton from "@/custom/components/ShowModelHistoryButton.vue";
import { Configs, VueInstanceService } from "@/Defaults";

export default defineComponent({
  props: [
    "tableExtendClass",
    "tableCardTitle",
    "formCardTitle",
    "tableModel",
    "tableFilterField",
    "filterModelId",
    "onTableSearchParams",
    "formModel",
    "onFormModalField",
    "onFormField",
    "onFormFormReady",
    "onModalFormReady",
    "onFormBuildFields",
    "onModalBuildFields",
    "onFormFieldsOrder",
    "onModalFieldsOrder",
    "onFormBeforeSubmit",
    "disableTable",
    "disableForm",
    "formAsModal",
    "onModes",
  ],
  emits: ["formRefReady", "update", "done", "cancel", "view"],
  setup(props, context) {
    let formInstance: any;
    let expose: any = {};
    context.expose(expose);

    const passModalInstance = (slots: Record<string, any>) => {
      slots = {
        ...slots,
      };

      if (slots["modalButton"]) {
        slots["toolbar0"] = () => {
          // console.log(slots);
          return slots["modalButton"](expose);
        };
      }

      return slots;
    };

    return () => {
      const table = !props.disableTable
        ? h(
            TableByModelName,
            {
              extendClass: props.tableExtendClass,
              onUpdate: (data) =>
                context.emit("update", data, formInstance, expose["formRef"]),
              onView: (data) =>
                context.emit("view", data, formInstance, expose["formRef"]),
              title: props.tableCardTitle,
              filterModelName: props.tableModel,
              filterModelField: props.tableFilterField,
              filterModelId: props.filterModelId,
              onSearchParams: props.onTableSearchParams,
            },
            {
              toolbar0: () =>
                Configs.showTableHistoryButton
                  ? h(ShowModelHistoryButton, {
                      modelName: props.tableModel,
                    })
                  : undefined,
              ...passModalInstance(context.slots),
            }
          )
        : undefined;

      const form = !props.disableForm
        ? h(AddAbleFormOnline, {
            ref: (el) => {
              expose["formRef"] = el;
              context.emit("formRefReady", el);
            },
            formAsModal: props.formAsModal,
            onCancel: (e, b) => {
              formInstance.resetForm();
              context.emit("cancel", e, formInstance, expose["formRef"]);
            },
            onDone: (e, b) => {
              VueInstanceService.emit(`${props.tableModel}Table`, ["refresh"]);
              formInstance.resetForm();
              context.emit("done", e, b, expose["formRef"]);
            },
            onBuildFields: props.onFormBuildFields,
            cardTitle: props.formCardTitle,
            onFields: props.onFormField,
            onFormModalField: props.onFormModalField,
            onModalBuildFields: props.onModalBuildFields,
            modelName: props.formModel,
            onFormReady: (e) => {
              formInstance = e;
              if (props.onFormFormReady) props.onFormFormReady(e);
            },
            onModalFormReady: props.onModalFormReady,
            onModalOrderField: props.onModalFieldsOrder,
            onOrderField: props.onFormFieldsOrder,
            onBeforeSubmit: props.onFormBeforeSubmit,
            onModes: props.onModes,
          })
        : undefined;

      return h(
        "div",
        {
          class: "row p-0 m-0",
        },
        [
          h(
            "div",
            {
              class: {
                "col-xl-6 col-lg-12 mb-3 mb-xl-0":
                  !props.disableForm && !props.formAsModal,
                "col-xl-12 col-lg-12 mb-3 mb-xl-0":
                  props.disableForm || props.formAsModal,
              },
            },
            table
          ),
          !props.formAsModal
            ? h(
                "div",
                {
                  class: {
                    "col-xl-6 col-lg-12": !props.disableTable,
                    "col-xl-12 col-lg-12": props.disableTable,
                  },
                },
                form
              )
            : form,
        ]
      );
    };
  },
});
</script>
