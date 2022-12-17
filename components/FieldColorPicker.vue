<template>
  <div class="color-picker z-index-1" ref="refField">
    <div @click="openColorPicker" class="picked-color d-flex align-items-center justify-content-center"
         :style="{backgroundColor: refSelectedColor}">
      <span v-if="refSelectedColor && refSelectedColor.endsWith(',0)')">بدون رنگ</span>
    </div>
  </div>
</template>
<style lang="scss">
.color-picker {
  position: relative;
  height: 43px;
  background-color: white;
  display: flex;
  padding: 10px;
  border-radius: 4px;

  .picked-color {
    width: 100%;
    height: 100%;
    box-shadow: 0 0 4px -1px #000000;
  }
}
</style>
<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref, toRef, watch} from "vue";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  props: ['modelValue', 'name'],
  emits: ['update:modelValue'],
  setup(props, context) {
    const refField = ref();
    const refSelectedColor = ref();
    const modelValue = toRef(props, 'modelValue');
    let iMOpen = false;

    const fixColor = (color) => {
      if (!color || color.trim() == "" || color == "transparent")
        color = "rgba(255,255,255,1)";
      refSelectedColor.value = color;
    }
    const setColor = (color) => {
      fixColor(color);
      context.emit('update:modelValue', refSelectedColor.value);
    };

    const closeAllColorPickers = () => {
      iMOpen = false;
    }

    const openColorPicker = () => {
      if (iMOpen) {
        closeAllColorPickers();
        return
      }
      closeAllColorPickers();
      setTimeout(() => {
        VueInstanceService.emit("serviceColorPicker.open", {
          "field": refField.value,
          "selectedColor": refSelectedColor.value,
        });
        iMOpen = true;
      }, 100)
    };

    watch(modelValue, (e) => {
      fixColor(e);
    });

    const globalCloseSignal = (e) => {
      if (iMOpen)
        closeAllColorPickers();
    };

    const colorChangeListener = (e) => {
      if (iMOpen) {
        refSelectedColor.value = e['cssColor'];
        context.emit('update:modelValue', e['cssColor']);
      }
    };

    onMounted(() => {
      fixColor(modelValue.value);
      VueInstanceService.on("serviceColorPicker.selected", colorChangeListener);
      VueInstanceService.on("serviceColorPicker.close", globalCloseSignal);
    });
    onUnmounted(() => {
      VueInstanceService.off("serviceColorPicker.selected", colorChangeListener);
      VueInstanceService.off("serviceColorPicker.close", globalCloseSignal);
    });

    return {
      refField,
      refSelectedColor,
      setColor,
      openColorPicker,
    }
  }
});
</script>