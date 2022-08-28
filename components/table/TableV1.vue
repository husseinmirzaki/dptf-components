<template>
  <Card
      :card-title="title"
      :card-description="description"
      :icon="icon"
      :disable-card="disableCard"
      :disable-drag="disableDrag"
      body-padding-class="m-0"
      :nav-items="navItems"
      @selected-nav-item="$emit('selectedNavItem', $event)">
    <template #card-title-content>
      <slot name="card-title-content"/>
    </template>
    <template v-slot:dropDown v-if="!disableDropdown">
      <DropdownV2>
        <!--        <div class="pb-1" v-if="defaultConfig.filterForm.formInstance">-->
        <!--          <button @click="filterShow = !filterShow" class="btn btn-sm btn-primary btn-icon ms-2">-->
        <!--            <i class="fas fa-filter"></i>-->
        <!--          </button>-->
        <!--          <button @click="defaultConfig.filterForm.formInstance.resetForm()"-->
        <!--                  class="btn btn-sm btn-primary btn-icon ms-2">-->
        <!--            <i class="fas fa-undo"></i>-->
        <!--          </button>-->
        <!--        </div>-->
        <!--begin::Menu separator-->
        <!--        <div class="separator mt-2 opacity-75" v-if="defaultConfig.filterForm.formInstance"></div>-->
        <!--end::Menu separator-->
        <template v-for="header in Object.keys(headerVisibility)" :key="header">
          <FieldComponent
              v-model="headerVisibility[header]"
              :name="header"
              :placeholder="defaultConfig.onTHeadProps(header).header"
              field_type="checkbox"/>
        </template>
      </DropdownV2>
    </template>
    <template v-if="$slots.toolbar0" v-slot:toolbar0>
      <slot name="toolbar0"/>
    </template>
    <template v-if="$slots.toolbar1" v-slot:toolbar1>
      <slot name="toolbar1"/>
    </template>
    <template v-if="$slots.toolbar2" v-slot:toolbar2>
      <slot name="toolbar2"/>
    </template>
    <template v-slot:card-body>
      <spinner :loading="defaultConfig.isLoading.value">
        <div class="card-body m-0 p-0">
          <!--begin::Table container-->
          <div class="table-responsive">
            <!--begin::Table-->
            <table ref="tableRef" class="table table-bordered align-middle gs-4 gy-4 table-hover table table-v2-custom">
              <!--begin::Table head-->
              <thead>
              <tr class="fw-bolder text-muted bg-light text-center" ref="headersRef">
                <th style="width: 70px" v-if="defaultConfig.checkAble" class="check-stuff">
                  <FieldComponent
                      v-model="checkAll"
                      col_class=""
                      input_container_class="test"
                      default-input-classes=""
                      :show_errors="false"
                      field_type="checkbox"/>
                </th>
                <template v-if="changedHeaders.length > 0">
                  <template v-for="(header, index) in changedHeaders" :key="header">
                    <component
                        v-if="headerVisibility[header]"
                        moveable="moveable"
                        :header-name="header"
                        class="align-middle pe-2 text-nowrap"
                        :group="defaultConfig.tableName"
                        :is="defaultConfig.onTHeadComponent(header, index)"
                        v-bind="defaultConfig.onTHeadProps(header, index)">
                      <template #extra-part-0>

                        <filter-container
                            @move.prevent.stop @drag.prevent.stop @mousedown.stop
                            v-if="defaultConfig.getFieldByName(header) && headerVisibility[header]"
                            :field="defaultConfig.getFieldByName(header)"/>

                      </template>
                    </component>
                  </template>
                </template>
                <template v-else v-for="(header, index) in headers" :key="header">
                  <component
                      v-if="headerVisibility[header]"
                      moveable="moveable"
                      :header-name="header"
                      class="pe-2 text-nowrap"
                      :group="defaultConfig.tableName"
                      :is="defaultConfig.onTHeadComponent(header, index)"
                      v-bind="defaultConfig.onTHeadProps(header, index)">
                    <template #extra-part-0>
                      <filter-container v-if="defaultConfig.getFieldByName(header) && headerVisibility[header]"
                                        :field="defaultConfig.getFieldByName(header)"/>
                    </template>
                  </component>
                </template>
              </tr>
              </thead>
              <!--end::Table head-->

              <!--begin::Table body-->
              <tbody>
              <tr v-if="defaultConfig.filterForm && filterShow" class="filters-container">
                <td v-for="header in headers" :key="header" class="p-0">
                </td>
              </tr>
              <tr v-if="!dList || dList.length == 0">
                <td :colspan="headers.length + 1" class="text-center">
                  <slot name="empty">
                    داده ای برای نمایش موجود نمی‌باشد
                  </slot>
                </td>
              </tr>
              <template v-else-if="dList.length > 0">
                <template v-for="(item, index) in dList" :key="index">
                  <tr class="text-center"
                      v-bind="defaultConfig.onTBodyRowBinds(item, index)"
                      data-context-menu="true" @contextmenu="contextMenu(item)"
                      @drop.prevent="defaultConfig.context.emit('trDrop', [$event, item, index])" @dragenter.prevent
                      @dragover.prevent
                      @mouseenter="checkCheckFieldData(`check_${item.id}`)"
                      @click="$emit('on-row-selected', item)">
                    <td style="width: 70px" v-if="defaultConfig.checkAble"
                        @mousedown.prevent="checksDragHandler.isMouseDown.value = true"
                        @mouseup.prevent="checksDragHandler.isMouseDown.value = false"
                        @mousemove="checkCheckFieldData(`check_${item.id}`)"
                        @mouseenter="checkCheckFieldData(`check_${item.id}`)"
                        @click="checkedDataList[`check_${item.id}`] = !checkedDataList[`check_${item.id}`]">
                      <FieldComponent
                          v-model="checkedDataList[`check_${item.id}`]"
                          col_class=""
                          input_container_class="test"
                          default-input-classes=""
                          :show_errors="false"
                          field_type="checkbox"/>
                    </td>
                    <template v-for="(header, index) in headers" :key="index">

                      <component
                          v-if="headerVisibility[header]"
                          class="pe-2 text-nowrap"
                          :is="defaultConfig.onTBodyComponent(item, header, index)"
                          v-bind="defaultConfig.onTBodyProps(item, header, index)"
                      />
                    </template>
                  </tr>
                </template>
              </template>
              <!--              <tr v-else-if="noHeaderSelected">-->
              <!--                <td :colspan="headers.length" class="text-center">-->
              <!--                    حداقل یک ستون را برای نمایش انتخاب کنید-->
              <!--                </td>-->
              <!--              </tr>-->
              </tbody>
              <!--end::Table body-->
            </table>
            <!--end::Table-->
          </div>
          <table-pagination
              @page-selected="onPage"
              :current-page="defaultConfig.currentPage"
              :count="defaultConfig.count"/>
          <!--end::Table container-->
        </div>
      </spinner>
    </template>
  </Card>
</template>
<style lang="scss">
@media (max-width: 972px) {
  .table-v2-custom {
    td, th {
      user-select: none;
    }
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

// //these part is used to make filters look better
//$height: 42px;
//.table-v2-custom {
//  .filters-container {
//    td {
//      min-width: 50px;
//      padding: 1px !important;
//      font-size: 13px !important;
//        font-weight: 400 !important;
//
//      input {
//        border-radius: 0;
//        font-size: 13px !important;
//        font-weight: 400 !important;
//        box-shadow: none !important;
//      }
//
//      input[type="text"]  {
//        height: $height !important;
//      }
//      .fv-plugins-message-container {
//        display: none !important;
//      }
//      .select2-container, .select2-selection {
//        border-radius: 0 !important;
//        min-height: $height !important;
//        box-shadow: none !important;
//      }
//      .select2-selection--multiple {
//        min-height: $height !important;
//        box-shadow: none !important;
//      }
//      .fv-row {
//        padding: 0 !important;
//        margin: 0 !important;
//      }
//    }
//  }
//}
</style>
<style lang="scss" scoped>
table {
  th {
    color: black;
    border-left: 1px solid #e9ebf1;
    min-width: 130px;
    padding: 6px !important;

    &.check-stuff:first-child {
      min-width: 50px;
    }

    &:last-child {
      border-left: none;
    }
  }

  td {
    z-index: 1;
    height: 35px;
    //border-left: 1px solid #dddee3;
    border-bottom: 1px solid #dddee3;
    box-shadow: none;
    color: #5e5e5e;

    &:last-child {
      border-left: none;
    }

    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  tbody tr {
    z-index: 1;

    &:hover {
      z-index: 2;
      outline: 3px solid rgba(0, 0, 0, .5);
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
</style>
<script lang="ts">
import {computed, ComputedRef, defineComponent, nextTick, onMounted, ref, toRef, watch} from "vue";
import DropdownV1 from "@/custom/components/DropdownV1.vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import {Table} from "@/custom/components/table/Table";
import TablePagination from "@/custom/components/table/TablePagination.vue";
import Card from "@/custom/components/Card.vue";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import Spinner from "@/custom/components/Spinner.vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import {DragHandler, SimpleDrag} from "@/custom/components/table/TableDrag";
import {UserPreferencesTableApi} from "@/custom/services/UserPreferencesTableApi";
import DropdownV2 from "@/custom/components/DropdownV2.vue";
import {MenuComponent, ToggleComponent} from "@/assets/ts/components";
import {del} from "object-path";
import FilterContainer from "@/custom/components/table/header/filters/FilterContainer.vue";

export default defineComponent({
  components: {
    FilterContainer,
    DropdownV2,
    FieldComponent,
    Spinner,
    Card,
    TablePagination,
    TableTD,
    DropdownV1
  },
  props: {
    url: {
      default: () => {
        return '';
      },
    },
    conf: {
      default: () => {
        return Table
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
      default: false,
    },
    userPreferences: {
      default: false,
    },
    disableDropdown: {
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
    }
  },
  setup(props, context) {
    const conf = toRef(props, 'conf');
    const list = toRef(props, 'list');
    const url = toRef(props, 'url');
    const userPreferences = toRef(props, 'userPreferences');

    const headersRef = ref();
    const tableRef = ref();

    const dList = ref(list.value);

    const checkAll = ref(false);
    const changedHeaders = ref<Array<any>>([]);
    const headerVisibility = ref<Record<string, any>>({});

    const checkedDataList = ref<Record<string, boolean>>({});
    const cacheSelected = {};

    watch(checkedDataList, () => {
      Object.keys(checkedDataList.value).forEach((key) => {
        if (checkedDataList.value[key] && !cacheSelected[key]) {
          const currentKeyId = key.split('_')[1];
          const dataIndex = dList.value.findIndex((item) => item['id'] == Number(currentKeyId));
          cacheSelected[key] = dList.value[dataIndex];
        } else if (!checkedDataList.value[key] && cacheSelected[key]) {
          delete cacheSelected[key];
        }
      });
    }, {
      deep: true,
    });

    let drag: SimpleDrag | null = null;

    const checksDragHandler = new DragHandler();

    const initializeConfig = (() => {
      if (!conf.value)
        return new Table(props, context, {
          "onGetData": onGetData
        });
      return new conf.value(props, context, {
        "onGetData": onGetData
      });
    });
    watch(conf, () => {
      defaultConfig = initializeConfig();

      checkAll.value = false;
      changedHeaders.value = [];
      headerVisibility.value = {};
      checkedDataList.value = {};
      Object.keys(Object.assign(cacheSelected)).forEach((e) => {
        delete cacheSelected[e];
      })

      mount();
    }, {
      deep: true
    })

    watch(dList, () => {
      if (dList.value) {
        dList.value.forEach((data: any) => {
          if (checkedDataList.value[`check_${data.id}`] == undefined || checkedDataList.value[`check_${data.id}`] == null)
            checkedDataList.value[`check_${data.id}`] = checkAll.value;
        });
      }
    }, {
      deep: true,
    })

    watch(list, () => {
      dList.value = list.value;
    })

    watch(checkAll, (e) => {
      console.log("checkall", checkedDataList.value)
      Object.keys(checkedDataList.value).forEach((e) => {
        console.log("checkall", e)
        checkedDataList.value[e] = checkAll.value;
      });
    });

    watch(url, () => {
      onGetData();
    });

    const checkedAnyItems = computed(() => {
      let oneIsChecked = false;
      const keys = Object.keys(checkedDataList.value);
      for (let i = 0; i < keys.length; i++) {
        if (!oneIsChecked && checkedDataList.value[keys[i]]) {
          oneIsChecked = true;
          break;
        }
      }

      return oneIsChecked || checkAll.value
    });

    const onGetData = () => {
      return new Promise<void>((resolve) => {
        if (defaultConfig.canUseUrl) {
          defaultConfig.onGetData().then((e) => {
            dList.value = e;
            resolve();
          }, () => resolve());
        }
      });
    }

    let defaultConfig: Table = initializeConfig();

    const headers = computed(() => {
      if (changedHeaders.value.length > 0)
        return changedHeaders.value;
      return defaultConfig.headers(dList.value);
    });

    const onPage = (e) => {
      defaultConfig.currentPage.value = Number(e);
      onGetData();
    }

    const contextMenu = (item) => {
      ContextMenuService.clickData = item;
      ContextMenuService.set(defaultConfig.getContextMenuItems(item));
    }

    const getTableSettings = () => {
      return UserPreferencesTableApi.getTableSettings(defaultConfig.tableName);
    }

    const saveTableSettings = () => {
      UserPreferencesTableApi.setTableSettings(defaultConfig.tableName, {
        headers: headers.value,
        headerVisibility: headerVisibility.value,
      }).then((data) => {
        console.log("getTableSettings", data);
      });
    }

    const dragStuff = () => {
      nextTick(() => {
        setTimeout(() => {
          drag!.findElements();
          drag!.addMouseEvents();
          watch(headerVisibility, () => {
            nextTick(() => {
              drag!.findElements();
              drag!.addMouseEvents();
              if (userPreferences.value)
                saveTableSettings();
            })
          }, {
            deep: true,
          });
        }, 100)
      })
    }

    const mount = () => {
      MenuComponent.reinitialization();
      drag = new SimpleDrag(tableRef.value);
      drag!.exclude_all_clone = '(animation)|(opacity)|(transition)|(position)';
      drag!.exclude_one_clone = '(animation)|(opacity)|(transition)|(position)';
      drag!.onItemDropped = (element) => {
        const l: Array<string> = [];
        console.log(headersRef.value.children.length);
        for (let i = 0; i < headersRef.value.children.length; i++) {
          l.push(headersRef.value.children[i].getAttribute('header-name'));
        }
        changedHeaders.value.splice(0);
        changedHeaders.value.push(...l);
        defaultConfig.defaultHeaders = l;
        setTimeout(() => {
          if (drag) {
            drag.findElements();
            drag.addMouseEvents();
          }
        }, 350)

        onGetData().then(() => {
          if (userPreferences.value)
            saveTableSettings();
        });
      }

      const tableSetup = () => {
        if (Object.keys(headerVisibility.value).length == 0) {
          headers.value.forEach((header) => {
            headerVisibility.value[header] = true;
          })
        }
        if (!url.value || url.value == '') {
          dragStuff();
        } else {
          onGetData().then(() => {
            dragStuff();
          });
        }
      }

      if (userPreferences.value)
        getTableSettings().then(({data}) => {
          if (data.value) {
            const value = JSON.parse(data.value);
            if (value.headers) {
              changedHeaders.value.splice(0)
              changedHeaders.value.push(...value.headers)
            }
            if (value.headerVisibility) {
              headerVisibility.value = value.headerVisibility;
            }
          }
          tableSetup();
        });
      else {
        tableSetup();
      }
    };

    onMounted(mount);

    const noHeaderSelected = computed(() => {
      const keys = Object.keys(headerVisibility.value);
      for (let i = 0; i < keys.length; i++) {
        if (headerVisibility.value[i]) {
          return false;
        }
      }
      return true;
    })

    const checkCheckFieldData = (key) => {
      if (checksDragHandler.isMouseDown.value) {
        checkedDataList.value[key] = true;
      }
    }

    const checkedItems = computed(() => {
      const keys: Array<string> = [];
      Object.keys(checkedDataList.value).forEach((key) => {
        if (checkedDataList.value[key])
          keys.push(key);
      });
      return keys;
    });


    return {
      checksDragHandler,

      // data
      dList,
      checkAll,
      checkedDataList,
      defaultConfig,
      changedHeaders,
      headerVisibility,
      cacheSelected,

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
    };
  },
});
</script>
