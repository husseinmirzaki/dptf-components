<style lang="scss">
.custom-input-class {
  &:focus {
    box-shadow: 0 0 3px red !important;
  }
}
</style>
<template>
  <MapToolsWindow card-title="اضافه / ویرایش خط">
    <template #toolbar1>
      <div
          class="btn btn-sm p-1 btn-primary me-1"
          data-bs-dismiss="modal"
          @click="addPoint(true)"
      >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen041.svg"/>
            </span>
        <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/arrows/arr067.svg"/>
            </span>
      </div>
      <div
          class="btn btn-sm p-1 btn-primary me-1"
          data-bs-dismiss="modal"
          @click="addPoint(false)"
      >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen041.svg"/>
            </span>
        <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/arrows/arr068.svg"/>
            </span>
      </div>
    </template>
    <template #card-content>
      {{ orderedList.listOfData }}
      <template v-for="(index, data) in computedOrderKeys" :key="data">
        <FieldComponent
            :input_class="`custom-input-class custom-index-class-${index}`"
            :model-value="orderedList.get(data)"
            @update:modelValue="updateListData(index, $event)"
            @focusin="emitTo('focusin', [index, data])"
            placeholder="مختصات مثال :  100,100"
            :data-index="index"
        />
      </template>
    </template>
  </MapToolsWindow>
</template>
<script lang="ts">
import MapToolsWindow from "@/custom/map/MapToolsWindow.vue";
import {computed, defineComponent, nextTick, onMounted, onUnmounted, ref, toRef, watch} from "vue";
import {OrderedList} from "@/views/province/utils";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import {VueInstanceService} from "@/Defaults";
import {buildEmitter} from "@/custom/map/utils/emitter";

export const MODE_DEFAULT = -1;
export const MODE_CREATE_NEW = 1;
export const MODE_ADD_POINT = 2;
export const MODE_SELECT_ITEM = 3;
export default defineComponent({
  inheritAttrs: true,
  name: "MapToolsWindowLine",
  props: {
    mapInstance: {
      default: () => ({} as any),
    },
    plugins: {
      type: Object
    }
  },
  components: {FieldComponent, MapToolsWindow},
  setup(props, context) {
    const {emitTo, emitsTo} = buildEmitter();

    const refs = toRef(props, 'mapInstance');
    const mapRef = refs.value.mapRef;
    const mapExtensions = refs.value.mapExtensionsRef;
    const extensions = mapExtensions.value.extensions;

    const orderedList = new OrderedList();


    const updateListData = (index, data) => {
      try {
        const s = data.split(',');
        if (s.length < 2 || s.length > 2) {
          VueInstanceService.showErrorMessage("مختصات اشتباه وارد شده", null, 4000, "top-right")
          return;
        }
        const numbers = [Number(s[0]), Number(s[1])];
        emitTo('update', [index, numbers]);
      } catch (e) {
        VueInstanceService.showErrorMessage("مختصات اشتباه وارد شده", null, 4000, "top-right")
      }
    }

    const mode = ref(MODE_DEFAULT);

    const onParentEvent = (name: any, event: any) => {
      switch (name) {
        case 'click':
          onMapClicked(event);
          break;
      }
    }

    const onMapExtensionLineDrawer = (name: any, event: any) => {
      switch (name) {
        case 'edit-line':
          console.log('on line edit', event);
          break;
      }
    }

    onMounted(() => {
      // add event listener on map compone`nt
      refs.value.emitsTo['MapToolsWindowLine'] = onParentEvent;
      if (props.plugins)
        props.plugins.get('MapExtensionLineDrawer').proxy.emitsTo['MapToolsWindowLine'] = onMapExtensionLineDrawer
    });

    onUnmounted(() => {
      if (props.plugins)
        delete props.plugins.get('MapExtensionLineDrawer').proxy.emitsTo['MapToolsWindowLine']
    })

    const onMapClicked = (e) => {
      if (mode.value != MODE_DEFAULT)
        console.log(mapRef.value);
    }

    const addPoint = (top = true) => {
      if (top) {
        orderedList.addToTop('');
      } else {
        orderedList.addToBottom('');
      }
      emitTo('updateData', [orderedList.orderedList()]);
    }

    const computedOrderKeys = orderedList.computedOrderKeys();

    watch(computedOrderKeys, () => {
      console.log(computedOrderKeys.value);
    });

    onUnmounted(() => {
      props.plugins?.unRegister('MapToolsWindowLine');
    })

    return {
      // data
      mode,
      orderedList,
      emitsTo,

      //computed
      computedOrderKeys,
      // functions
      emitTo,
      updateListData,
      addPoint,

      // consts
      MODE_DEFAULT,
      MODE_CREATE_NEW,
      MODE_ADD_POINT,
      MODE_SELECT_ITEM,
    }
  }
});
</script>