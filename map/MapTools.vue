<script lang="ts">
import {computed, defineComponent, h, onMounted, Ref, ref, toRef, watch, withModifiers} from "vue";
import {VueInstanceService} from "@/Defaults";
import MapToolsButton from "@/custom/map/MapToolsButton.vue";
import {LControl} from "@vue-leaflet/vue-leaflet"

export class AMapToolsButton {
  help: string;
  iconUrl: string;

  constructor(help, iconUrl) {
    this.help = help;
    this.iconUrl = iconUrl;
  }
}

export default defineComponent({
  props: {
    modelValue: {
      type: String
    }
  },
  setup(props, context) {
    const modelValue = toRef(props, 'modelValue');
    const activeItem = ref(props.modelValue);

    watch(modelValue, (e) => {
      activeItem.value = e;
    })

    /**
     * must contain all slots we should have
     */
    const slots = context.slots.default?.() ?? [] as Array<any>;

    for (let i = 0; i < slots.length; i++) {
      const windowActivationKey = slots[i].props['window-activation-key'];
      if (slots[i].props['window-activation-key']) {
        slots[i].props['onUpdate:state'] = (state) => {
          context.emit('update:state', state);
        }
        slots[i].props['onUpdate:activeKey'] = () => {
          if (activeItem.value === windowActivationKey) {
            activeItem.value = undefined;
          } else {
            activeItem.value = windowActivationKey;
          }
          context.emit('update:modelValue', activeItem.value);
        };
      }
    }

    return {
      slots,
      activeItem,
    }
  },
  render() {
    return h(
        LControl,
        {position: "topleft"},
        [
          h(
              'div',
              {class: 'd-flex flex-column'},
              this.slots.map((item) => {
                if (item.component)
                  item.component.props['isActive'] = item.props['window-activation-key'] == this.activeItem;
                return item;
              }),
          ),
        ]
    );
  }
});
</script>