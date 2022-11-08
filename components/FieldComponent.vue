<template>
  <div class="field fv-row" :class="[col_class_c, { row: one_line }]" ref="root">
    <!--begin::Label-->
    <div class="d-flex align-items-end">
      <div class="add-icon-item" v-if="canAddItem">
        <el-tooltip content="اضافه کردن">
            <span class="svg-icon svg-icon-3 svg-icon-primary" @click="onAddClick">
              <inline-svg src="media/icons/duotune/arrows/arr013.svg"/>
            </span>
        </el-tooltip>
      </div>
      <label
          class="fs-5 fw-bold mb-2 font-weight-bolder text-dark"
          :class="[{ required: required }, one_line_label_classes_c, label_class]"
          v-if="label != null && label !== '' && field_type != 'separator' && showLabel"
      > {{ label }}
      </label>
    </div>
    <!--end::Label-->
    <!--begin::Input-->
    <div :class="[one_line_field_classes_c, field_container_classes]" class="position-relative" :show-help="showHelp">
      <template v-if="field_type === 'select'">
        <div>
          <Field
              :class="[defaultInputClasses, input_class]"
              :id="field_id"
              :placeholder="placeholder"
              :validateOnModelUpdate="true"
              :multiple="select_multiple"
              :as="field_type"
              :name="name"
              :modelValue="this.$props.modelValue"
              style="width: 100%"
              ref="fieldRef"
          >
            <template v-if="select_data">
              <template v-for="value in select_data" :key="value[0]">
                <option
                    :value="value[0]"
                    selected="selected"
                    v-if="value[2] === 'selected'"
                >
                  {{ value[1] }} {{ value[2] }}
                </option>
                <option
                    :value="value[0]"
                    v-else
                >
                  {{ value[1] }}
                </option>
              </template>
            </template>
          </Field>
        </div>
        <div class="floating-icon">
          <span class="svg-icon svg-icon-3 svg-icon-primary">
            <inline-svg src="media/icons/duotune/arrows/arr082.svg"/>
          </span>
        </div>
      </template>
      <template v-else-if="field_type === 'select-v2'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :id="field_id"
            :placeholder="placeholder"
            :validateOnModelUpdate="true"
            :multiple="select_multiple"
            :as="field_type"
            :name="name"
            style="width: 100%"
            ref="fieldRef"
        >
          <Select2AlternativeField
              :url="$props.select_url"
              :config="$props.selectV2Config"
              :multiple="$props.select_multiple"
              :model-value="this.$props.modelValue"
              @update:modelValue="$emit('update:modelValue', $event)"
          />
        </Field>
      </template>
      <template v-else-if="field_type === 'textarea'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :id="field_id"
            :readonly="processedReadOnly()"
            :placeholder="placeholder"
            :as="field_type"
            :name="name"
            :modelValue="this.$props.modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            ref="fieldRef"
        >
        </Field>
      </template>
      <template v-else-if="field_type === 'p-date-time'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :id="field_id"
            :name="name"
            :modelValue="this.$props.modelValue"
            @update:modelValue="$emit('update:modelValue', fieldRef.outputValue[0])"
        >
          <DatePicker
              :name="name"
              :readonly="processedReadOnly()"
              :disabled="processedReadOnly()"
              :placeholder="placeholder"
              :modelValue="this.$props.modelValue"
              :type="$props.dateTimeType"
              :format="$props.dateTimeType == 'datetime' ? 'jYYYY/jMM/jDD HH:mm':'jYYYY/jMM/jDD'"
              @update:modelValue="$emit('update:modelValue', fieldRef.outputValue[0])"
              @change="$emit('update:modelValue', fieldRef.outputValue[0])"
              ref="fieldRef"/>
        </Field>
      </template>
      <template v-else-if="field_type === 'checkbox'">
        <div :class="[input_container_class ? input_container_class : 'form-check m-3 me-4']"
             style="padding-right: 0 !important ">
          <Field
              :class="['form-check-input',defaultInputClasses, input_class]"
              :id="field_id"
              :name="name"
              type="checkbox"
              :value="this.$props.modelValue"
              :modelValue="this.$props.modelValue"
          >
            <input
                class="form-check-input"
                type="checkbox"
                :name="name"
                :checked="this.$props.modelValue"
                @change="$emit('update:modelValue', fieldRef.checked)"
                ref="fieldRef">
          </Field>
          <label class="form-check-label">
            {{ placeholder }}
          </label>
        </div>
      </template>
      <template v-else-if="field_type === 'component'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :name="name"
            :value="this.$props.modelValue"
            :modelValue="this.$props.modelValue"
            @update:modelValue="$emit('update:modelValue', $event)"
        >
          <component
              :id="field_id"
              :class="[defaultInputClasses, input_class]"
              :is="selected_component"
              :readonly="processedReadOnly()"
              :placeholder="placeholder"
              :name="name"
              :modelValue="this.$props.modelValue"
              @update:modelValue="$emit('update:modelValue', $event)"
              ref="fieldRef"
          />
        </Field>
      </template>
      <template v-else-if="field_type === 'file'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :readonly="processedReadOnly()"
            :placeholder="placeholder"
            :type="field_type"
            :name="name"
            :modelValue="this.$props.modelValue"
            :multiple="multiple"
            @change="$emit('update:modelValue', getFile($event.target))"
            ref="fieldRef"
        />
      </template>
      <template v-else-if="field_type === 'separator'">
        <div class="w-100 border-top-0 border-left-0 border-right-0 border-bottom-3 border-dark border mt-9 mb-3">
          <h3 class="pb-0 mb-2"> {{ label }} </h3>
        </div>
      </template>
      <template v-else-if="field_type === 'auto-complete'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :id="field_id"
            :name="name"
            type="checkbox"
            :value="this.$props.modelValue"
        >
          <auto-complete
              :placeholder="placeholder"
              :options="{
              url: select_url
            }"
              :modelValue="this.$props.modelValue"
              @update:modelValue="$emit('update:modelValue', $event)"
              ref="fieldRef"
          />
        </Field>
      </template>
      <template v-else-if="field_type === 'currency'">
        <Field
            :class="[defaultInputClasses, input_class]"
            :readonly="processedReadOnly()"
            :placeholder="placeholder"
            type="text"
            :name="name"
            :modelValue="this.$props.modelValue"
            ref="fieldRef"
        >
          <input type="text"
                 :readonly="processedReadOnly()"
                 @keyup="formatCurrency($refs.fieldRef.$el.nextElementSibling)"
                 :class="[defaultInputClasses, input_class]"
                 v-model="currency"
          >
        </Field>
      </template>
      <template v-else>
        <Field
            :class="[defaultInputClasses, input_class]"
            :readonly="processedReadOnly()"
            :placeholder="placeholder"
            :type="field_type"
            :name="name"
            :modelValue="this.$props.modelValue"
            @focusin="$emit('focusin')"
            @change="$emit('update:modelValue', $event.target.value)"
            ref="fieldRef"
        />
      </template>
      <div class="fv-plugins-message-container" v-if="showError && field_type != 'separator'">
        <div class="fv-help-block">
          <ErrorMessage :name="name"/>
        </div>
      </div>
    </div>
    <!--end::Input-->
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, isRef, nextTick, onMounted, ref, toRef, watch} from "vue";
import {ErrorMessage, Field} from "vee-validate";
import {$, select2} from "@/custom/helpers/select2_decelaration";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {Actions} from "@/custom/store/enums/StoreEnums";
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'
import {gregorianToJalali} from "@/custom/components/DateUtils";
import {findClassInParent} from "@/custom/helpers/DomHelpers";
import {VueInstanceService} from "@/Defaults";
import AutoComplete from "@/custom/components/forms/AutoComplete.vue";
import {deformatNumber, formatCurrency} from "@/custom/components/FieldComponentCurrency.js"
import Select2AlternativeField from "@/custom/components/Select2AlternativeField.vue";
import {read} from "@popperjs/core";

export default defineComponent({
  name: "field-component",
  inheritAttrs: false,
  components: {
    Select2AlternativeField,
    AutoComplete,
    Field,
    ErrorMessage,
    DatePicker: Vue3PersianDatetimePicker,
  },
  props: {
    defaultInputClasses: {
      default: "form-control h-auto py-3 px-2 rounded-lg"
    },
    canAddItem: {
      default: false,
    },
    showLabel: {
      default: true,
    },
    onAddClick: {
      default: () => (() => {
        //
      }),
    },
    dateTimeType: {
      type: String,
      default: "date"
    },
    showHelp: {
      type: String
    },
    outerAccess: {
      type: Function
    },
    selected_component: {
      default: null,
    },
    select_filter_id: {
      default: null,
    },
    select_filter_key: {
      default: "filter-on",
    },
    input_class: {
      default: "",
      type: String,
    },
    input_container_class: {
      default: null,
      type: String,
    },
    label_class: {
      default: "",
      type: String,
    },
    col_class: {
      default: "col-md-12",
      type: String,
    },
    one_line_field_classes: {
      default: "col-lg-8 fv-row",
      type: String,
    },
    field_container_classes: {
      default: "",
      type: String,
    },
    one_line_label_classes: {
      default: "col-lg-4 col-form-label",
      type: String,
    },
    modelValue: {
      type: [String, Array, Boolean],
    },
    field_id: {
      type: String,
    },
    show_errors: {
      default: true,
      type: Boolean,
    },
    one_line: {
      type: Boolean,
    },
    name: {
      type: String,
    },
    required: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    select_multiple: {
      type: Boolean,
      default: false,
    },
    select_tag: {
      type: Boolean,
      default: false,
    },
    read_only: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    field_type: {
      type: String,
      default: "text",
    },
    file_accept: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    select_url: {
      type: String,
    },
    modal_id: {
      type: String,
    },
    select_options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    selectV2Config: {
      type: Object,
    },
    select_data: {
      type: Array,
    },
  },
  setup(props, context) {
    const col_class = toRef(props, "col_class");
    const one_line = toRef(props, "one_line");
    const field_type = toRef(props, "field_type");
    const one_line_field_classes = toRef(props, "one_line_field_classes");
    const one_line_label_classes = toRef(props, "one_line_label_classes");
    const show_errors = toRef(props, "show_errors");
    const select_url = toRef(props, "select_url");
    const multiple = toRef(props, "multiple");
    const read_only = toRef(props, "read_only");
    const select_tag = toRef(props, "select_tag");
    const select_options = toRef(props, "select_options");
    const select_filter_key = toRef(props, "select_filter_key");
    const select_filter_id = toRef(props, "select_filter_id");
    const outerAccess = toRef(props, "outerAccess");
    const modal_id = toRef(props, "modal_id");
    const file_accept = toRef(props, "file_accept");
    const placeholder = toRef(props, "placeholder");
    const modelValue = toRef(props, "modelValue");

    const field = ref<any>(null);
    const root = ref<any>(null);
    const showError = ref<boolean>(show_errors.value);

    const currency = ref(modelValue.value);

    if (field_type.value == 'currency') {
      watch(currency, () => {
        context.emit("update:modelValue", deformatNumber(currency.value))
      })
    }

    watch(modelValue, (e) => {
      showError.value = true;
      if (field_type.value == 'select' && !modelValue.value && select2Instance.value) {
        // select2Instance.value.val('').change();
      } else if (field_type.value == 'checkbox' && !modelValue.value && field.value) {
        field.value.checked = false;
      } else if (select2Instance.value) {
        // select2Instance.value.change();
      }

    });

    const select2Instance = ref<any>(null);

    const one_line_field_classes_c = computed(() => {
      if (one_line.value) {
        return one_line_field_classes.value;
      }
      return "";
    });

    const one_line_label_classes_c = computed(() => {
      if (one_line.value) {
        return one_line_label_classes.value;
      }
      return "";
    });

    const col_class_c = computed(() => {
      return col_class.value;
    });

    const testConsole = (e) => {
      console.log(field);
      console.log(e);
    }

    onMounted(() => {

      if (field_type.value == 'currency') {
        formatCurrency(field.value.$el.nextElementSibling);
      }

      if (field_type.value == 'hidden') {
        root.value.style.display = 'none';
      }

      if (outerAccess.value) {
        outerAccess.value(sendToUser);
      }

      if (field.value && context.attrs["id"]) {
        field.value.$el.setAttribute("id", context.attrs["id"]);
      }


      watch(read_only, (e) => {
        if (select2Instance.value) {
          select2Instance.value.prop("disabled", read_only.value)
        } else {
          if (e) {
            field.value.$el.setAttribute("readonly", "readonly");
          } else {
            field.value.$el.removeAttribute("readonly");
          }
        }
      })

      if (field_type.value === "select") {
        const modalParent = findClassInParent(root.value, 'modal-body');

        if (modalParent != null) {
          // using first child to support better scrolling behaviour
          select_options.value["dropdownParent"] = $(modalParent);
        }
        if (select_filter_id.value) {
          const v = select_filter_id.value as any;
          select_options.value["onParams"] = (_data) => {
            _data[select_filter_key.value] = $(v).val();
          };
        }

        if (select_tag.value) {
          select_options.value["tags"] = true;
        }

        if (read_only.value) {
          select_options.value["disabled"] = "readonly";
        }

        if (placeholder.value != "") {
          select_options.value["placeholder"] = placeholder.value;
        }

        if (modal_id.value) {
          select_options.value["dropdownParent"] = $(document.querySelector(
              `${modal_id.value}`
          ));
        }

        const urlFunc = () => {
          return select_url.value;
        };


        let url;
        if (select_url.value) url = urlFunc;
        else url = null;

        select2Instance.value = select2(
            (field.value as { $el: HTMLSelectElement }).$el,
            url,
            select_options.value,
            () => {
              VueInstanceService.store.dispatch(Actions.ASK_NEW_TOKEN);
            }
        );

        select2Instance.value?.change((e) => {
          const _data = $(e.target).val();
          context.emit("update:modelValue", _data);
        });

      } else if (field_type.value === "file") {
        if (multiple.value) {
          field.value.$el.setAttribute('multiple', 'multiple');
        }
        if (file_accept.value) {
          field.value.$el.setAttribute('accept', file_accept.value);
        }
      }
    });

    const setValue = (data) => {
      if (field_type.value == "component") {
        if (field.value && field.value.setData) {
          field.value.setData(data);
        }
      }
      if (typeof data === 'boolean') {
        if (data != undefined)
          data = data ? 1 : 0;
      }
      if (field_type.value === 'select') {
        nextTick(() => {
          setOptions(data);
        });
        return;
      }
      if (!data) {
        switch (field_type.value) {
          case 'checkbox':
            context.emit("update:modelValue", false);
            return;
          case 'p-date-time':
            field.value.$el.value = "";
            context.emit("update:modelValue", '');
            return;
        }
      }

      if (field_type.value === 'checkbox') {
        field.value.checked = data;
        context.emit("update:modelValue", data);
      }

      if (field_type.value === 'p-date-time') {

        if (typeof data == 'string' && data.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
          context.emit("update:modelValue", data);
          return;
        }

        const date = new Date(data);
        const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        if (props.dateTimeType == "datetime")
          context.emit("update:modelValue", `${persian[0]}/${persian[1]}/${persian[2]} ${date.getHours()}:${date.getMinutes()}`);
        else
          context.emit("update:modelValue", `${persian[0]}/${persian[1]}/${persian[2]}`);
      } else {
        if (field.value) {
          if (field.value.$el) {
            if (field_type.value == "currency") {
              field.value.$el.value = data;
              field.value.$el.nextElementSibling.value = data;

              nextTick(() => {
                formatCurrency(field.value.$el.nextElementSibling);
                field.value.$el.nextElementSibling.dispatchEvent(new Event('change'));
                field.value.$el.dispatchEvent(new Event('change'));
                currency.value = field.value.$el.nextElementSibling.value;
              })
            } else {
              field.value.$el.value = data;
              nextTick(() => {
                field.value.$el.dispatchEvent(new Event('change'));
              });
            }
          }
        }
      }
    }

    const setOptions = (
        options: Array<{ value: number | string; text: string }> | Array<string> | Array<number>
    ) => {
      if (options == null || options == undefined) {
        select2Instance.value?.val(null);
        select2Instance.value?.change();
        return
      }

      if (options.length > 0 && options[0] && !options[0]['text']) {
        select2Instance.value?.val(options);
      } else if (!Array.isArray(options)) {
        select2Instance.value?.val(String(options));
      } else
        options.forEach((data) => {
          if (!data) return;
          if (data['text'] && data['value'])
            select2Instance.value?.append(
                new Option(String(data['text']), String(data['value']), true, true)
            );
        });
      select2Instance.value?.change();
    };

    const empty = () => {
      if (select2Instance.value) {
        select2Instance.value.val("").change();
      }
    };

    const getFile = (e) => {
      if (e.files.length > 0) {
        return e.files;
      }
      return null;
    }

    const sendToUser = {
      // methods
      setValue,
      setOptions,
      getFile,
      empty,
      testConsole,
      formatCurrency,
      // ref
      root,
      showError,
      fieldRef: field,
      select2Instance,
      show_errors,
      // data
      currency,
      col_class_c,
      one_line_field_classes_c,
      one_line_label_classes_c,
      processedReadOnly: () => {
        return isRef(read_only) ? read_only.value : read_only;
      }
    }
    return sendToUser;
  },
});

export class FieldComponentProps {
  options: FieldComponentPropsInterface;

  get hasVModelKey(): boolean {
    return !!this.options["v-model"] && !!this.options["v-model-key"];
  }

  get hasVModel(): boolean {
    return !!this.options["v-model"];
  }

  get vBind(): FieldComponentPropsInterface {
    const a = {
      ...this.options,
    };
    delete a["v-model"];
    delete a["v-model-key"];
    return a;
  }

  constructor(options: FieldComponentPropsInterface) {
    this.options = options;
  }
}

export function fieldC(
    options: FieldComponentPropsInterface
): FieldComponentProps {
  return new FieldComponentProps(options);
}
</script>
<style scoped lang="scss">
input[type="color"] {
  height: 40px !important;
}

.floating-icon {
  position: absolute;
  z-index: 99;
  top: 50%;
  transform: translateY(-50%);
  left: 5px;
  pointer-events: none;
}

label {
  font-size: 12px !important;
}

:deep(.add-icon-item) {
  /*position: absolute;*/
  //padding: 3px;
  margin: 0 0 5px 5px;
  border-radius: 5px;

  &:hover {
    svg path {
      fill: #40f030 !important;
    }
  }
}

:deep(.select2-selection__placeholder) {
  font-size: 12px;
}
</style>