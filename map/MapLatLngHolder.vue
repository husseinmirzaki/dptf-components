<style lang="scss" scoped>
.lat-lng-holder {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 5px;
  font-size: 12px;
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    cursor: pointer;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.9);
  }
}
</style>
<script lang="ts">
import { defineComponent, h } from 'vue';
import { LControl } from '@vue-leaflet/vue-leaflet';
import { VueInstanceService } from '@/Defaults';

export default defineComponent({
  props: {
    xy: {
      default: () => ({}),
    },
  },
  render() {
    return h(
      LControl,
      {},
      {
        default: () => [
          h(
            'div',
            {
              class: 'lat-lng-holder',
              onClick: (e) => {
                navigator.clipboard.writeText(JSON.stringify(this.xy));
                VueInstanceService.showSuccessMessage('مختصات کپی شد');
              },
            },
            {
              default: () => JSON.stringify(this.xy),
            }
          ),
        ],
      }
    );
  },
});
</script>
