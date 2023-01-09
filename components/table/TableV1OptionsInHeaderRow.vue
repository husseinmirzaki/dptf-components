<template>
  <tr>
    <td v-if="onlineFields.length > 0">loading</td>
    <template v-else-if="noRefs['extend']">
      <FormBuilder :fields="noRefs['extend'].activeFields" :fieldContainer="TableV1OptionsInHeaderRowEmpty"/>
    </template>
  </tr>
</template>
<script lang="ts">

import {defineComponent, onMounted, onUnmounted, reactive, watch} from "vue";
import {VueInstanceService} from "@/Defaults";
import {FieldsApiService} from "@/custom/services/FieldsApiService";
import {CreateForm} from "@/custom/helpers/BaseForm";
import FormBuilder from "@/custom/components/FormBuilder.vue";
import TableV1OptionsInHeaderRowFieldContainer
  from "@/custom/components/table/TableV1OptionsInHeaderRowFieldContainer.vue";
import TableV1OptionsInHeaderRowEmpty from "@/custom/components/table/TableV1OptionsInHeaderRowEmpty.vue";
import {modelToServiceMap} from "@/ModelToServiceMap";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";

export default defineComponent({
  components: {FormBuilder},
  props: ['defaultConfig', 'actualHeaders'],
  setup(props) {
    const onlineFields: any = reactive([]);
    const noRefs: any = reactive({});
    const fields: any = [];

    const buildExtend = () => {
      fields.forEach((e) => {
        e['fieldContainer'] = TableV1OptionsInHeaderRowFieldContainer;
        if (!e['placeholder'] && e['label'])
          e['placeholder'] = e['label'];
        delete e['label'];
      });
      noRefs['extend'] = new CreateForm(fields).extend();
      watch(noRefs['extend'].obj, (e) => {
        props.defaultConfig.clearFilters();
        Object.keys(e).forEach((key) => {
          if (!e[key] || e[key] == "")
            return;

          const filters: any = [];

          if (Array.isArray(e[key])) {
            e[key].forEach((filterValue) => {
              filters.push({
                "text": filterValue,
                "value": filterValue,
                "comp": "1",
              });
            });
          } else {
            filters.push({
              "text": e[key],
              "value": e[key],
              "comp": "1",
            });
          }
          props.defaultConfig.applyFilter(key, filters);
        });
        props.defaultConfig.refresh();
      })
    }

    const onFieldInformation = (event) => {
      fields.push(event);
      const index = fields.length - 1;
      if (event.fieldName) {
        onlineFields.push('1');
        // incase a fieldName was provided
        // it means that the developer is
        // asking us to create new field automatically
        // model name can be provided by developer
        // using modelName key on event
        const modelName = event['modelName'] || props.defaultConfig.modelName;

        // we must get field information from server
        FieldsApiService.getFieldConfig(modelName, event.fieldName).then(
            ({data}) => {
              fields[index] = data;
              if (data["rel_model"]) {
                const service = modelToServiceMap[data["rel_model"]];
                data["field_type"] = "select";
                data["select_url"] = service.selectUrl;
              }
              if (data["field_type"] == "select") {
                if (!data["select_options"]) {
                  data["select_options"] = {};
                }
                data["select_multiple"] = true;
              }
              if (onlineFields.length == 1) {
                buildExtend();
              }
              onlineFields.pop();
            }
        );
      } else {
        fields[index] = {
          ...fields[index]['customFilterField']
        }
        // developer created a new customFilterField
        // which will be used to render input field
        // lastRequestedField = event.customFilterField;
        // getFilters();
        // loadingField.value = false;
      }
    }

    onMounted(() => {
      VueInstanceService.on(`show-table-filter-${props.defaultConfig.tableName}`, onFieldInformation);
      props.actualHeaders.forEach((field, index) => {
        props.defaultConfig.onShowFilter(field['key'], index, undefined);
      });
      VueInstanceService.off(`show-table-filter-${props.defaultConfig.tableName}`, onFieldInformation);
    })


    return {
      onlineFields,
      noRefs,
      TableV1OptionsInHeaderRowEmpty,
    }
  }
});
</script>