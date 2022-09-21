<style lang="scss">
.table-v1-filter-holder {
  display: none;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);

  .filter-container {
    background: #ededed;
    position: absolute;
    top: 175px;
    left: 700px;
    box-shadow: 0 0 3px #000;
    border-radius: 3px;
    padding: 5px;

    input, .select2-container--default .select2-selection--multiple, .select2-container--default .select2-selection--single , .vpd-input-group{
      border-radius: 0 !important;
      box-shadow: none;
      height: 40px !important;
    }
  }
}
</style>
<script>
import FieldComponent from "../FieldComponent";
import {h, nextTick, onMounted, ref} from "vue";
import {VueInstanceService} from "@/Defaults";
import {Table} from "@/custom/components/table/Table";
import {FieldsApiService} from "@/custom/services/FieldsApiService";
import {modelToServiceMap} from "@/ModelToServiceMap";

export default {
  components: {FieldComponent},
  props: {
    defaultConfig: Table
  },
  setup(props) {

    let lastRequestedField;
    let filterContainer;
    const loadingField = ref(false);
    const currentData = ref();

    const showFilters = () => {
      filterContainer.style.display = 'block';
    }

    const hideFilters = () => {
      filterContainer.style.display = 'none';
      lastRequestedField = undefined;
      loadingField.value = true;
      nextTick(() => currentData.value = undefined);
    }

    onMounted(() => {
      VueInstanceService.on(`show-table-filter-${props.defaultConfig.tableName}`, (event) => {

        if (event) {

          showFilters();
          loadingField.value = true;
          if (event.fieldName) {
            const modelName = props.defaultConfig.modelName
            FieldsApiService.getFieldConfig(modelName, event.fieldName).then(({data}) => {
              lastRequestedField = data;
              loadingField.value = false;
            })
          } else {
            lastRequestedField = event.customFilterField
            loadingField.value = false;
          }
        }

      });
    });


    return () => {
      console.log("lastRequestedField", lastRequestedField);
      let dynamicField = undefined;
      if (loadingField.value) {
        dynamicField = h(
            'div',
            {
              class: 'd-flex justify-content-center align-items-center',
              style: {
                height: '39px'
              }
            },
            h(
                'p',
                {
                  class: 'p-0 m-0'
                },
                "درحال لود فیلتر"
            )
        )

      } else if (!loadingField.value && !lastRequestedField) {
        dynamicField = h(
            'div',
            {
              class: 'd-flex justify-content-center align-items-center',
              style: {
                height: '39px'
              }
            },
            h(
                'p',
                {
                  class: 'p-0 m-0'
                },
                "یک فیلتر را انتخاب کنید"
            )
        )
      } else {
        const fieldProps = {
          placeholder: lastRequestedField['label'],
          modelValue: currentData.value,
          'onUpdate:modelValue': (v) => currentData.value = v
        };
        if (lastRequestedField['field_type'] === "select") {
          fieldProps['field_type'] = "select";
          fieldProps['select_options'] = {
            minimumResultsForSearch: -1
          }
          fieldProps['modal_id'] = '.table-v1-filter-holder'
          if (lastRequestedField['select_multiple']) {
            fieldProps['select_url'] = modelToServiceMap[lastRequestedField['rel_model']].selectUrl;
          } else {
            fieldProps['select_data'] = lastRequestedField['select_data'];
          }
        } else {
          fieldProps['field_type'] = lastRequestedField['field_type'];
        }

        dynamicField = h(
            FieldComponent,
            fieldProps,
        );
      }
      const compField = h(
          FieldComponent,
          {
            modal_id: ".table-v1-filter-holder",
            field_type: "select",
            select_options: {
              minimumResultsForSearch: -1
            },
            select_data: [
              [0, 'مساوی'],
              [1, 'نامساوی'],
              [2, 'بزرگتر'],
              [3, 'کوچکتر'],
              [4, 'خالی'],
            ]
          }
      )


      const container = h(
          'div',
          {
            onClick: () => {
              hideFilters();
            },
            class: "position-fixed table-v1-filter-holder",
            ref: (el) => filterContainer = el,
          },
          h(
              'div',
              {
                onClick: (e) => {
                  e.stopPropagation();
                },
                class: 'filter-container',
              },
              h(
                  'div',
                  {
                    class: 'd-flex'
                  },
                  [
                    h(
                        'div',
                        {
                          style: {width: '200px'}
                        },
                        dynamicField
                    ),
                    h(
                        'div',
                        {
                          class: 'ms-1',
                          style: {width: '90px'}
                        },
                        compField
                    ),
                  ]
              )
          )
      );

      return container;
    }
  }
}

</script>