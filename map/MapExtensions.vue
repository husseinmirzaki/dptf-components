<script lang="ts">
import {defineComponent, h, nextTick, onMounted, onUnmounted, ref} from "vue";
import {OrderedList} from "@/views/province/utils";
import {buildEmitter} from "@/custom/map/utils/emitter";

class Extensions {

  getRef(extension) {
    return this[extension].component['proxy'];
  }

  get(extension, property = null) {
    if (!property)
      return this.getRef(extension);
    return this.getRef(extension)[property];
  }
}

export default defineComponent({
  props: ['parent'],
  setup(props, context) {
    const {emitsTo, emitTo} = buildEmitter();
    const extensions = new Extensions();

    const slots = context.slots!.default!();
    slots.forEach((e) => {
      const componentName = e['type']['name'];
      props.parent.plugins.register(componentName, e);

      if (!e['props']) {
        e['props'] = {};
      }

      e['props']['plugins'] = props.parent.plugins;

      extensions[componentName] = e;
    })

    context.expose({extensions});

    const onMapExtensionLineDrawer = (name: any, event: any) => {
      switch (name) {
        case 'edit-line':

          if (props.parent.activeWindow == null) {
            props.parent.setProperty('activeWindow', 'default-windows');
            nextTick(() => {
              const component = props.parent.mapWindowsRef.$slots.default()[0].component;
              const lines = event[1].lines;
              component.proxy.orderedList.setInitial(lines);
            });
          }

          break;
      }
    }

    onMounted(() => {
      extensions.get('MapExtensionLineDrawer').emitsTo['MapExtensions'] = onMapExtensionLineDrawer;
    });

    onUnmounted(() => {
      delete extensions.get('MapExtensionLineDrawer').emitsTo['MapExtensions'];
    });

    return () => {
      return h('div', {}, {
        default: () => slots
      });
    }
  }
});
</script>