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
    lines: {
      type: Array
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
        if (!e.originalEvent._alreadyFilled) {
          e.originalEvent._alreadyFilled = true;
          ContextMenuService.set([
            {
              text: "ویرایش",
              onClick: () => context.emit("edit")
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

    const draw: any = [];

    const options = {
      onMouseenter: this.onEnter,
      onMouseleave: this.onLeave,
      onContextmenu: this.onContextmenu,
      latLngs: this.lines,
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