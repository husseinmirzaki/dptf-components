<script lang="ts">
import {defineComponent, h, withModifiers} from "vue";
import {LPolyline} from "@vue-leaflet/vue-leaflet"
import {ContextMenuService} from "@/custom/components/ContextMenuService";

export default defineComponent({
  props: {
    strokeColor: {
      default: "#000000",
    },
    innerColor: {
      type: String
    },
  },
  setup(props, context) {
    const onEnter = () => {
      //
    }

    const onLeave = () => {
      //
    }

    const onContextmenu = (e) => {
      if (e.originalEvent) {
        e.originalEvent.stopPropagation();
        if (!e.originalEvent._alreadyFilled) {
          e.originalEvent._alreadyFilled = true;
          ContextMenuService.set([
            {
              text: "ویرایش",
              onClick: () => context.emit("edit")
            },
            {
              text: "حذف",
              onClick: () => context.emit("delete")
            },
          ]);
        }
      }
    }

    return {
      onEnter,
      onLeave,
      onContextmenu,
    }
  },
  render() {
    const lines = [
      [35.632744348010625, 51.43146514892579],
      [35.55010533588552, 51.22650146484375],
      [35.18278813800229, 50.86395263671875],
    ];

    const draw: any = [];

    const options = {
      onMouseenter: this.onEnter,
      onMouseleave: this.onLeave,
      onContextmenu: this.onContextmenu,
      latLngs: lines,
    };

    if (this.strokeColor) {
      draw.push(h(LPolyline, {
        ...options,
        color: this.strokeColor,
        weight: this.innerColor ? 6 : 4,
      }));
    }
    if (this.innerColor) {
      draw.push(h(LPolyline, {
        ...options,
        color: this.innerColor,
        weight: 3,
      }))
    }


    return draw;
  }
})
</script>