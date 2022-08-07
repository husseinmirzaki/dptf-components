<style lang="scss" scoped>
.lat-lng-holder {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 12px;
  user-select: none;
}
</style>
<script lang="ts">
import {defineComponent, h} from "vue";
import {LControl} from "@vue-leaflet/vue-leaflet"

export default defineComponent({
  props: {
    state: {
      default: '',
    },
  },
  render() {
    return h(LControl, {position: 'bottomleft'}, [
          h('div', {
            class: 'lat-lng-holder'
          }, this.state)
        ]
    );
  }
})
</script>