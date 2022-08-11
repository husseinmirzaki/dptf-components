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
    const dots: Ref<Record<string, any>> = ref({});
    const currentKey = ref();
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

    const drawDots = (lines) => {
      lines.forEach((e: Array<number>, index: number) => {
        const _key = `${e[0]},${e[1]}`;

        const marker = h(LMarker, {
          key: _key,
          latLng: e,
          onClick: async () => {
            await openDefaultWindow(lines);
            const defaultWindows = props.plugins.getRaw('MapToolsWindowLine');
            defaultWindows.el.querySelector(`.custom-index-class-${index}`).focus();
          }
        }, h(LIcon, {
          iconUrl: '/media/icons/duotune/abstract/abs050.svg',
          iconSize: [25, 25]
        }));

        dots.value[_key] = marker;
      })

      // remove non-existing ones
      Object.keys(dots.value).filter((_key) => {
        const s = _key.split(',');
        return lines.findIndex((item) => {
          return item[0] == Number(s[0]) && item[1] == Number(s[1])
        }) == -1;
      }).forEach((_key) => {
        delete dots.value[_key];
      });
    }

    const setLineDataOnWindow = (lines) => {
      const defaultWindows = props.plugins.get('MapToolsWindowLine');
      defaultWindows.proxy.orderedList.setInitial(lines);
      defaultWindows.proxy.emitsTo['MapExtensionLineDrawer'] = onMapToolsWindowEvent();
    }

    const openDefaultWindow = (lines, forceReset = false) => {
      return new Promise<void>((finished) => {
        const mapComponent = props.plugins.getMain();
        if (!mapComponent.proxy.activeWindow) {
          mapComponent.proxy.activeWindow = 'default-windows';
          nextTick(() => {
            setLineDataOnWindow(lines);
            drawDots(lines);
            finished();
          });
        } else {
          if (forceReset) {
            setLineDataOnWindow(lines);
          }
          drawDots(lines);
          finished();
        }
      });
    }

    const onMapToolsWindowEvent = () => {
      return (name, event) => {
        let _index = -1;
        switch (name) {
          case "focusin":
            var line = Object.assign(lines.value[currentKey.value].lines);
            _index = event[0];
            extraLayers.value['marker'] = h(LMarker, {
              draggable: true,
              'onUpdate:latLng': (e) => {
                lines.value[currentKey.value].lines[_index] = [e.lat, e.lng];
                const defaultWindows = props.plugins.get('MapToolsWindowLine');
                defaultWindows.proxy.orderedList.setInitial(line);
                drawDots(line);
              },
              key: `${line[_index][0]}${line[_index][1]}`,
              latLng: line[_index]
            });
            break;
          case "update":
            _index = event[0];

            if (lines.value[currentKey.value].lines[_index] != event[1])
              lines.value[currentKey.value].lines[_index] = event[1];
            drawDots(lines.value[currentKey.value].lines);

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

      return h(MapLine, {
        strokeColor: line['strokeColor'], lines: line.lines, key: sumOfLines(line.lines), onEdit: () => {
          dots.value = {};
          extraLayers.value = {};
          currentKey.value = key;
          openDefaultWindow(line.lines, true);
        }
      });

    }

    const buildLayers = (e) => {
      return extraLayers.value[e];
    }

    const buildDots = (e) => {
      return dots.value[e];
    }

    return {
      // data
      emitsTo,
      lines,
      dots,
      extraLayers,

      // functions
      emitTo,
      buildLine,
      buildDots,
      buildLayers,
    }
  },
  render() {
    return h('div', {}, {
      default: () => {
        return [
          ...Object.keys(this.extraLayers).map(this.buildLayers),
          ...Object.keys(this.lines).map(this.buildLine),
          ...Object.keys(this.dots).map(this.buildDots),
        ];
      }
    });
  }
});
</script>