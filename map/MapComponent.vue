<style lang="scss" src="./MapComponent.scss"/>
<script lang="ts">
import {defineComponent, h, ref, toRef, watch} from "vue";
import {LControlScale, LMap} from "@vue-leaflet/vue-leaflet"
import MapLatLngHolder from "@/custom/map/MapLatLngHolder.vue";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import MapTools from "@/custom/map/MapTools.vue";
import MapStateHolder from "@/custom/map/MapStateHolder.vue";
import {buildLayers, mapLayers} from "@/custom/map/MapLayers";
import MapLayerChangerButton from "@/custom/map/MapLayerChangerButton.vue";
import MapWindows from "@/custom/map/MapWindows.vue";
import MapExtensions from "@/custom/map/MapExtensions.vue";
import {buildEmitter} from "@/custom/map/utils/emitter";
import {CustomLayerItems} from "@/custom/map/utils/CustomLayerItems";

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
      default: "یکی از ابزارها را استفاده کنید",
    },
    mapXY: {
      default: [35.632744348010625, 51.43146514892579]
    },
  },
  setup(props, context) {
    const mapRef = ref();
    const mapToolsRef = ref();
    const mapWindowsRef = ref();
    const mapExtensionsRef = ref();
    const state = toRef(props, 'state');
    const innerState = ref(state.value);
    const activeState = ref();
    const satellite = ref(false);
    const mapCenter = ref(props.mapXY);
    const activeWindow = ref();

    const tileProviders = ref(mapLayers);
    const {emitTo, emitsTo} = buildEmitter();

    watch(state, (e) => {
      innerState.value = e;
    });

    watch(activeWindow, (e) => {
      if (e)
        activeState.value = innerState.value;
      else
        activeState.value = undefined;
    });

    const onMapReady = () => {
      context.emit('mapReady')
      emitTo('mapReady', null);
    }

    const onClick = (value) => {
      emitTo('click', value);
    }

    const setProperty = (key, value) => {
      switch (key) {
        case "activeWindow":
          activeWindow.value = value;
          break
      }
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

    const onUpdateState = (_state: string) => {
      if (_state == '') {
        innerState.value = state.value;
      } else {
        innerState.value = _state;
      }
    }

    const mapRefs = {
      mapRef,
      mapToolsRef,
      mapExtensionsRef,
      emitsTo
    };
    const slotLayers = context.slots.default?.() ?? [] as Array<any>;
    const customLayers: CustomLayerItems = new CustomLayerItems();
    for (let i = 0; i < slotLayers.length; i++) {
      if (!slotLayers[i]['props']) {
        slotLayers[i]['props'] = {};
      }
      slotLayers[i]['props']['mapInstance'] = mapRefs;
      customLayers.add(slotLayers[i]);
    }

    return {
      // functions
      onMapReady,
      onClick,
      onUpdateCenter,
      onContextmenu,
      onUpdateState,
      setProperty,

      // refs
      mapRef,
      mapToolsRef,
      mapWindowsRef,
      mapExtensionsRef,

      // data
      activeWindow,
      customLayers,
      mapCenter,
      activeState,
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
      layers.push(h(MapStateHolder, {state: this.activeState ? this.activeState : this.innerState}))
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
        ref: 'mapToolsRef',
        modelValue: this.activeWindow,
        'onUpdate:modelValue': (value) => this.activeWindow = value,
        'onUpdate:state': this.onUpdateState,
      }, this.customLayers.mapToolsButton));
    }

    if (this.customLayers.hasMapToolWindow) {
      layers.push(
          h(
              MapWindows,
              {ref: 'mapWindowsRef'},
              this.customLayers.mapToolWindow.filter((item) => item.props['activation-key'] === this.activeWindow)
          )
      );
    }

    if (this.customLayers.hasMapExtensions) {
      layers.push(
          h(
              MapExtensions, {
                ref: 'mapExtensionsRef',
                parent: this,
              },
              this.customLayers.mapExtensions,
          )
      );
    }

    const map = h(LMap, {
      ref: 'mapRef',
      options: {
        attributionControl: false,
      },
      style: "width: 100%;height: 800px;",
      maxZoom: 19,
      minZoom: 5,
      zoom: 8,
      class: ['map-component-custom-class'],
      center: this.mapCenter,
      onReady: this.onMapReady,
      onClick: this.onClick,
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