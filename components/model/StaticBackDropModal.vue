<template>
  <!--begin::Modal - New Address-->
  <div
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="staticBackdrop"
    aria-hidden="true"
    :id="modalId"
    ref="modalEl"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered" :class="modalSizeClass">
      <!--begin::Modal content-->
      <div class="modal-content">
        <div class="modal-header" :class="{ 'p-2': thinFooter }">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ innerModalTitle }}
          </h5>
        </div>

        <div class="modal-body" :class="[modalBodyClassExtra]">
          <slot name="modal-content" :modalId="modalId" />
        </div>
        <div class="modal-footer" :class="{ 'p-2': thinFooter }">
          <slot name="modal-footer" />
        </div>
      </div>
    </div>
  </div>
  <!--end::Modal - New Address-->
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { randomId } from "@/custom/helpers/random";
import Modal from "bootstrap/js/dist/modal";
import { VueInstanceService } from "@/Defaults";

export default defineComponent({
  name: "static-back-drop-modal",
  data() {
    return {
      modal: null,
      event: null,
      innerModalTitle: this.modalTitle,
    };
  },
  mounted() {
    // console.log(this.$refs.modalEl);
    (async () => {
      if (document.querySelector("#" + this.modalId)) {
        this.modal = new Modal("#" + this.modalId, {
          backdrop: "static",
          keyboard: false,
        });
        (this.$refs.modalEl as any).addEventListener(
          "show.bs.modal",
          this.emitEvent("open")
        );
        (this.$refs.modalEl as any).addEventListener(
          "shown.bs.modal",
          this.emitEvent("opened")
        );
        (this.$refs.modalEl as any).addEventListener(
          "hide.bs.modal",
          this.emitEvent("close")
        );
        (this.$refs.modalEl as any).addEventListener(
          "hidden.bs.modal",
          this.emitEvent("closed")
        );
      }
    })();
  },
  unmounted() {
    if (this.modal) {
      try {
        (this.modal as any).dispose();
      } catch (e) {
        //
      }
    }
    const modalE = document.querySelector("#" + this.modalId);
    if (modalE) modalE.remove();
  },
  props: {
    modalBodyClassExtra: {
      default: "",
    },
    modalId: {
      default: () => {
        return `id-modal-${randomId(3)}`;
      },
    },
    modalTitle: {
      default: "موضوع مدال",
    },
    modalSizeClass: {
      default: "mw-700px",
    },
    thinFooter: {
      default: false,
    },
  },
  methods: {
    emitEvent: function (event) {
      return (e) => {
        VueInstanceService.emit(`${event}.bs.modal`);
        this.$emit(event, { event: e, data: this.event });
      };
    },
    open: function (event) {
      this.event = event;
      (this.modal as any)?.show();
    },
    close: function (event) {
      this.event = event;
      (this.modal as any)?.hide();
    },
    setTitle: function (title) {
      this.innerModalTitle = title;
    },
  },
  watch: {
    modalTitle: function (e) {
      this.innerModalTitle = e;
    },
  },
});
</script>
