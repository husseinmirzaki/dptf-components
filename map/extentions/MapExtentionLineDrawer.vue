<script lang="ts">
import {defineComponent, h, nextTick, onMounted, Ref, ref} from "vue";
import {LMarker} from "@vue-leaflet/vue-leaflet"
import MapLine from "@/custom/map/MapLine.vue";
import {buildEmitter} from "@/custom/map/utils/emitter";

interface LineInfo {
  strokeColor: string;
  innerColor?: string;
  lines: Array<Array<number>>;
}

export default defineComponent({
  name: "MapExtensionLineDrawer",
  props: {
    plugins: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {emitTo, emitsTo} = buildEmitter();

    const extraLayers: Ref<Record<string, any>> = ref({});
    /**
     * hold a set of unique lines which are shown
     * to user
     */
    const lines: Ref<Record<string, LineInfo>> = ref({
      "line-1": {
        strokeColor: "#000",
        lines: [
          [35.632744348010625, 51.43146514892579],
          [35.55010533588552, 51.22650146484375],
          [35.18278813800229, 50.86395263671875],
        ],
      },
      "line-2": {
        strokeColor: "#000",
        lines: [
          [35.632744348010625, 51.43146514892579],
          [35.55010533588552, 51.22650146484375],
          [35.18278813800229, 50.96395263671875],
        ],
      },
    });

    const onMapToolsWindowEvent = (key) => {
      return (name, event) => {
        let index = -1;
        switch (name) {
          case "focusin":
            index = event[0];
            extraLayers.value['marker'] = h(LMarker, {
              draggable: true,
              'onUpdate:latLng': (e) => {
                lines.value[key].lines[index] = [e.lat, e.lng];
              },
              key: lines.value[key].lines[index][0] + lines.value[key].lines[index][1],
              latLng: lines.value[key].lines[index]
            });
            break;
          case "update":
            index = event[0];
            lines.value[key].lines[index] = event[1];
            break;
        }
      }
    }

    const sumOfLines = (points: Array<Array<number>>) => {
      let sum = 0;
      for (let i = 0; i < points.length; i++) {
        sum += points[i][0] + points[i][1];
      }
      return sum;
    }

    const buildLine = (e) => {
      const line = lines.value[e];
      console.log("MapExtension", sumOfLines(line.lines as any))
      return h(MapLine, {
        strokeColor: line['strokeColor'], lines: line.lines, key: sumOfLines(line.lines), onEdit: () => {
          const mapComponent = props.plugins.getMain();
          if (!mapComponent.proxy.activeWindow) {
            mapComponent.proxy.activeWindow = 'default-windows';
            nextTick(() => {
              const defaultWindows = props.plugins.get('MapToolsWindowLine');
              defaultWindows.proxy.orderedList.setInitial(line.lines);
              defaultWindows.proxy.emitsTo['MapExtensionLineDrawer'] = onMapToolsWindowEvent(e);
            });
          }

        }
      });

    }
    const buildLayers = (e) => {
      const layer = extraLayers.value[e];

      return layer;
    }
    return {
      // data
      emitsTo,
      lines,
      extraLayers,

      // functions
      emitTo,
      buildLine,
      buildLayers,
    }
  },
  render() {
    return h('div', [
      ...Object.keys(this.lines).map(this.buildLine),
      ...Object.keys(this.extraLayers).map(this.buildLayers),
    ]);
  }
});
</script>