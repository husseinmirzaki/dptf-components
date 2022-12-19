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

  .add-filter-button {
    padding: 6px 5px 4px !important;
    border-radius: 0;
  }

  .filter-container {
    background: #ededed;
    position: absolute;
    top: 175px;
    left: 700px;
    box-shadow: 0 0 3px #000;
    border-radius: 3px;
    padding: 5px;

    input,
    .select2-container--default .select2-selection--multiple,
    .select2-container--default .select2-selection--single,
    .vpd-input-group {
      border-radius: 0 !important;
      box-shadow: none;
      height: 40px !important;
    }
  }
}
</style>
<script lang="ts">
import FieldComponent from "../FieldComponent.vue";
import {h, nextTick, onMounted, Ref, ref, watch} from "vue";
import {VueInstanceService} from "@/Defaults";
import {Table} from "@/custom/components/table/Table";
import {FieldsApiService} from "@/custom/services/FieldsApiService";
import {modelToServiceMap} from "@/ModelToServiceMap";
import {DEFAULT_BUTTONS} from "@/custom/helpers/RenderFunctionHelpers";
import InlineSvg from "vue-inline-svg";
import {randomId} from "@/custom/helpers/random";
import {sleep} from "@/custom/helpers/MiltiTasking";

type Comp = undefined | null | number;

export interface BuiltFilter {
  text: Ref<string>;
  comp: Comp;
  value: any;
  id: string;
}

export default {
  components: {FieldComponent},
  props: {
    defaultConfig: Table,
  },
  setup(props) {
    const BOOLEAN_COMP_SELECTS = [
      [null, "انتخاب کنید"],
      [1, "بلی"],
      [0, "خیر"],
    ];

    const FOREIGN_COMP_SELECTS = [
      [null, "انتخاب کنید"],
      [1, "مساوی"],
      [2, "بجز"],
    ];

    const STRING_COMP_SELECTS = [
      [null, "انتخاب کنید"],
      [1, "مساوی"],
      [2, "بجر"],
      [3, "شامل"],
      [4, "شروع شود"],
      [5, "تمام شود"],
    ];

    const DATE_COMP_SELECTS = [
      [null, "انتخاب کنید"],
      [1, "مساوی"],
      [2, "بجر"],
      [3, "بزرگتر"],
      [4, "بزرگتر مساوی"],
      [5, "کوچکتر"],
      [6, "کوچکتر مساوی"],
    ];

    const INTEGER_COMP_SELECTS = [
      [null, "انتخاب کنید"],
      [1, "مساوی"],
      [2, "بجر"],
      [3, "بزرگتر"],
      [4, "بزرگتر مساوی"],
      [6, "کوچکتر"],
      [7, "کوچکتر مساوی"],
    ];

    /**
     * Holds current visible information
     * on input field which user selected
     */
    const currentData: Ref = ref();

    /**
     * Holds current comparing method which
     * user selected
     */
    const currentComp: Ref<Comp> = ref();

    /**
     * increasing this number will cause a rebuilding
     */
    const reRendered: Ref<number> = ref(0);

    // element refs
    let filterContainer;
    let filterFieldInstance;
    let addButtonInstance;
    let compFieldInstance;

    // data from outside

    let lastRequestedField;

    /**
     * whether we are loading field information
     * or not this is used to show a loading
     * animation or text
     */
    const loadingField: Ref<boolean> = ref(false);

    /**
     * currently applied and non applied
     * filters lets say it only shows them
     * submitting filters is done in Table class
     */
    const currentFilters: Ref<Array<BuiltFilter>> = ref([]);

    /**
     * enables or disables filter buttons
     *
     * if a comparing option and filter is specified
     * buttons will be enabled otherwise they will be disabled
     */
    const checkFilterButtonStatus = () => {
      if (
          currentData.value === "" ||
          currentData.value === null ||
          currentData.value === undefined ||
          !currentComp.value
      ) {
        if (addButtonInstance) {
          addButtonInstance.disabled = true;
        }
      } else {
        if (addButtonInstance) {
          addButtonInstance.disabled = false;
        }
      }
    };

    /**
     * updates currentFilters list
     *
     * in case user is adding multiple filters
     * in one go we need to get currently set filters
     * from Table class and show them to user
     */
    const getFilters = () => {
      let fieldName = lastRequestedField.name;
      if (fieldName) {
        const data = props.defaultConfig.jsonFilters[fieldName];
        if (data && Array.isArray(data)) {
          currentFilters.value = Object.assign(
              [],
              props.defaultConfig.jsonFilters[fieldName]
          );
        } else {
          currentFilters.value = [];
        }
      }
    };

    /**
     * shows the floating filter container
     * this container contains a selection
     * for comparing and an input for filter
     */
    const showFilters = async () => {
      if (!filterContainer) {
        // if we do not have any filterContainers
        // what we do is we will try to rerender
        // the whole thing so its reference is
        // created
        reRendered.value++;
        while (!filterContainer) {
          await sleep(10);
          await nextTick();
        }
        filterContainer.style.display = "block";
      } else filterContainer.style.display = "block";
    };

    /**
     * closes floating filter container
     * and resetting settings to default state
     */
    const hideFilters = () => {
      filterContainer.style.display = "none";
      lastRequestedField = undefined;
      loadingField.value = true;
      compFieldInstance.setValue(null);
      currentFilters.value.splice(0, 999);
      nextTick(() => {
        currentData.value = undefined;
      });
    };

    /**
     * remove a filter from currentFilters list
     *
     * the removed filters will not be removed from
     * Table class until user click on apply
     * @param id
     */
    const removeFilter = (id) => {
      const index = currentFilters.value.findIndex((item) => item['id'] == id);

      if (index > -1) {
        currentFilters.value.splice(index, 1);
      }
    };

    /**
     * set the removed, added filters to Table class
     * and refresh the table
     *
     * pay attention if any filter is removed from currentFilters
     * list now will be gone same goes for newly added fields
     */
    const applyFilters = () => {
      props.defaultConfig.applyFilter(
          lastRequestedField.name,
          Object.assign([], currentFilters.value)
      );
      hideFilters();
      props.defaultConfig.refresh(true);
    };

    /**
     * users selects a comp and value this two are
     * used to filter table data
     */
    const addFilter = () => {
      if (lastRequestedField["rel_model"]) {
        const response = ref("در حال لود");
        modelToServiceMap[lastRequestedField["rel_model"]]
            .getOne(currentData.value)
            .then(({data: info}) => {
              if (info.name) {
                response.value = info.name;
              } else if (info.first_name && info.last_name) {
                response.value = info.first_name + " " + info.last_name;
              } else if (info.first_name) {
                response.value = info.first_name;
              } else if (info.last_name) {
                response.value = info.last_name;
              } else if (info.title) {
                response.value = info.title;
              } else if (info.number) {
                response.value = info.number;
              } else if (info.serial) {
                response.value = info.serial;
              } else {
                response.value = JSON.stringify(info);
              }
            });
        currentFilters.value.push({
          text: response,
          value: currentData.value,
          comp: currentComp.value,
          id: randomId(),
        });
      } else
        currentFilters.value.push({
          text: currentData.value,
          value: currentData.value,
          comp: currentComp.value,
          id: randomId(),
        });

      if (filterFieldInstance) {
        filterFieldInstance.setValue(null);
        compFieldInstance.setValue(null);
      }
    };

    watch(
        currentData,
        (e) => {
          checkFilterButtonStatus();
        },
        // TODO: this is not required
        {
          deep: true,
        }
    );

    watch(
        currentComp,
        (e) => {
          checkFilterButtonStatus();
        },
        // TODO: this is not required
        {
          deep: true,
        }
    );

    const currentFilterEventName = () => `show-table-filter-${props.defaultConfig.tableName}`;

    const listenForIncomingFilterRequest = () => {
      VueInstanceService.on(
          currentFilterEventName(),
          async (event) => {
            if (event) {
              await showFilters();
              loadingField.value = true;
              if (event.fieldName) {
                // incase a fieldName was provided
                // it means that the developer is
                // asking us to create new field automatically
                // model name can be provided by developer
                // using modelName key on event
                const modelName = event['modelName'] || props.defaultConfig.modelName;

                // we must get field information from server
                FieldsApiService.getFieldConfig(modelName, event.fieldName).then(
                    ({data}) => {
                      // console.log(data);
                      lastRequestedField = data;
                      loadingField.value = false;
                      getFilters();
                    }
                );
              } else {
                // developer created a new customFilterField
                // which will be used to render input field
                lastRequestedField = event.customFilterField;
                getFilters();
                loadingField.value = false;
              }
            }
          }
      );
    }
    onMounted(() => {
      listenForIncomingFilterRequest();
      checkFilterButtonStatus();
    });

    return () => {
      if (reRendered.value !== 0) {
        reRendered.value = 0;
        return;
      }

      const CURRENT_COMP_SELECT = (() => {
        if (!lastRequestedField) return [];

        const field_type = lastRequestedField.field_type;

        if (!field_type || field_type == "text") return STRING_COMP_SELECTS;
        else if (field_type == "integer" || field_type == "number")
          return INTEGER_COMP_SELECTS;
        else if (field_type == "p-date-time") return DATE_COMP_SELECTS;
        else if (field_type == "checkbox") return BOOLEAN_COMP_SELECTS;

        return FOREIGN_COMP_SELECTS;
      })();

      let dynamicField: any = undefined;
      if (loadingField.value) {
        dynamicField = h(
            "div",
            {
              class: "d-flex justify-content-center align-items-center",
              style: {
                height: "39px",
              },
            },
            h(
                "p",
                {
                  class: "p-0 m-0",
                },
                "درحال لود فیلتر"
            )
        );
      } else if (!loadingField.value && !lastRequestedField) {
        dynamicField = h(
            "div",
            {
              class: "d-flex justify-content-center align-items-center",
              style: {
                height: "39px",
              },
            },
            h(
                "p",
                {
                  class: "p-0 m-0",
                },
                "یک فیلتر را انتخاب کنید"
            )
        );
      } else if (lastRequestedField) {
        const fieldProps = {
          placeholder: lastRequestedField["label"],
          modelValue: currentData.value,
          "onUpdate:modelValue": (v) => (currentData.value = v),
          ref: (el) => (filterFieldInstance = el),
        };
        if (lastRequestedField["field_type"] === "select") {
          fieldProps["field_type"] = "select";
          fieldProps["modal_id"] = ".filter-container-like-model";
          fieldProps["select_multiple"] =
              !!lastRequestedField["select_multiple"];
          if (lastRequestedField["rel_model"]) {
            fieldProps["select_url"] =
                modelToServiceMap[lastRequestedField["rel_model"]].selectUrl;
            fieldProps["select_options"] = {
              onParams: (e) => {
                e.by_id = 1;
              },
            };
          } else {
            fieldProps["select_options"] = {
              minimumResultsForSearch: -1,
            };
            fieldProps["select_data"] = lastRequestedField["select_data"];
          }
        } else {
          fieldProps["field_type"] = lastRequestedField["field_type"];
        }

        if (lastRequestedField["field_type"] == "p-date-time") {
          fieldProps["dateTimeType"] = lastRequestedField["dateTimeType"];
        }

        dynamicField = h(FieldComponent, fieldProps);
      }
      const compField = h(FieldComponent as any, {
        ref: (el) => (compFieldInstance = el),
        name: "comp",
        modal_id: ".filter-container-like-model",
        modelValue: currentComp.value,
        "onUpdate:modelValue": (v) => (currentComp.value = v),
        field_type: "select",
        read_only: !lastRequestedField,
        select_options: {
          minimumResultsForSearch: -1,
        },
        select_data: CURRENT_COMP_SELECT,
      });

      const currentFilter = h(
          "div",
          {
            class: "d-flex",
          },
          [
            h(
                "div",
                {
                  style: {width: "200px"},
                },
                dynamicField
            ),
            h(
                "div",
                {
                  class: "ms-1",
                  style: {width: "90px"},
                },
                compField
            ),
          ]
      );

      const addFilterButton = [
        DEFAULT_BUTTONS.primary(
            {
              class: "btn-sm add-filter-button",
              ref: (el) => (addButtonInstance = el),
              onClick: addFilter,
            },
            "اضافه کردن فیلتر"
        ),
        DEFAULT_BUTTONS.primary(
            {
              class: "btn-sm add-filter-button ms-1",
              onClick: applyFilters,
            },
            "اعمال"
        ),
      ];

      const currentlySelectedFilters = currentFilters.value.map((e) =>
          h(
              "div",
              {
                key: e.id,
                class: "d-flex",
              },
              [
                h(
                    "div",
                    {
                      style: {
                        "flex-grow": 1,
                      },
                    },
                    e.text as any
                ),
                h(
                    "div",
                    {
                      style: {
                        "flex-grow": 1,
                      },
                    },
                    String((() => {
                      const found = CURRENT_COMP_SELECT.find((s) => s[0] == e.comp);
                      if (found) {
                        return found[1];
                      }
                      return "بدون";
                    })())
                ),
                h(InlineSvg, {
                  onClick: () => {
                    removeFilter(e.id);
                  },
                  style: {
                    width: "18px",
                  },
                  src: "media/icons/duotune/arrows/arr061.svg",
                }),
              ]
          )
      );

      return h(
          "div",
          {
            onClick: () => {
              hideFilters();
            },
            class: "position-fixed table-v1-filter-holder",
            ref: (el) => (filterContainer = el),
          },
          h(
              "div",
              {
                onClick: (e) => {
                  e.stopPropagation();
                },
                class: "filter-container filter-container-like-model",
              },
              [
                currentFilter,
                currentlySelectedFilters,
                h(
                    "div",
                    {
                      class: "d-flex align-items-end justify-content-end add-button",
                    },
                    addFilterButton
                )
              ]
          )
      );
    };
  },
};
</script>
