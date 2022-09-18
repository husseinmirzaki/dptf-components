<script lang="ts">
import {defineComponent, h, onMounted} from "vue";
import Modal from "@/custom/components/model/Modal.vue";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  setup(props, context) {

    let modalInstance: any = null;

    const open = () => {
      modalInstance.open();
    }

    onMounted(() => {
      VueInstanceService.on('show-history', (e) => {
        const command: string = e[0];

        switch (command) {
          case "open":
            open();
            break;
        }

      });
    });

    return () => {
      return h(Modal, {
        modalTitle: "نمایش تاریخ چه جدول",
        thinFooter: true,
        ref: (el) => modalInstance = el,
      });
    }
  }
});
</script>