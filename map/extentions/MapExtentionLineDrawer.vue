<script lang="ts">
import {defineComponent, h, nextTick, onMounted, Ref, ref, watch} from "vue";
import {LMarker, LIcon} from "@vue-leaflet/vue-leaflet"
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

    const openDefaultWindow = (key, lines) => {
      return new Promise<void>((finished) => {
        const mapComponent = props.plugins.getMain();
        if (!mapComponent.proxy.activeWindow) {
          mapComponent.proxy.activeWindow = 'default-windows';
          nextTick(() => {
            const defaultWindows = props.plugins.get('MapToolsWindowLine');
            defaultWindows.proxy.orderedList.setInitial(lines);
            defaultWindows.proxy.emitsTo['MapExtensionLineDrawer'] = onMapToolsWindowEvent(key);
            finished();
          });
        } else {
          finished();
        }
      });
    }

    const onMapToolsWindowEvent = (key) => {
      return (name, event) => {
        let _index = -1;
        switch (name) {
          case "focusin":
            var line = Object.assign(lines.value[key].lines);
            _index = event[0];
            extraLayers.value['marker'] = h(LMarker, {
              draggable: true,
              'onUpdate:latLng': (e) => {
                lines.value[key].lines[_index] = [e.lat, e.lng];
                const defaultWindows = props.plugins.get('MapToolsWindowLine');
                defaultWindows.proxy.orderedList.setInitial(line);
              },
              key: `${line[_index][0]}${line[_index][1]}`,
              latLng: line[_index]
            });
            break;
          case "update":
            _index = event[0];

            if (lines.value[key].lines[_index] != event[1])
              lines.value[key].lines[_index] = event[1];

            break;
        }
      }
    }

    const sumOfLines = (points: Array<Array<number>>) => {
      let sum = '';
      for (let i = 0; i < Math.min(points.length, 5); i++) {
        sum += `${points[i][0]}${points[i][1]}`;
      }
      return sum;
    }

    const buildLine = (key) => {
      const line = Object.assign(lines.value)[key];

      line.lines.forEach((e: Array<number>, index: number) => {
        const _key = `${e[0]},${e[1]}`;
        const layer = extraLayers.value[_key];

        if (layer && layer['key'] == _key) {
          return;
        }
        const icon = h(LIcon, {
          iconUrl: '/media/icons/duotune/abstract/abs050.svg',
          iconSize: [25, 25]
        });

        const marker = h(LMarker, {
          key: _key,
          latLng: e,
          onClick: async () => {
            await openDefaultWindow(key, line.lines);
            const defaultWindows = props.plugins.getRaw('MapToolsWindowLine');
            defaultWindows.el.querySelector(`.custom-index-class-${index}`).focus();
          }
        }, {
          default: () => icon
        });

        extraLayers.value[_key] = marker;
      })

      return h(MapLine, {
        strokeColor: line['strokeColor'], lines: line.lines, key: sumOfLines(line.lines), onEdit: () => {
          openDefaultWindow(key, line.lines);
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
    return h('div', {}, {
      default: () => [
        ...Object.keys(this.lines).map(this.buildLine),
        ...Object.keys(this.extraLayers).map(this.buildLayers),
      ]
    });
  }
});
</script>