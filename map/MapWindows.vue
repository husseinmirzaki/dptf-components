<script lang="ts">
import {LControl} from "@vue-leaflet/vue-leaflet"
import {defineComponent, h} from "vue";

export default defineComponent({
  inheritAttrs: true,
  name: "MapToolsWindow",
  render() {
    return h(LControl, {position: "topright"}, h('div', {'class': 'w-350px'}, this.$slots.default!()))
  }
})</script>