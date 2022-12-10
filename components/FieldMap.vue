<template>
  <div class="d-flex flex-column">
    <input
        :readonly="readonly"
        class="form-control mb-2"
        v-model="inputValue"
    />
    <LMap
        v-if="unmount"
        ref="map"
        @click="moveMarkerHere"
        style="width: 100%; height: 500px"
        :options="{
        attributionControl: false,
      }"
        :zoom="17"
        min-zoom="5"
        max-zoom="19"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></LTileLayer>
      <LMarker :lat-lng="marker"/>
    </LMap>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import {LMap, LMarker, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {onBeforeUnmount, onMounted, ref, toRef, watch} from "vue";
import {VueInstanceService} from "@/Defaults";

export default {
  components: {LTileLayer, LMap, LMarker},
  props: {
    name: String,
    readonly: Boolean,
    modelValue: {
      default: "35.688733628305066,51.385374832560466",
      type: String,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const map = ref();
    const modelValue = toRef(props, "modelValue");
    const inputValue = ref("");
    const zoom = ref(17);
    const unmount = ref(false);

    const marker = ref();

    const moveMarkerHere = (e) => {
      if (props.readonly) {
        return;
      }
      if (e.latlng) {
        inputValue.value = `${e.latlng.lat},${e.latlng.lng}`;
        context.emit("update:modelValue", marker.value);
      }
    };

    const tryToCenter = async (s) => {
      let done = 0;
      while (done < 5) {
        if (
            map.value &&
            map.value.leafletObject &&
            map.value.leafletObject.setView &&
            typeof map.value.leafletObject.setView == "function"
        ) {
          map.value.leafletObject.setView([Number(s[0]), Number(s[1])]);
          done++;
        }
        await new Promise((e) => setTimeout(() => e(), 100));
      }
    };

    watch(inputValue, (e) => {
      if (typeof e == 'string') {
        const s = e.split(",")
        if (s.length == 2) {
          const r = /^[+-]?\d+(\.\d+)?$/;
          s[0] = s[0].trim();
          s[1] = s[1].trim();
          if (s[0].search(r) > -1 && s[1].search(r) > -1) {
            marker.value = [Number(s[0]), Number(s[1])];
            tryToCenter(s);

            const location = `${Number(s[0])},${Number(s[1])}`;
            if (location !== modelValue.value)
              context.emit("update:modelValue", location);
          }
        }
      }
    });

    watch(modelValue, () => {
      inputValue.value = modelValue.value;
    });

    onMounted(() => {
      unmount.value = true;
      inputValue.value = modelValue.value;
      tryToCenter(inputValue.value.split(","));
      VueInstanceService.on("opened.bs.modal", () => {
        setTimeout(() => {
          map.value.leafletObject.invalidateSize();
        }, 10);
      });
      context.emit("update:modelValue", inputValue.value);
    });

    onBeforeUnmount(() => {
      unmount.value = false;
    });

    return {
      moveMarkerHere,
      inputValue,
      marker,
      map,
      zoom,
      unmount,
    };
  },
};
</script>
