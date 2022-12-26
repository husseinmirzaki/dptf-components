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
           :class="{active: item == 4}"
           v-for="item in 10" :key="item">
        <div class="anchor">
          <inline-svg src="media/icons/light/grip-dots-vertical.svg"/>
        </div>
        <div class="text">
          متنی که باید نمایش داده شود
        </div>
        <div class="check">
          <FieldComponent
              field_type="checkbox"
              col_class=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import Sortable from "sortablejs";

export default defineComponent({
  emits: ["state", "defaultConfig", "actualHeaders"],
  props: {
    animationDuration: {
      default: 180,
    }
  },
  setup(props) {
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
            // const l: Array<string> = [];
            // const items = filtersRef.querySelectorAll("input[name]");
            // for (let i = 0; i < items.length; i++) {
            //   l.push(items[i].getAttribute("name"));
            // }
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
      toggle
    };
  }
});
</script>