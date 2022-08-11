<script lang="ts">
import {LControl} from "@vue-leaflet/vue-leaflet"
import {defineComponent, h, onMounted} from "vue";

export default defineComponent({
  inheritAttrs: true,
  name: "MapToolsWindow",
  props: ['parent'],
  render() {


    return h(LControl, {position: "topright"}, h('div', {'class': 'w-350px'}, {
      default: () => {
        const slots = this.$slots.default!();

        slots.forEach((e) => {
          this.$props.parent.plugins.register(e['type']['name'], e);
          if (!e['props']) {
            e['props'] = {};
          }
          e['props']['plugins'] = this.$props.parent.plugins;
        });
        return slots;
      }
    }))
  }
})</script>