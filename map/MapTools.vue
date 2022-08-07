<script lang="ts">
import {defineComponent, h, onMounted, Ref, ref} from "vue";
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
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {

    const buttons: Ref<Array<any>> = ref([]);

    const addButton = () => {
      console.log("button added");
      buttons.value.push(h(MapToolsButton, {
        hint: 'test',
        iconUrl: '/media/map/tubes.png',
      }))
    }

    onMounted(() => {
      VueInstanceService.on(props.name, (e) => {
        const command = e[0];

        switch (command) {
          case "add-icon":
            addButton();
            break;
        }
      });
    });

    return {
      buttons,
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
              [
                ...this.buttons
              ]
          )

        ]
    );
  }
});
</script>