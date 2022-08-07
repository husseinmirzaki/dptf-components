<script lang="ts">
import {Component, defineComponent, h, onMounted, ref, toRef, watch} from "vue";
import {LMap, LTileLayer, LControl, LControlScale} from "@vue-leaflet/vue-leaflet"
import MapLatLngHolder from "@/custom/map/MapLatLngHolder.vue";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import MapTools from "@/custom/map/MapTools.vue";
import MapStateHolder from "@/custom/map/MapStateHolder.vue";
import {buildLayers, mapLayers} from "@/custom/map/MapLayers";
import MapLayerChangerButton from "@/custom/map/MapLayerChangerButton.vue";
import MapWindows from "@/custom/map/MapWindows.vue";

class CustomLayerItems {
  mapToolsButton: Array<any> = [];
  mapToolWindow: Array<any> = [];

  get hasMapToolsButton() {
    return this.mapToolsButton.length > 0
  }

  get hasMapToolWindow() {
    return this.mapToolWindow.length > 0
  }

  add(item: Record<"type", Component>) {
    if (!item["type"].name) {
      return;
    }
    const componentName = item["type"].name.toLowerCase();
    console.log(componentName);
    if (componentName.startsWith("maptoolsbutton")) {
      this.mapToolsButton.push(item);
    } else if (componentName.startsWith("maptoolswindow")) {
      this.mapToolWindow.push(item);
    }
  }
}

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
    const mapCenter = ref(props.mapXY);
    const activeWindow = ref();

    const tileProviders = ref(mapLayers);

    watch(state, (e) => {
      innerState.value = e;
    });

    const onMapReady = () => {
      context.emit('mapReady')
    }

    const onUpdateCenter = (value) => {
      if (value) {
        mapCenter.value = [value.lat, value.lng]
        context.emit('update:center', mapCenter.value);
      }
    }

    const onContextmenu = (event) => {
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
    }


    const slotLayers = context.slots.default?.() ?? [] as Array<any>;
    const customLayers: CustomLayerItems = new CustomLayerItems();
    for (let i = 0; i < slotLayers.length; i++) {
      customLayers.add(slotLayers[i]);
    }

    return {
      onMapReady,
      onUpdateCenter,
      onContextmenu,

      activeWindow,
      customLayers,
      mapCenter,
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

    // whether show lng and lat on top right
    // of map
    if (this.showXY) {
      layers.push(h(MapLatLngHolder, {xy: this.mapCenter}))
    }

    /**
     * shows a simple description of what is happening now
     */
    if (this.showState) {
      layers.push(h(MapStateHolder, {state: this.innerState}))
    }

    /**
     * show the button to change layer from street
     * to satellite
     */
    if (this.showLayers) {
      layers.push(h(MapLayerChangerButton, {
        "modelValue": this.satellite,
        'onUpdate:modelValue': (v) => this.satellite = v
      }));
    }

    // shows the map scale
    layers.push(h(LControlScale, {imperial: false,}));

    // a bar on left which holds buttons which
    // are responsible for drawing and using
    // map to do specific things
    if (this.customLayers.hasMapToolsButton) {
      layers.push(h(MapTools, {
        modelValue: this.activeWindow,
        'onUpdate:modelValue': (value) => this.activeWindow = value,
      }, this.customLayers.mapToolsButton));
    }
    if (this.customLayers.hasMapToolWindow) {
      layers.push(
          h(
              MapWindows,
              this.customLayers.mapToolWindow.filter((item) => item.props['activation-key'] === this.activeWindow)
          )
      );
    }

    const map = h(LMap, {
      options: {
        attributionControl: false,
      },
      style: "width: 100%;height: 800px;",
      maxZoom: 19,
      minZoom: 5,
      zoom: 8,
      center: this.mapCenter,
      onReady: this.onMapReady,
      'onUpdate:center': this.onUpdateCenter,
      onContextmenu: this.onContextmenu,
      // this will let us show a context menu
      // by filling ContextMenuService
      'data-context-menu': "true"
    }, layers);

    return map;
  }
});
</script>