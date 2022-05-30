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
            <button @click="filterShow = !filterShow" v-if="defaultConfig.filterForm" class="btn btn-sm btn-primary btn-icon">
        <i class="fas fa-filter"></i>
      </button>
                  <button @click="defaultConfig.filterForm.formInstance.resetForm()" v-if="defaultConfig.filterForm" class="btn btn-sm btn-primary btn-icon">
        <i class="fas fa-undo"></i>
      </button>
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
              <tr class="fw-bolder text-muted bg-light text-center">
                <template v-for="(header, index) in headers" :key="index">
                  <component
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
                   <field-builder v-if="defaultConfig.getFieldByName(header)" :field="defaultConfig.getFieldByName(header)"/>
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

<script lang="ts">
import {computed, ComputedRef, defineComponent, onMounted, ref, toRef, watch} from "vue";
import DropdownV1 from "@/custom/components/DropdownV1.vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import {Table} from "@/custom/components/table/Table";
import TablePagination from "@/custom/components/table/TablePagination.vue";
import Card from "@/custom/components/Card.vue";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import Spinner from "@/custom/components/Spinner.vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import FieldBuilder from "@/custom/components/FieldBuilder.vue";

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
    const conf = toRef(props, 'conf');
    const list = toRef(props, 'list');
    const url = toRef(props, 'url');
    const dList = ref(list.value);

    watch(list, () => {
      dList.value = list.value;
    })

    const onGetData = () => {
      if (defaultConfig.value.canUseUrl) {
        defaultConfig.value.onGetData().then((e) => {
          dList.value = e;
        });
      }
    }

    const defaultConfig: ComputedRef<Table> = computed(() => {
      if (!conf.value)
        return new Table(props, context, {
          "onGetData": onGetData
        });
      return new conf.value(props, context, {
        "onGetData": onGetData
      });
    });

    const headers = computed(() => {
      return defaultConfig.value.headers(dList.value);
    });

    const onPage = (e) => {
      defaultConfig.value.currentPage.value = Number(e);
      onGetData();
    }

    const contextMenu = (item) => {
      ContextMenuService.clickData = item;
      ContextMenuService.set(defaultConfig.value.getContextMenuItems());
    }

    onMounted(() => {
      onGetData();
    });

    watch(url, () => {
      onGetData();
    });

    return {
      dList,
      defaultConfig,
      headers,
      onPage,
      contextMenu,
      refresh: onGetData,
    };
  },
});
</script>
