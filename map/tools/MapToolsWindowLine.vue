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
      <!--:class="{'btn-primary': mode == MODE_DEFAULT,'btn-secondary': mode != MODE_DEFAULT}"-->
      <!--@click="changeMode"-->
      <div
          class="btn btn-sm btn-icon btn-primary"
          data-bs-dismiss="modal"
          @click="addPoint"
      >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/general/gen041.svg"/>
            </span>
      </div>
    </template>
    <template #card-content>
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
import {computed, defineComponent, nextTick, onMounted, onUnmounted, ref, toRef} from "vue";
import {OrderedList} from "@/views/province/utils";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import {VueInstanceService} from "@/Defaults";
import {buildEmitter} from "@/custom/map/utils/emitter";

const MODE_DEFAULT = -1;
const MODE_ADD_POINT = 0;
const MODE_SELECT_ITEM = 1;
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
    const refs = toRef(props, 'mapInstance');
    const mapRef = refs.value.mapRef;
    const mapExtensions = refs.value.mapExtensionsRef;
    const extensions = mapExtensions.value.extensions;
    const orderedList = new OrderedList();

    const {emitTo, emitsTo} = buildEmitter();

    const focusIn = () => {
      //
    }

    const focusOut = () => {
      //
    }

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
      extensions.get('MapExtensionLineDrawer').emitsTo['MapToolsWindowLine'] = onMapExtensionLineDrawer
    });

    onUnmounted(() => {
      delete extensions.get('MapExtensionLineDrawer').emitsTo['MapToolsWindowLine']
    })

    const onMapClicked = (e) => {
      if (mode.value != MODE_DEFAULT)
        console.log(mapRef.value);
    }

    const utils = {
      addingPoints: () => {
        orderedList.addToTop('')
        // mapRef.value.$el.classList.add('adding-points');
      },
      notAddingPoints: () => {
        // mapRef.value.$el.classList.remove('adding-points');
      }
    };

    const addPoint = () => {
      orderedList.addToTop('');
    }

    const changeMode = () => {

      switch (mode.value) {
        case MODE_ADD_POINT:
          utils.notAddingPoints();
          mode.value = MODE_DEFAULT;
          break;
        case MODE_DEFAULT:
          utils.addingPoints();
          mode.value = MODE_ADD_POINT;
          break;
      }

    }

    return {
      // data
      mode,
      orderedList,
      emitsTo,

      //computed
      computedOrderKeys: orderedList.computedOrderKeys(),
      // functions
      emitTo,
      focusIn,
      focusOut,
      updateListData,
      changeMode,
      addPoint,

      // consts
      MODE_DEFAULT,
      MODE_ADD_POINT,
      MODE_SELECT_ITEM,
    }
  }
});
</script>