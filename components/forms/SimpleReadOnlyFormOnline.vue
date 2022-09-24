<template>
  <Card>
    <template #toolbar0 v-if="showEditButton">
      <button class="btn btn-warning" @click="$emit('edit')">ویرایش</button>
    </template>
    <template #card-content>
      <div style="height: 450px; width: 100%" class="d-flex align-items-center justify-content-center"
           v-if="!formBuilt">
        <template v-if="formFound">
          درحال اجرا
          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
        </template>
        <div class="d-flex flex-column justify-content-center align-items-center text-center" v-else>
          <span class="svg-icon svg-icon-danger">
            <inline-svg src="media/icons/duotune/arrows/arr061.svg" style="width: 150px; height: 150px"/>
          </span>
          <h4>
            متاسفانه فرم موردنظر پیدا نشد <br/>
            ویا شما به فرم موردنظر دسترسی ندارید
          </h4>
        </div>
      </div>
      <template v-if="formBuilt">
        <FormBuilder :fields="buildByModelName.formInstance.activeFields"/>
      </template>

      <PromiseButton v-if="$attrs['disable-card']"
                     @submitDone="buildByModelName.formInstance.formInstance.resetForm();$emit('done')"
                     @clicked="$event($refs.form, buildByModelName.formInstance)"/>
    </template>
  </Card>
</template>
<script lang="ts">
import {h, watch} from "vue";
import Card from "@/custom/components/Card.vue";
import FormBuilder from "@/custom/components/FormBuilder.vue";
import FormContainer from "@/custom/components/FormContainer.vue";
import PromiseButton from "@/custom/components/PromiseButton.vue";
import {BuildByModelName} from "@/custom/forms/utils/BuildByModelName";
import TableByModelName from "@/custom/components/forms/TableByModelName.vue";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {Table} from "@/custom/components/table/Table";

export default {
  components: {Card, PromiseButton, FormBuilder},
  props: ['modelName', 'disableTitle', 'showEditButton', 'onFields', 'onTableCreation', 'overrideOptions', 'onOrderField', 'onBuildFields', 'onFormReady', 'onModes'],
  setup(props) {

    const buildByModelName = new BuildByModelName(
        props.modelName,
        {
          overrideOptions: props.overrideOptions,
          onModes: props.onModes,
          onBuildFields: props.onBuildFields,
          onFields: (field: FieldComponentPropsInterface) => {
            if (props.onFields) {
              field = props.onFields(field);
            }

            if (field['rel_model'] && field['select_multiple']) {
              field['col_class'] = 'col-12';
              field['field_type'] = 'component';

              class ExtendTable extends Table {

                get showActionButtons(): boolean {
                  return false;
                }

                get showContextMenuUpdate(): boolean {
                  return false;
                }

                get showContextMenuDelete(): boolean {
                  return false;
                }

                get showContextMenuView(): boolean {
                  return false;
                }

                onDeleteClicked(data) {
                  this.context.emit('delete', data);
                }
              }

              let tableConfig = {
                filterModelName: field['rel_model'],
                filterModelField: field,
                sourceModelName: props.modelName,
                title: !props.disableTitle ? field['label'] : undefined,
                extendClass: ExtendTable,
              };

              if (props.onTableCreation) {
                tableConfig = props.onTableCreation(tableConfig, field);
              }

              field['selected_component'] = h(TableByModelName, tableConfig);

              field['label'] = undefined;
              field['placeholder'] = undefined;
            }
            field['read_only'] = true;
            return field;
          },
          onOrderField: props.onOrderField,
        }
    );

    watch(buildByModelName.formBuilt, (e) => {
      if (e && props.onFormReady) {
        props.onFormReady(buildByModelName);
      }
    });

    buildByModelName.getFields();

    return {
      formFound: buildByModelName.formFound,
      formBuilt: buildByModelName.formBuilt,
      buildByModelName,
    }
  }
}
</script>