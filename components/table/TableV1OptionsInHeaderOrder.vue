<template>
  <div class="table-v1-order-v2" ref="refOrderV2Container">
    <div class="input-filter">
      <FieldComponent
          placeholder="نام فیلد"
          input_class="form-control-sm"
          col_class="w-100"
          v-model="dVisibleItemsOrder"
      />
      <!--        <Button class="btn btn-primary mt-1 mx-1 btn-sm btn-icon" ref="refExportButton" @click="toggleExportButton">-->
      <!--          <inline-svg src="media/icons/light/file-arrow-down.svg" width="15px" height="15px"/>-->
      <!--        </Button>-->
    </div>
    <div class="items">
      <div class="item"
           v-for="header in headers" :key="header.name">
        <div class="anchor">
          <inline-svg src="media/icons/light/grip-dots-vertical.svg"/>
        </div>
        <div class="text">
          {{ header.title }}
        </div>
        <div class="check">
          <FieldComponent
              field_type="checkbox"
              col_class=""
              :name="header.name"
              v-model="headerVisibility[header.name]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref, toRef, watch} from "vue";
import Sortable from "sortablejs";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import {Table} from "@/custom/components/table/Table";

export default defineComponent({
  components: {FieldComponent},
  emits: ["state"],
  props: {
    defaultConfig: {
      type: Object as PropType<Table>,
      required: true
    },
    animationDuration: {
      default: 180,
    }
  },
  setup(props) {
    const defaultConfig = toRef(props, "defaultConfig");
    const headersOrder = [];
    const headerVisibility = reactive({});
    watch(headerVisibility, (e) => {
      defaultConfig.value.setVisibleHeaders(e);
    });
    const headers = defaultConfig.value.headers([]).map((item, index) => {
      const defaults = defaultConfig.value.onTHeadProps(item, index);
      headerVisibility[item] = !(defaultConfig.value.headerVisibility[item] === false);

      return {
        title: defaults['header'],
        name: item
      };
    });
    console.log(defaultConfig.value);

    /**
     * this holds the timeout number which is responsible
     * for hiding element
     */
    let timeoutClose: any;

    let sortableInstance: Sortable;

    /**
     * this will be used to filter which field user
     * want to see
     */
    const dVisibleItemsOrder = ref('');

    /**
     * a floating container which contains
     * all items and a filter input
     */
    const refOrderV2Container = ref();

    /**
     * opens container
     */
    const openOrderContainer = () => {
      refOrderV2Container.value.classList.add('d-block', 'open');
      const filterContainerItems = refOrderV2Container.value.querySelector('.items');
      sortableInstance = Sortable.create(filterContainerItems, {
        // group: defaultConfig.tableName,
        draggable: ".item",
        handle: ".anchor",
        direction: "vertical",
        animation: 180,
        onUpdate: () => {
          setTimeout(() => {
            const l: Array<string> = [];
            const items = refOrderV2Container.value.querySelectorAll("input[name]");
            for (let i = 0; i < items.length; i++) {
              l.push(items[i].getAttribute("name"));
            }
            defaultConfig.value.setNewOrder(l);
            // changedHeaders.value.splice(0);
            // changedHeaders.value.push(...l);
            // defaultConfig.defaultHeaders = l;
            // saveTableSettings();
          });
        },
      });
      console.log(sortableInstance);

      return refOrderV2Container.value;
    }

    /**
     * closes container
     */
    const closeOrderContainer = () => {
      if (sortableInstance)
        sortableInstance.destroy()
      sortableInstance = null;
      refOrderV2Container.value.classList.remove('open');
      refOrderV2Container.value.classList.add('close-animation');
      timeoutClose = setTimeout(() => {
        refOrderV2Container.value.classList.remove('d-block', 'close-animation');
      }, props.animationDuration);

      return null;
    }

    const toggle = () => {
      if (refOrderV2Container.value.classList.contains('open'))
        return closeOrderContainer();
      else
        return openOrderContainer();
    }
    return {
      dVisibleItemsOrder,
      refOrderV2Container,
      headerVisibility,
      headers,
      toggle
    };
  }
});
</script>