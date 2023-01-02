<style lang="scss">
@media (max-width: 972px) {
  .table-v2-custom {
    td,
    th {
      user-select: none;
    }
  }
}

@media print {
  table {
    top: 0;
    left: 0;
    position: fixed !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 999999999999999 !important;
    background: white !important;
  }
}

.with-action-buttons {
  th {
    padding: 3px;
    position: sticky;
    left: 0;
    background: white !important;
    top: 0;
    z-index: 1;
    width: 25vw;
  }

  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 2;
    background: white !important;
  }
}

th:first-child {
  .filter-place-holder .fixed-filter-container {
    right: auto !important;
    transform: translateX(-90%) !important;
  }
}

th:last-child {
  .filter-place-holder .fixed-filter-container {
    transform: translateX(-10%) !important;
  }
}

tbody .table-row-container {
  z-index: 1;

  &:hover {
    z-index: 2;
    //outline: 3px solid rgba(0, 0, 0, 0.5);
  }
}

[item-data-id].notify-longer {
  transition: background-color 6s ease;
}

[item-data-id].notify {
  background-color: #c76969;
}

</style>
<style lang="scss" scoped>
table {
  direction: ltr;
}

table {
  th {
    direction: rtl !important;
    color: black;
    border-left: 1px solid #e9ebf1;
    min-width: 130px;
    max-width: 200px;
    padding: 6px !important;

    &.check-stuff {
      width: 50px !important;
      max-width: 50px !important;
      min-width: 50px !important;
    }

    &:last-child {
      border-left: none;
    }
  }

  td {
    direction: rtl !important;
    z-index: 1;
    height: 35px;
    //border-left: 1px solid #dddee3;
    border-bottom: 1px solid #dddee3;
    box-shadow: none;
    color: #5e5e5e;
    white-space: nowrap;

    &:last-child {
      border-left: none;
    }

    &.check-stuff-items {
      padding: 0 5px!important;
    }

    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  tbody tr {
    z-index: 1;

    &:hover {
      z-index: 2;

      td {
        box-shadow: 0 2px 3px -3px rgba(0, 0, 0, 1) inset,
        0 -3px 3px -3px rgba(0, 0, 0, 1) inset;
      }
    }
  }
}

.is-replace-able {
  transition: box-shadow 0.5s ease;
  box-shadow: 0 0 0 -2px black !important;
}

.selected-this-one {
  box-shadow: 0 0 0 5px black !important;
}

.show-animation {
  background-color: #f3f6f8 !important;
  box-shadow: 0 0 3px black !important;
  transform: rotateZ(5deg) !important;
}

.table-responsive::-webkit-scrollbar {
  width: auto !important;
  height: auto !important;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: #d4d6d9 !important;
}

.table-responsive:hover {
  scrollbar-color: #a4a4a4 transparent !important;
}

.table-responsive:hover::-webkit-scrollbar-thumb {
  background-color: #cacdd0 !important;
}

.is-showing-filter {
  min-width: 100px !important;
  width: 100px !important;
}

td:not(.is-showing-filter) [header-name="row_number"] {
  min-width: 40px !important;
  width: 40px;
  max-width: 90px !important;
}
</style>
<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted, onUnmounted,
  ref,
  render,
  resolveComponent,
  toRef,
  watch, WatchStopHandle,
  withModifiers,
} from "vue";
import Card from "@/custom/components/Card.vue";
import Spinner from "@/custom/components/Spinner.vue";
import DropdownV2 from "@/custom/components/DropdownV2.vue";
import TableFilter from "@/custom/components/table/TableFilter.vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import TablePagination from "@/custom/components/table/TablePagination.vue";
import TableV1OptionsInHeader from "@/custom/components/table/TableV1OptionsInHeader.vue";
import TableV1OptionsInHeaderRow from "@/custom/components/table/TableV1OptionsInHeaderRow.vue";

import {Table} from "@/custom/components/table/Table";
import {Configs} from "@/Configs";
import {mobileCheck} from "@/custom/helpers/MobileHelpers";
import {MenuComponent} from "@/assets/ts/components";
import {DEFAULT_BUTTONS} from "@/custom/helpers/RenderFunctionHelpers";
import {VueInstanceService} from "@/Defaults";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import {UserPreferencesManager} from "@/custom/services/UserPreferencesV2Api";
import {DragHandler, SimpleDrag} from "@/custom/components/table/TableDrag";
import Sortable from "sortablejs";
import {hooks} from "prismjs";
import all = hooks.all;

export default defineComponent({
  props: {
    url: {
      default: () => {
        return "";
      },
    },
    conf: {
      default: () => {
        return Table;
      },
    },
    navItems: {
      default: () => [],
    },
    icon: {
      default: "media/icons/duotune/maps/map008.svg",
    },
    title: {
      default: "موضوع جدول",
    },
    currentPage: {
      default: 0,
    },
    description: {
      default: "توضیحاتی درمورد جدول که اطلاعات کلیی در مورد جدول به ما میدهد",
    },
    disableCard: {
      default: false,
    },
    disableDrag: {
      default: !Configs["cardsAreDraggable"],
    },
    userPreferences: {
      default: false,
    },
    disableDropdown: {
      default: false,
    },
    optionsInHeader: {
      default: false,
    },
    list: {
      default: () => {
        return [];
      },
    },
    widgetClasses: String,
  },
  data() {
    return {
      filterShow: false,
    };
  },
  setup(props, context) {
    // issue #8
    const _watchList: Array<WatchStopHandle> = [];

    const isMobile = mobileCheck();
    const conf = toRef(props, "conf");
    const list = toRef(props, "list");
    const url = toRef(props, "url");

    let headersRef: any;
    let tableRef: any;
    let filtersRef: any;

    const dList: any = ref(list.value);
    const showInlineFilter = ref(false);
    const checkAll = ref(false);
    const changedHeaders = ref<Array<any>>([]);
    const headerVisibility = ref<Record<string, any>>({});

    const checkedDataList = ref<Record<string, boolean>>({});

    let drag: SimpleDrag | null = null;

    const checksDragHandler = new DragHandler();

    const initializeConfig = () => {
      if (!conf.value)
        return new Table(props, context, {
          onGetData: onGetData,
        });
      return new conf.value(props, context, {
        onGetData: onGetData,
      });
    }

    let skipCheckAll = false;
    let skipCheckedDataList = false;
    let skipCheckedDataListTime: any;
    /**
     * when sth is checked
     */
    _watchList.push(watch(
        checkedDataList,
        () => {
          Object.keys(checkedDataList.value).forEach((key) => {
            const values = Object.values(checkedDataList.value);
            for (let i=0; i < values.length; i++) {
              if (!values[i]) {
                if (skipCheckedDataList) {
                  clearTimeout(skipCheckedDataListTime);
                  skipCheckedDataListTime = setTimeout(() => {
                    skipCheckedDataList = false;
                  }, 100);
                  skipCheckAll = true;
                } else  {
                  skipCheckAll = true;
                }
                checkAll.value = false;
                return;
              }
            }
            checkAll.value = true;
          });
        },
        {
          deep: true,
        }
    ));

    /**
     * in case conf suddenly changed
     */
    _watchList.push(watch(
        conf,
        () => {
          defaultConfig = initializeConfig();

          checkAll.value = false;
          changedHeaders.value = [];
          headerVisibility.value = {};
          checkedDataList.value = {};

          mount();
        },
        {
          deep: true,
        }
    ));

    /**
     * when current data changes here we will check
     * which of items are supposed to be checked or not
     */
    _watchList.push(watch(
        dList,
        (e) => {
          // if (dList.value) {
          //   dList.value.forEach((data: any) => {
          //     if (
          //         checkedDataList.value[`check_${data.id}`] == undefined ||
          //         checkedDataList.value[`check_${data.id}`] == null
          //     )
          //       checkedDataList.value[`check_${data.id}`] = checkAll.value;
          //   });
          // }
        },
        {
          deep: true,
        }
    ));

    _watchList.push(watch(
        list,
        () => {
          dList.value = list.value;
        }
    ));
    _watchList.push(watch(
        checkAll,
        (eee) => {
          if (skipCheckAll) {
            skipCheckAll = false;
            return;
          }
          if (!eee) {
            skipCheckedDataList = true;
          }
          // all previous checks
          Object.keys(checkedDataList.value).forEach((ee) => checkedDataList.value[ee] = checkAll.value);
          // new data
          dList.value.forEach((e) => {
            checkedDataList.value[`check_${e.id}`] = checkAll.value;
          });
        }
    ));
    _watchList.push(watch(
        url,
        () => {
          onGetData();
        }
    ));

    const checkedAnyItems = computed(() => {
      let oneIsChecked = false;
      const keys = Object.keys(checkedDataList.value);
      for (let i = 0; i < keys.length; i++) {
        if (!oneIsChecked && checkedDataList.value[keys[i]]) {
          oneIsChecked = true;
          break;
        }
      }

      return oneIsChecked || checkAll.value;
    });

    const onGetData = () => {
      console.debug("here");
      return new Promise<void>((resolve) => {
        if (defaultConfig.canUseUrl) {
          defaultConfig.onGetData().then(
              (e) => {
                dList.value = e;
                resolve();
              },
              () => resolve()
          );
        }
      });
    };

    let defaultConfig: Table = initializeConfig();

    watch(defaultConfig.headerVisibility, (e) => {
      headerVisibility.value = e;
    });

    watch(defaultConfig.changedHeader, (e) => {
      changedHeaders.value = defaultConfig.changedHeader;
    });

    const preferencesManager = new UserPreferencesManager(
        `${defaultConfig.preferencesPrefixKey}${defaultConfig.tableName}`
    );

    preferencesManager.get();

    _watchList.push(watch(
        preferencesManager.value,
        (e) => {
          buildPrimaryTableInfo(e);
          tableSetup(false);
        },
        {deep: true}
    ));

    const headers = computed(() => {
      if (changedHeaders.value.length > 0) return changedHeaders.value;
      return defaultConfig.headers(dList.value);
    });

    const onPage = (e) => {
      defaultConfig.currentPage.value = Number(e);
      onGetData();
    };

    const contextMenu = (item) => {
      if (!isMobile) {
        ContextMenuService.clickData = item;
        ContextMenuService.set(defaultConfig.getContextMenuItems(item));
      }
    };

    const getTableSettings = () => {
      preferencesManager.get().then(
          () => {
            tableSetup();
          },
          () => {
            tableSetup();
          }
      );
    };

    const saveTableSettings = () => {
      preferencesManager.set({
        defaultHeaders: Object.assign({}, defaultConfig.defaultHeaders),
        headers: Object.assign([], headers.value),
        headerVisibility: Object.assign({}, headerVisibility.value),
      });
    };

    const buildPrimaryTableInfo = (value) => {
      let newHeaders: any = [];

      // check default headers exists in config
      if (value.defaultHeaders && value.defaultHeaders.indexOf) {
        for (let i = 0; i < defaultConfig.defaultHeaders.length; i++) {
          if (
              value.defaultHeaders.indexOf(defaultConfig.defaultHeaders[i]) == -1
          ) {
            newHeaders.push(defaultConfig.defaultHeaders[i]);
          }
        }
      }
      if (value.headers) {
        changedHeaders.value.splice(0);
        changedHeaders.value.push(...newHeaders, ...value.headers);
      } else {
        changedHeaders.value.splice(0);
        changedHeaders.value.push(...headers.value, ...newHeaders);
      }
      if (value.headerVisibility) {
        headerVisibility.value = value.headerVisibility;
        newHeaders.forEach((e) => (headerVisibility.value[e] = true));
      } else {
        headerVisibility.value = {};
        headers.value.forEach((e) => {
          headerVisibility.value[e] = true;
          defaultConfig.headerVisibility[e] = true;
        });
        newHeaders.forEach((e) => {
          headerVisibility.value[e] = true
          defaultConfig.headerVisibility[e] = true;
        });
      }
    };

    buildPrimaryTableInfo({});

    let watchHeaderVisibility = false;
    _watchList.push(watch(
        headerVisibility,
        () => {
          if (watchHeaderVisibility) saveTableSettings();
        },
        {
          deep: true,
        }
    ));

    const tableSetup = (getData = true) => {
      watchHeaderVisibility = false;
      if (Object.keys(headerVisibility.value).length == 0) {
        headers.value.forEach((header) => {
          headerVisibility.value[header] = true;
        });
      }
      watchHeaderVisibility = true;
      if (!url.value || url.value == "") {
        // dragStuff();
      } else {
        if (getData)
          onGetData().then(() => {
            // dragStuff();
          });
      }
    };

    const mount = () => {
      MenuComponent.reinitialization();

      if (headersRef)
        Sortable.create(headersRef, {
          group: defaultConfig.tableName,
          draggable: ".custom-table-th",
          direction: "horizontal",
          animation: 180,
          filter: "[ignore-drags]",
          onUpdate: () => {
            setTimeout(() => {
              const l: Array<string> = [];
              for (let i = 0; i < headersRef.children.length; i++) {
                l.push(headersRef.children[i].getAttribute("header-name"));
              }
              changedHeaders.value.splice(0);
              changedHeaders.value.push(...l.reverse());
              defaultConfig.defaultHeaders = l;
              saveTableSettings();
            });
          },
        });

      if (!props.disableDropdown && !defaultConfig.disableDropdown && filtersRef)
        Sortable.create(filtersRef, {
          group: defaultConfig.tableName,
          draggable: ".field",
          direction: "vertical",
          animation: 180,
          onUpdate: () => {
            setTimeout(() => {
              const l: Array<string> = [];
              const items = filtersRef.querySelectorAll("input[name]");
              for (let i = 0; i < items.length; i++) {
                l.push(items[i].getAttribute("name"));
              }
              changedHeaders.value.splice(0);
              changedHeaders.value.push(...l);
              defaultConfig.defaultHeaders = l;
              saveTableSettings();
            });
          },
        });

      getTableSettings();
      let lastTimeoutNotify: any;
      let lastTimeoutNotifyLonger: any;
      VueInstanceService.on(defaultConfig.tableName, (e) => {
        if (e[0] == "refresh-one") {
          const _data: any = e[1];
          const found = dList.value.findIndex(
              (item) => item["id"] && item["id"] == _data["id"]
          );
          if (found > -1) {
            dList.value.splice(found, 1, _data);
            nextTick(() => {
              const a = document.querySelector(
                  `[item-data-id="${_data["id"]}"]`
              );
              if (a) {
                a.classList.add("notify-longer");
                a.classList.add("notify");
                clearTimeout(lastTimeoutNotify);
                clearTimeout(lastTimeoutNotifyLonger);
                lastTimeoutNotify = setTimeout(
                    () => a.classList.remove("notify"),
                    6000
                );
                lastTimeoutNotifyLonger = setTimeout(
                    () => a.classList.remove("notify-longer"),
                    12000
                );
              }
            });
          }
        }
      });
      defaultConfig.onTableMounted();
      // getTableSettings().then(({data}) => {
      //     if (data.value) {
      //       const value = JSON.parse(data.value);
      //       if (value.headers) {
      //         changedHeaders.value.splice(0)
      //         changedHeaders.value.push(...value.headers)
      //       }
      //       if (value.headerVisibility) {
      //         headerVisibility.value = value.headerVisibility;
      //       }
      //     }
      //     tableSetup();
      //   });
    };

    onMounted(mount);
    onUnmounted(() => {
      _watchList.forEach((w) => {
        try {
          w();
        } catch (e) {
          //
        }
      });
    })

    const noHeaderSelected = computed(() => {
      const keys = Object.keys(headerVisibility.value);
      for (let i = 0; i < keys.length; i++) {
        if (headerVisibility.value[i]) {
          return false;
        }
      }
      return true;
    });

    const checkCheckFieldData = (key) => {
      if (checksDragHandler.isMouseDown.value) {
        checkedDataList.value[key] = true;
      }
    };

    const checkedItems = computed(() => {
      const keys: Array<string> = [];
      Object.keys(checkedDataList.value).forEach((key) => {
        if (checkedDataList.value[key]) keys.push(key);
      });
      return keys;
    });

    context.expose({
      isMobile,
      checksDragHandler,

      // data
      dList,
      checkAll,
      checkedDataList,
      defaultConfig,
      changedHeaders,
      headerVisibility,

      // computed
      headers,
      checkedAnyItems,
      noHeaderSelected,
      checkedItems,

      // ref
      headersRef,
      tableRef,

      // function
      onPage,
      contextMenu,
      checkCheckFieldData,
      refresh: onGetData,
    });

    const buildTHead = () => {
      // headers might be changed
      // so consider that as well
      const headersToIterate =
          changedHeaders.value.length > 0 ? changedHeaders.value : headers.value;

      const checkBoxes = defaultConfig.checkAble
          ? h(
              "th",
              {
                class: "check-stuff",
                "ignore-drags": 1,
              },
              h(FieldComponent, {
                modelValue: checkAll.value,
                'onUpdate:modelValue': (ee) => checkAll.value=ee,
                col_class: "",
                input_container_class: "",
                defaultInputClasses: "",
                show_errors: false,
                field_type: "checkbox",
              })
          )
          : undefined;

      const actualHeaders = headersToIterate
          .filter((header) => headerVisibility.value[header])
          .map((header, index) => {
            return h(defaultConfig.onTHeadComponent(header, index), {
              key: header,
              onShowFilter: () => defaultConfig.onShowFilter(header, index),
              onToggleOrder: () => defaultConfig.toggleOrder(header),
              moveable: defaultConfig.disabledDrags.indexOf(header) > -1 ? undefined : "moveable",
              disableFilters: defaultConfig.disabledFilters.indexOf(header) > -1 ? 1 : undefined,
              "ignore-drags": defaultConfig.disabledDrags.indexOf(header) > -1 ? 1 : undefined,
              isFiltered:
                  defaultConfig.filteredHeaders.value.indexOf(header) > -1,
              sortDirection:
                  defaultConfig.orderedField.value["name"] === header
                      ? defaultConfig.orderedField.value["order"]
                      : undefined,
              "header-name": header,
              group: defaultConfig.tableName,
              ...((d) => {
                if (!d['class']) {
                  d['class'] = [];
                }
                d['class'].push({
                  'is-showing-filter': showInlineFilter.value
                } as any);
                return d;
              })(defaultConfig.onTHeadProps(header, index)),
            });
          });

      const actionButtons = defaultConfig.showActionButtons
          ? h(defaultConfig.onTHeadComponent("table-action", -1), {
            disableFilters: 1,
            "ignore-drags": 1,
            "header-name": "table-action",
            group: defaultConfig.tableName,
            ...defaultConfig.onTHeadProps("table-action", -1),
          })
          : undefined;

      return h(
          "thead",
          {
            onUpdate: withModifiers(() => {
              //
            }, ["stop", "prevent"]),
          },
          [
            h(
                "tr",
                {
                  ref: (el) => (headersRef = el),
                  class: "fw-bolder text-muted bg-light",
                },
                [
                  // action buttons
                  actionButtons,
                  // actual headers
                  ...actualHeaders.reverse(),
                  // checkboxes
                  checkBoxes,
                ]
            ),
            defaultConfig.showOptionsInHeader && showInlineFilter.value ? h(TableV1OptionsInHeaderRow, {
              defaultConfig, actualHeaders
            }) : undefined,
          ]
      );
    };

    const buildTBody = () => {
      const headersToIterate =
          changedHeaders.value.length > 0 ? changedHeaders.value : headers.value;
      let tr: any;
      if (!dList.value || dList.value.length == 0) {
        tr = h(
            "tr",
            {},
            h(
                "td",
                {
                  dir: "rtl",
                  colspan: headersToIterate.filter(
                      (header) => headerVisibility.value[header]
                  ).length + (defaultConfig.showActionButtons ? 1 : 0),
                  class: ["text-center"]
                },
                context.slots["empty"]
                    ? context.slots["empty"]()
                    : "داده ای برای نمایش موجود نمی‌باشد ؟"
            )
        );
      } else {
        tr = dList.value.map((item, index) => {
          return h(
              defaultConfig.onTBodyRowComponent(item, index),
              {
                key: item["id"] ? "tr_" + item["id"] : "tr_index_" + index,
                "data-context-menu": "true",
                "item-data-id": item["id"] ? item["id"] : index,
                onContextmenu: () => contextMenu(item),
                onMouseenter: () => {
                  checkCheckFieldData(`check_${item["id"]}`);
                },
                onClick: () => {
                  context.emit("on-row-selected", item);
                },
                ...defaultConfig.onTBodyRowBinds(item, index),
              },
              {
                default: () => {
                  const checkBox = defaultConfig.checkAble
                      ? h(
                          "td",
                          {
                            class: "check-stuff-items",
                            onMousemove: () => {
                              checkCheckFieldData(`check_${item["id"]}`);
                            },
                            onMouseenter: () => {
                              checkCheckFieldData(`check_${item["id"]}`);
                            },
                            onClick: () =>
                                (checkedDataList.value[`check_${item["id"]}`] =
                                    !checkedDataList.value[`check_${item["id"]}`]),
                          },
                          h(FieldComponent, {
                            modelValue: checkedDataList.value[`check_${item["id"]}`],
                            col_class: "",
                            input_container_class: "",
                            defaultInputClasses: "",
                            show_errors: false,
                            field_type: "checkbox",
                          })
                      )
                      : undefined;

                  const dataTds = headersToIterate
                      .filter((header) => headerVisibility.value[header])
                      .map((header, headerIndex) => {
                        const props = defaultConfig.onTBodyProps(
                            item,
                            header,
                            headerIndex,
                            index
                        );
                        let key =
                            String(item["id"] ? "td_" + item["id"] : "td_" + index) +
                            header +
                            headerIndex;
                        if (props["data"]) {
                          key += String(props["data"]);
                        }
                        return h(
                            defaultConfig.onTBodyComponent(
                                item,
                                header,
                                headerIndex,
                                index
                            ),
                            {
                              key: key,
                              ...props,
                            }
                        );
                      });

                  const actionButtons = defaultConfig.showActionButtons
                      ? h(
                          "td",
                          {
                            class: "pe-2 text-nowrap text-center",
                          },
                          defaultConfig
                              .getContextMenuItems(item)
                              .map((contextMenuItem, contextMenuIndex) => {
                                return DEFAULT_BUTTONS.default(
                                    {
                                      class: [
                                        `btn-sm p-1 btn-${
                                            contextMenuItem.state
                                                ? contextMenuItem.state
                                                : "primary"
                                        }`,
                                        {
                                          "ms-1": contextMenuIndex > 0,
                                        },
                                      ],
                                      onClick: () => {
                                        if (contextMenuItem.onClick)
                                          contextMenuItem.onClick(item);
                                      },
                                    },
                                    [
                                      //<i v-if="item.icon" :class="item.icon"></i>
                                      contextMenuItem.faIcon
                                          ? h("i", {class: contextMenuItem.faIcon})
                                          : undefined,
                                      contextMenuItem.svgIcon
                                          ? h(
                                              "span",
                                              {
                                                class: [
                                                  "svg-icon me-4",
                                                  `svg-icon-${
                                                      contextMenuItem.state
                                                          ? contextMenuItem.state
                                                          : "primary"
                                                  }`,
                                                  contextMenuItem.svgIcon.spanClass,
                                                ],
                                              },
                                              h(resolveComponent("inline-svg"), {
                                                src: contextMenuItem.svgIcon.src,
                                              })
                                          )
                                          : undefined,
                                      contextMenuItem.text,
                                    ]
                                );
                              })
                      )
                      : undefined;

                  return [actionButtons, ...dataTds.reverse(), checkBox];
                },
              }
          );
        });
      }

      return h("tbody", {}, tr);
    };

    const buildTable = () => {
      return h(
          "div",
          {
            ref: (el) => (tableRef = el),
            class: "table-responsive table-container",
          },
          // table
          h(
              "table",
              {
                class: [
                  "table table-bordered align-middle ge-4 gy-4 table-hover table table-v2-custom",
                  {
                    "mb-0": !defaultConfig.showPagination,
                    "with-action-buttons": defaultConfig.showActionButtons,
                  },
                ],
              },
              [buildTHead(), buildTBody()]
          )
      );
    };

    const buildCardBody = () => {
      return h(
          Spinner,
          {
            loading: defaultConfig.isLoading.value,
          },
          {
            default: () => {
              const table = buildTable();

              const cardBody = h(
                  "div",
                  {
                    class: ["card-body m-0 p-0", context.attrs["bodyClass"]],
                  },
                  [
                    table,
                    defaultConfig.showPagination
                        ? (() => {
                          const paginator = h(TablePagination, {
                            key:
                                defaultConfig.defaultTableName +
                                `_pagination_${defaultConfig.count.value}`,
                            currentPage: defaultConfig.currentPage.value,
                            count: defaultConfig.count.value,
                            onPageSelected: onPage,
                          });
                          if (defaultConfig.teleportPaginationToSelector != "") {
                            const elementToTeleportTo = document.querySelector(
                                defaultConfig.teleportPaginationToSelector
                            );
                            if (elementToTeleportTo) {
                              render(paginator, elementToTeleportTo);
                              return undefined;
                            }
                          }
                          return paginator;
                        })()
                        : undefined,
                  ]
              );
              return cardBody;
            },
          }
      );
    };

    return () => {
      const slots: Record<string, any> = {
        ...context.slots,
      };

      if (!props.disableDropdown && !defaultConfig.disableDropdown) {
        const headersToIterate =
            changedHeaders.value.length > 0
                ? changedHeaders.value
                : headers.value;
        slots["dropDown"] = h(
            DropdownV2,
            {},
            {
              icons: () => {
                return h(
                    "div",
                    {
                      class: "me-n4",
                    },
                    h(
                        "button",
                        {
                          type: "button",
                          class:
                              "btn btn-sm btn-icon btn-color-primary btn-active-light-primary",
                          onClick: () => defaultConfig.requestExport(),
                        },
                        h(
                            "span",
                            {
                              class: "svg-icon svg-icon-2",
                            },
                            h(
                                resolveComponent("ElTooltip"),
                                {
                                  content: "خروجی اکسل",
                                },
                                h(resolveComponent("inline-svg"), {
                                  src: "media/icons/duotune/files/fil021.svg",
                                })
                            )
                        )
                    )
                );
              },
              default: () => {
                return h(
                    "div",
                    {
                      onUpdate: withModifiers(() => {
                        //
                      }, ["stop", "prevent"]),
                      class: "items-container",
                      ref: (el) => (filtersRef = el),
                    },
                    headersToIterate.map((header, index) =>
                        h(FieldComponent, {
                          key: header,
                          name: header,
                          disableFilters: defaultConfig.disabledFilters.indexOf(header) > -1 ? 1 : undefined,
                          "ignore-drags": defaultConfig.disabledDrags.indexOf(header) > -1 ? 1 : undefined,
                          modelValue: headerVisibility.value[header],
                          placeholder: defaultConfig.onTHeadProps(header, index)
                              .header,
                          field_type: "checkbox",
                          "onUpdate:modelValue": (e) =>
                              (headerVisibility.value[header] = e),
                        })
                    )
                );
              },
            }
        );
      }
      if (props.optionsInHeader || defaultConfig.showOptionsInHeader) {
        slots["toolbar2"] = h(TableV1OptionsInHeader, {
          defaultConfig,
          onShowRowFilter: (e) => {
            showInlineFilter.value = e;
          },
          onExport: () => {
            defaultConfig.requestExport()
          }
        });
      }
      // else {
      // }

      slots["card-body"] = buildCardBody;

      const card = h(
          Card,
          {
            cardTitle: context.attrs["cardTitle"]
                ? context.attrs.cardTitle
                : props.title,
            cardDescription: props.description,
            icon: props.icon,
            disableCard: props.disableCard,
            disableDrag: props.disableDrag,
            navItems: props.navItems,
            bodyPaddingClass: "m-0",
            onSelectedNavItem: (e) => context.emit("selectedNavItem", e),
            ...context.attrs,
          },
          slots
      );

      return [
        card,
        defaultConfig.showOptionsInHeader ? undefined : h(TableFilter, {defaultConfig: defaultConfig})
      ];
    };
  },
});
</script>
