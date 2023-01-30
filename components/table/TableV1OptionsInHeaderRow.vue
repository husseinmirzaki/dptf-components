<template>
  <tr>
    <td v-if="onlineFields.length > 0">loading</td>
    <template v-else-if="noRefs['extend']">
      <th v-if="defaultConfig.showActionButtons"></th>
      <FormBuilder @compChanged="compChanged" :fields="noRefs['extend'].activeFields" :fieldContainer="TableV1OptionsInHeaderRowEmpty"/>
    </template>
  </tr>
</template>
<script lang="ts">

import {defineComponent, onMounted, onUnmounted, reactive, watch, Ref, ref} from "vue";
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
    let toUnMount: Array<{key: string, toCall: (any) => void}> = [];
    const onlineFields: any = reactive([]);
    const noRefs: any = reactive({});
    let fields: Array<FieldComponentPropsInterface> = [];
    let changedMode: Ref<Record<string, any>> = ref({});

    const buildExtend = () => {
      fields.forEach((e) => {
        const key = `${e['name']}-comp`;
        const toCall = (newMode) => {
          console.log("new mode", newMode);
          
          changedMode.value[e['name']] = newMode;
        };
        VueInstanceService.on(key, toCall);
        toUnMount.push({key, toCall});
        e['fieldContainer'] = TableV1OptionsInHeaderRowFieldContainer;
        if (!e['placeholder'] && e['label'])
          e['placeholder'] = e['label'];
        delete e['label'];
      });
      noRefs['extend'] = new CreateForm(fields).extend();
      watch([noRefs['extend'].obj, changedMode.value], (e) => {
        const data = noRefs['extend'].obj;
        const keys = Object.keys(data);
        if (keys.length == 0) return;

        props.defaultConfig.clearFilters();
        keys.forEach((key) => {
          if (!data[key] || data[key] == "")
            return;

          const filters: any = [];

          if (Array.isArray(data[key])) {
            data[key].forEach((filterValue) => {
              filters.push({
                "text": filterValue,
                "value": filterValue,
                "comp": String(changedMode.value[key] || "auto"),
              });
            });
          } else {
            filters.push({
              "text": data[key],
              "value": data[key],
              "comp": String(changedMode.value[key] || "auto"),
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

    const compChanged = () => {
      console.log("here");
    }

    onMounted(() => {
      VueInstanceService.on(`show-table-filter-${props.defaultConfig.tableName}`, onFieldInformation);
      props.actualHeaders.forEach((field, index) => {
        props.defaultConfig.onShowFilter(field['key'], index, undefined);
      });
      VueInstanceService.off(`show-table-filter-${props.defaultConfig.tableName}`, onFieldInformation);
    })

    onUnmounted(() => {
      toUnMount.forEach((e) => {
        VueInstanceService.off(e.key, e.toCall);
      });
    });


    return {
      onlineFields,
      noRefs,
      compChanged,
      TableV1OptionsInHeaderRowEmpty,
    }
  }
});
</script>