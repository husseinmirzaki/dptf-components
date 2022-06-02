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
    <template v-if="$slots.dropDown" v-slot:dropDown>
      <slot name="dropDown"/>
    </template>
    <template v-slot:toolbar>
      <div v-if="defaultConfig.filterForm">
        <div v-if="!(defaultConfig.filterForm.labelForm)">
          <button @click="filterShow = !filterShow" class="btn btn-sm btn-primary btn-icon">
            <i class="fas fa-filter"></i>
          </button>
          <button @click="defaultConfig.filterForm.formInstance.resetForm()" class="btn btn-sm btn-primary btn-icon">
            <i class="fas fa-undo"></i>
          </button>
        </div>
      </div>
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
            <table class="table table-bordered align-middle gs-4 gy-4 table-hover table">
              <!--begin::Table head-->
              <thead>
              <tr class="fw-bolder text-muted bg-light text-center" ref="headersRef">
                <template v-if="changedHeaders.length > 0">
                  <template v-for="(header, index) in changedHeaders" :key="header">
                    <component
                        moveable="moveable"
                        :header-name="header"
                        :group="defaultConfig.tableName"
                        :is="defaultConfig.onTHeadComponent(header, index)"
                        v-bind="defaultConfig.onTHeadProps(header, index)"/>
                  </template>
                </template>
                <template v-else v-for="(header, index) in headers" :key="header">
                  <component
                      moveable="moveable"
                      :header-name="header"
                      :group="defaultConfig.tableName"
                      :is="defaultConfig.onTHeadComponent(header, index)"
                      v-bind="defaultConfig.onTHeadProps(header, index)"/>
                </template>
              </tr>
              </thead>
              <!--end::Table head-->

              <!--begin::Table body-->
              <tbody>
              <tr v-if="defaultConfig.filterForm && filterShow">
                <td v-for="header in headers" :key="header">
                  <field-builder v-if="defaultConfig.getFieldByName(header)"
                                 :field="defaultConfig.getFieldByName(header)"/>
                </td>
              </tr>
              <tr v-if="!dList || dList.length == 0">
                <td :colspan="headers.length" class="text-center">
                  <slot name="empty">
                    داده ای برای نمایش موجود نمی‌باشد
                  </slot>
                </td>
              </tr>
              <template v-else>
                <template v-for="(item, index) in dList" :key="index">
                  <tr class="text-center" data-context-menu="true" @contextmenu="contextMenu(item)"
                      @drop.prevent="defaultConfig.context.emit('trDrop', [$event, item, index])" @dragenter.prevent
                      @dragover.prevent
                      @click="$emit('on-row-selected', item)">
                    <template v-for="(header, index) in headers" :key="index">

                      <component
                          class="pe-2"
                          :is="defaultConfig.onTBodyComponent(item, header, index)"
                          v-bind="defaultConfig.onTBodyProps(item, header, index)"
                      />
                    </template>
                  </tr>
                </template>
              </template>
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
import FieldBuilder from "@/custom/components/FieldBuilder.vue";
import {SimpleDrag} from "@/custom/components/table/TableDrag";

export default defineComponent({
  components: {
    FieldBuilder,
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
    const headersRef = ref();
    const conf = toRef(props, 'conf');
    const list = toRef(props, 'list');
    const url = toRef(props, 'url');
    const dList = ref(list.value);
    const changedHeaders = ref<Array<any>>([]);

    let drag: SimpleDrag | null = null;

    watch(list, () => {
      dList.value = list.value;
    })

    const onGetData = () => {
      if (defaultConfig.canUseUrl) {
        defaultConfig.onGetData().then((e) => {
          dList.value = e;
        });
      }
    }

    let defaultConfig: Table = (() => {
      if (!conf.value)
        return new Table(props, context, {
          "onGetData": onGetData
        });
      return new conf.value(props, context, {
        "onGetData": onGetData
      });
    })();

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
      ContextMenuService.set(defaultConfig.getContextMenuItems());
    }

    onMounted(() => {
      onGetData();
      drag = new SimpleDrag();

      drag.addMouseEvents();

      drag.itemDropped = (element) => {
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

        onGetData();
      }
    });

    watch(url, () => {
      onGetData();
    });

    return {
      dList,
      defaultConfig,
      headers,
      headersRef,
      changedHeaders,
      onPage,
      contextMenu,
      refresh: onGetData,
    };
  },
});
</script>
