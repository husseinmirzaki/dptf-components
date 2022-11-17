<style lang="scss" src="./MapComponent.scss" />
<script lang="ts">
import "leaflet/dist/leaflet.css";
import { defineComponent, h, onMounted, ref, toRef, watch } from "vue";
import { LControlScale, LMap, LMarker } from "@vue-leaflet/vue-leaflet";
import MapLatLngHolder from "@/custom/map/MapLatLngHolder.vue";
import { ContextMenuService } from "@/custom/components/ContextMenuService";
import MapTools from "@/custom/map/MapTools.vue";
import MapStateHolder from "@/custom/map/MapStateHolder.vue";
import { buildLayers, mapLayers } from "@/custom/map/MapLayers";
import MapLayerChangerButton from "@/custom/map/MapLayerChangerButton.vue";
import MapWindows from "@/custom/map/MapWindows.vue";
import MapExtensions from "@/custom/map/MapExtensions.vue";
import { buildEmitter } from "@/custom/map/utils/emitter";
import { CustomLayerItems } from "@/custom/map/utils/CustomLayerItems";

class PluginManager {
  plugins: any = {};

  register(key, e) {
    this.plugins[key] = e;
  }

  unRegister(key) {
    delete this.plugins[key];
  }

  get(key) {
    return this.plugins[key].component;
  }

  getRaw(key) {
    return this.plugins[key];
  }

  getMain() {
    return this.plugins["LMap"].component.parent;
  }
}

export default defineComponent({
  props: {
    readOnly: {
      default: false,
    },
    showXY: {
      default: true,
    },
    maxZoom: {
      default: 18,
    },
    minZoom: {
      default: 5,
    },
    zoom: {
      default: 8,
    },
    showState: {
      default: true,
    },
    showLayers: {
      default: true,
    },
    state: {
      default: "یکی از ابزارها را استفاده کنید",
    },
    mapXY: {
      default: [35.632744348010625, 51.43146514892579],
    },
    boundary: {
      default: () => ({}),
    },
    defaultActiveState: String,
  },
  setup(props, context) {
    const mapRef = ref();
    const mapToolsRef = ref();
    const mapWindowsRef = ref();
    const mapExtensionsRef = ref();
    const state = toRef(props, "state");
    const innerState = ref(state.value);
    const activeState = ref(props.defaultActiveState);
    const satellite = ref(false);
    const mapCenter = ref(props.mapXY);
    const activeWindow = ref();

    const plugins = new PluginManager();

    const tileProviders = ref(mapLayers);
    const { emitTo, emitsTo } = buildEmitter();

    watch(state, (e) => {
      innerState.value = e;
    });

    watch(activeWindow, (e) => {
      if (e) activeState.value = innerState.value;
      else activeState.value = undefined;
    });

    const onMapReady = (e) => {
      context.emit("mapReady", e);
      emitTo("mapReady", null);
      console.log("map cords", mapCenter.value);
      // e.setView(mapCenter.value)
    };

    const onClick = (value) => {
      emitTo("click", value);
    };

    const onMousemove = (value) => {
      emitTo("mousemove", value);
    };

    const setProperty = (key, value) => {
      switch (key) {
        case "activeWindow":
          activeWindow.value = value;
          break;
      }
    };

    const onUpdateCenter = (value) => {
      if (value) {
        mapCenter.value = [value.lat, value.lng];
        context.emit("update:center", mapCenter.value);
      }
    };

    const onContextmenu = (event) => {
      if (event.originalEvent) {
        if (!event.originalEvent._alreadyFilled)
          ContextMenuService.set([
            {
              text: "test",
              onClick: () => {
                //
              },
            },
          ]);
      }
    };

    const onUpdateState = (_state: string) => {
      if (_state == "") {
        innerState.value = state.value;
      } else {
        innerState.value = _state;
      }
    };

    const mapRefs = {
      mapRef,
      mapToolsRef,
      mapExtensionsRef,
      emitsTo,
    };
    const slotLayers = context.slots.default?.() ?? ([] as Array<any>);
    const customLayers: CustomLayerItems = new CustomLayerItems();
    const outerLayers: any = [];

    for (let i = 0; i < slotLayers.length; i++) {
      if (!slotLayers[i] || !slotLayers[i]["type"] || !slotLayers[i]["name"]) {
        continue;
      }

      if (!slotLayers[i]["props"]) {
        slotLayers[i]["props"] = {};
      }

      slotLayers[i]["props"]["mapInstance"] = mapRefs;

      customLayers.add(slotLayers[i]);
    }

    onMounted(() => {
      if (!props.readOnly) return;
      const interval = setInterval(() => {
        if (mapRef.value.leafletObject.zoomControl) {
          clearInterval(interval);
          mapRef.value.leafletObject.zoomControl.remove();
          mapRef.value.leafletObject.doubleClickZoom.disable();
          mapRef.value.leafletObject.dragging.disable();
          mapRef.value.leafletObject.touchZoom.disable();
          mapRef.value.leafletObject.scrollWheelZoom.disable();
        }
      }, 100);
    });

    return {
      // functions
      onMapReady,
      onClick,
      onMousemove,
      onUpdateCenter,
      onContextmenu,
      onUpdateState,
      setProperty,

      // refs
      emitsTo,
      mapRef,
      mapToolsRef,
      mapWindowsRef,
      mapExtensionsRef,

      // data
      plugins,
      activeWindow,
      customLayers,
      outerLayers,
      mapCenter,
      activeState,
      innerState,
      tileProviders,
      satellite,
    };
  },
  render() {
    const map = h(
      LMap,
      {
        ref: "mapRef",
        options: {
          attributionControl: false,
        },
        style: "width: 100%;height: 700px;",
        maxZoom: this.maxZoom,
        minZoom: this.readOnly ? 15 : this.minZoom,
        zoom: this.zoom,
        class: ["map-component-custom-class"],
        center: this.mapCenter,
        onReady: this.onMapReady,
        onClick: this.onClick,
        onMousemove: this.onMousemove,
        "onUpdate:center": this.onUpdateCenter,
        onContextmenu: this.onContextmenu,
        // this will let us show a context menu
        // by filling ContextMenuService
        "data-context-menu": "true",
      },
      () => {
        const layers: any = [];

        if (this.$slots.default) {
          layers.push(
            ...this.$slots.default!().filter((slot) => {
              return (
                slot && slot["type"] != null && slot["type"]["name"] != null
              );
            })
          );
        }

        if (this.readOnly) {
          layers.push(
            h(LMarker, {
              latLng: this.mapCenter,
            })
          );
        }

        this.tileProviders.forEach((tileProvider) => {
          buildLayers(layers, tileProvider, this.satellite);
        });

        // whether show lng and lat on top right
        // of map
        if (this.showXY && !this.readOnly) {
          const vNode = h(MapLatLngHolder, { xy: this.mapCenter });
          this.plugins.register("MapLatLngHolder", vNode);
          layers.push(vNode);
        }

        /**
         * shows a simple description of what is happening now
         */
        if (this.showState && !this.readOnly) {
          const vNode = h(MapStateHolder, {
            state: this.activeState ? this.activeState : this.innerState,
          });
          this.plugins.register("MapStateHolder", vNode);
          layers.push(vNode);
        }

        /**
         * show the button to change layer from street
         * to satellite
         */
        if (this.showLayers && !this.readOnly) {
          const vNode = h(MapLayerChangerButton, {
            modelValue: this.satellite,
            "onUpdate:modelValue": (v) => (this.satellite = v),
          });
          this.plugins.register("MapLayerChangerButton", vNode);
          layers.push(vNode);
        }

        // shows the map scale
        layers.push(h(LControlScale, { imperial: false }));

        // a bar on left which holds buttons which
        // are responsible for drawing and using
        // map to do specific things
        if (this.customLayers.hasMapToolsButton && !this.readOnly) {
          const vNode = h(
            MapTools,
            {
              ref: "mapToolsRef",
              parent: this,
              modelValue: this.activeWindow,
              "onUpdate:modelValue": (value) => (this.activeWindow = value),
              "onUpdate:state": this.onUpdateState,
            },
            {
              default: () => this.customLayers.mapToolsButton,
            }
          );
          this.plugins.register("MapTools", vNode);
          layers.push(vNode);
        }

        if (this.customLayers.hasMapToolWindow && !this.readOnly) {
          const vNode = h(
            MapWindows,
            {
              ref: "mapWindowsRef",
              parent: this,
            },
            {
              default: () =>
                this.customLayers.mapToolWindow.filter(
                  (item) => item.props["activation-key"] === this.activeWindow
                ),
            }
          );
          this.plugins.register("MapWindows", vNode);
          layers.push(vNode);
        }

        if (this.customLayers.hasMapExtensions && !this.readOnly) {
          layers.push(
            h(
              MapExtensions,
              {
                ref: "mapExtensionsRef",
                parent: this,
              },
              {
                default: () => this.customLayers.mapExtensions,
              }
            )
          );
        }

        return layers;
      }
    );

    this.plugins.register("LMap", map);
    return map;
  },
});
</script>
<style>
.leaflet-pane.leaflet-tooltip-pane {
  direction: ltr;
}
</style>
