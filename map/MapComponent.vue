<script lang="ts">
import {defineComponent, h, onMounted, ref, toRef, watch} from "vue";
import {LMap, LTileLayer, LControl, LControlScale} from "@vue-leaflet/vue-leaflet"
import MapLatLngHolder from "@/custom/map/MapLatLngHolder.vue";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import MapLine from "@/custom/map/MapLine.vue";
import MapTools from "@/custom/map/MapTools.vue";
import MapStateHolder from "@/custom/map/MapStateHolder.vue";
import {buildLayers, mapLayers} from "@/custom/map/MapLayers";
import MapLayerChangerButton from "@/custom/map/MapLayerChangerButton.vue";

export default defineComponent({
  props: {
    showXY: {
      default: true,
    },
    showState: {
      default: true,
    },
    showLayers: {
      default: true,
    },
    state: {
      default: '',
    },
    mapXY: {
      default: [35.632744348010625, 51.43146514892579]
    },
  },
  setup(props, context) {
    const state = toRef(props, 'state');
    const innerState = ref(state.value);
    const satellite = ref(false);

    const tileProviders = ref(mapLayers);

    watch(state, (e) => {
      innerState.value = e;
    });

    return {
      mapCenter: ref(props.mapXY),
      innerState,
      tileProviders,
      satellite,
    }
  },
  render() {
    const layers: any = [];

    this.tileProviders.forEach((tileProvider) => {
      buildLayers(layers, tileProvider, this.satellite);
    });

    if (this.showXY) {
      layers.push(h(MapLatLngHolder, {xy: this.mapCenter}))
    }

    if (this.showState) {
      layers.push(h(MapStateHolder, {state: this.innerState}))
    }

    if (this.showLayers) {
      layers.push(h(MapLayerChangerButton, {
        "modelValue": this.satellite,
        'onUpdate:modelValue': (v) => this.satellite = v
      }));
    }

    layers.push(h(LControlScale, {imperial: false,}));
    layers.push(h(MapTools, {name: 'map-tool-control'}));

    const map = h(LMap, {
      options: {
        attributionControl: false,
      },
      style: "width: 100%;height: 800px;",
      maxZoom: 19,
      minZoom: 5,
      zoom: 8,
      center: this.mapCenter,
      onReady: () => {
        this.$emit('mapReady');
      },
      'onUpdate:center': (value) => {
        if (value) {
          this.mapCenter = [value.lat, value.lng]
          this.$emit('update:center', this.mapCenter);
        }
      },
      onContextmenu: (event) => {
        if (event.originalEvent) {
          if (!event.originalEvent._alreadyFilled)
            ContextMenuService.set([
              {
                text: "test",
                onClick: () => {
                  //
                }
              }
            ])

        }
      },
      'data-context-menu': "true"
    }, layers);

    return map;
  }
});
</script>