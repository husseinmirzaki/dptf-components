<script lang="ts">
import { defineComponent, h, ref, toRef } from "vue";
import TableV1 from "@/custom/components/table/TableV1.vue";
import FixedHeightLoader from "@/custom/components/forms/FixedHeightLoader.vue";
import FixedHeightAccess from "@/custom/components/forms/FixedHeightAccess.vue";
import { modelToServiceMap } from "@/ModelToServiceMap";
import { Table } from "@/custom/components/table/Table";
import { FieldsApiService } from "@/custom/services/FieldsApiService";

export default defineComponent({
  props: [
    "filterModelName",
    "filterModelField",
    "filterModelId",
    "sourceModelName",
    "field",
    "title",
    "description",
    "onSearchParams",
    "onConfig",
    "onAfterConfig",
    "extendClass",
    "extendFromClass",
  ],
  setup(props, context) {
    const promise = FieldsApiService.getFieldsConfig(props.filterModelName);
    let table: any = null;
    const tableIsReady = ref(false);
    const loadingFailed = ref(false);
    const service = modelToServiceMap[props.filterModelName];
    const filterModelId = toRef(props, "filterModelId");

    if (!service) {
      throw new DOMException(`service does not exist ${props.filterModelName}`);
    }

    const tableClass = (fields) => {
      const defaultTableOptions: any = {
        defaultHeaders: [],
        headerTranslate: {},
      };

      if (props.onConfig) {
        props.onConfig(defaultTableOptions);
      }

      fields.forEach((field) => {
        defaultTableOptions.defaultHeaders.push(field.name);
        defaultTableOptions.headerTranslate[field.name] = field.label;
      });

      let extendClass = Table;

      if (props.extendClass) {
        extendClass = props.extendClass;
      }

      class TableClass extends extendClass {
        constructor(props, context, extra) {
          super(props, context, extra);
        }

        get modelName(): any {
          return props.filterModelName;
        }

        get service(): any {
          return service;
        }

        get tableName(): string {
          return props.filterModelName + "Table";
        }

        defaultHeaders = defaultTableOptions.defaultHeaders;
        headerTranslate = defaultTableOptions.headerTranslate;

        onTBodyComponent(item, header, index): any {
          if (defaultTableOptions.onTBodyComponent) {
            const data: any = defaultTableOptions.onTBodyComponent(
              item,
              header,
              index
            );
            if (data) {
              return data;
            }
          }
          return super.onTBodyComponent(item, header, index);
        }

        onTBodyProps(item, header, index): any {
          if (header !== 'row_number') {
            const field = fields.find((_field) => _field.name == header);
            if (field) {
              if (field.field_type == "select" && !field["rel_model"]) {
                if (item[header]) {
                  const found = field.select_data.find(
                      (_item) => _item[0] == item[header]
                  );
                  if (found)
                    return {
                      data: found[1],
                    };
                }
              }

              if (defaultTableOptions.onTBodyProps) {
                const data: any = defaultTableOptions.onTBodyProps(
                    item,
                    header,
                    index
                );
                if (data) {
                  return data;
                }
              }
            }
          }
          return super.onTBodyProps(item, header, index);
        }
      }

      if (props.extendFromClass) {
        table = props.extendFromClass(TableClass);
      } else {
        table = TableClass;
      }
      tableIsReady.value = true;
    };

    promise.then(
      ({ data }) => {
        tableClass(data);
      },
      ({ response }) => {
        // if (response.status >= 400 && response.status < 500) {
        //     this.formFound.value = false;
        // }
      }
    );

    return () => {
      if (tableIsReady.value) {
        const urlSearch = new URLSearchParams();

        if (props.filterModelField) {
          urlSearch.set("filter_model_name", props.filterModelName);
          if (typeof props.filterModelField == "string")
            urlSearch.set("filter_model_field", props.filterModelField);
          else
            urlSearch.set("filter_model_field", props.filterModelField["name"]);
        }

        if (filterModelId.value)
          urlSearch.set("filter_model_id", filterModelId.value);

        urlSearch.set("source_model_name", props.sourceModelName);

        if (props.onSearchParams) {
          props.onSearchParams(urlSearch);
        }

        let url = `${service.baseUrl}?${urlSearch}`;

        return h(
          TableV1,
          {
            disableDrag: true,
            cardTitle: props.title,
            description: props.description ? props.description : "",
            disableDropdown: false,
            url,
            class: "custom-field-class",
            conf: table,
          },
          context.slots
        );
      } else if (!loadingFailed.value) {
        return h(FixedHeightLoader);
      } else if (loadingFailed.value) {
        return h(FixedHeightAccess);
      }
    };
  },
});
</script>
<style lang="scss">
.custom-field-class {
  th p {
    font-size: 12px;
    font-weight: lighter;
  }

  td {
    font-size: 12px;
    font-weight: lighter;
  }
}
</style>
