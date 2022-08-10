<script lang="ts">
import {defineComponent, h, Ref, ref} from "vue";
import {LMap, LTileLayer, LControl, LControlScale} from "@vue-leaflet/vue-leaflet"
import MapLine from "@/custom/map/MapLine.vue";
import {buildEmitter} from "@/custom/map/utils/emitter";

interface LineInfo {
  strokeColor: string;
  innerColor?: string;
  lines: Array<Array<number>>;
}

export default defineComponent({
  name: "MapExtensionLineDrawer",
  setup() {
    const {emitTo, emitsTo} = buildEmitter();
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

    return {
      emitTo, emitsTo, lines
    }
  },
  render() {
    return h('div', Object.keys(this.lines).map((e) => {
      const line = this.lines[e];
      return h(MapLine, {
        strokeColor: line['strokeColor'], lines: line.lines, onEdit: () => {
          this.emitTo('edit-line', [e, line]);
        }
      });
    }));
  }
});
</script>