<script lang="ts">
import { defineComponent, h, ref, toRef } from "vue";
import { buildEmitter } from "@/custom/map/utils/emitter";

class Extensions {
  getRef(extension) {
    return this[extension].component["proxy"];
  }

  get(extension, property = null) {
    if (!property) return this.getRef(extension);
    return this.getRef(extension)[property];
  }
}

export default defineComponent({
  props: ["parent"],
  setup(props, context) {
    const parent = toRef(props, "parent");
    const slots = () => {
      const _slots = context.slots!.default!();
      _slots.forEach((e) => {
        const componentName = e["type"]["name"];

        if (!e["props"]) {
          e["props"] = {};
        }

        e["props"]["plugins"] = parent.value.plugins;
        parent.value.plugins.register(componentName, e);
      });
      return _slots;
    };

    return () => {
      return h(
        "div",
        {},
        {
          default: () => slots(),
        }
      );
    };
  },
});
</script>
