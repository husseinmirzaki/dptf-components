<template>
  <div class="color-picker-viewer" ref="refColorPickerContainer">
    <ColorPicker dir="ltr" ref="refColorPicker" @color-change="onColorChanged" :color="color"/>
  </div>
</template>
<style lang="scss">
.color-picker-viewer {
  display: none;
  z-index: 99999;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from "vue";
import {ColorPicker} from "vue-accessible-color-picker";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  components: {ColorPicker},
  props: ['scrollableSelector'],
  setup(props) {
    const refColorPickerContainer = ref();
    const refColorPicker = ref();
    const color = ref();
    const onColorChanged = (e) => {
      VueInstanceService.emit("serviceColorPicker.selected", e);
    }

    const globalOnClick = (e) => {
      if (!refColorPickerContainer.value.contains(e.target)) {
        latestSignal = null;
        VueInstanceService.emit("serviceColorPicker.close");
        refColorPickerContainer.value.style.display = 'none';
      }
    }

    let latestSignal: any;
    const openColorPickerSignal = (e) => {
      if (!e && latestSignal) {
        console.log("using latest signal")
        e = latestSignal;
      } else if (e)
        latestSignal = e;
      else
        return;

      color.value = e.selectedColor;
      const bb = e.field.getBoundingClientRect();

      refColorPickerContainer.value.style.top = (bb.top + bb.height) + "px";
      refColorPickerContainer.value.style.left = bb.left + "px";

      refColorPickerContainer.value.style.display = 'block';

      const myBb = refColorPickerContainer.value.getBoundingClientRect();

      if (myBb.bottom > screen.availHeight) {
        refColorPickerContainer.value.style.top = (bb.top - myBb.height) + "px";
        refColorPickerContainer.value.style.left = bb.left + "px";
      }
    }

    const globalOnScroll = () => {
      console.log(latestSignal);
      if (latestSignal)
        openColorPickerSignal(null);
    }

    let scrollable: any;
    onMounted(() => {
      VueInstanceService.on('serviceColorPicker.open', openColorPickerSignal);
      window.addEventListener('click', globalOnClick);

      scrollable = document.querySelector(props.scrollableSelector);
      if (scrollable)
        scrollable.addEventListener('scroll', globalOnScroll);
    });

    onUnmounted(() => {
      VueInstanceService.off('serviceColorPicker.open', openColorPickerSignal);
      window.removeEventListener('click', globalOnClick);
      if (scrollable)
        scrollable.removeEventListener('scroll', globalOnScroll);
    });

    return {
      onColorChanged,
      openColorPickerSignal,
      refColorPickerContainer,
      refColorPicker,
      color,
    }
  }
})
</script>