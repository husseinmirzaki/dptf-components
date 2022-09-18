<template>
  <!--begin::Modal - New Address-->
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true" ref="modalEl">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered" :class="modalSizeClass">
      <!--begin::Modal content-->
      <div class="modal-content">
        <div class="modal-header" :class="{'p-2': thinFooter}">
          <h5 class="modal-title fw-light" id="exampleModalLabel">{{ innerModalTitle }}</h5>
          <div v-if="!sticky"
              class="btn btn-sm btn-icon btn-active-icon-primary close" @click="close()"
          >
            <span class="svg-icon svg-icon-2x">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg"/>
            </span>
          </div>
        </div>

        <div class="modal-body" :class="[modalBodyClassExtra]">
          <slot name="modal-content" :modalId="modalId" :state="state"/>
        </div>
        <div class="modal-footer" :class="{'p-2': thinFooter}">
          <button type="button" class="btn btn-light-primary font-weight-bold" :class="{'mt-4': !thinFooter}" v-if="!sticky"
                  @click="close()">بستن
          </button>
          <slot name="modal-footer"/>
        </div>
      </div>
    </div>
  </div>
  <!--end::Modal - New Address-->
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {randomId} from "@/custom/helpers/random";
import Modal from "bootstrap/js/dist/modal";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  name: "modal",
  data() {
    return {
      state: 'closed',
      modal: null,
      event: null,
      innerModalTitle: this.modalTitle,
    };
  },
  mounted() {
    console.log(this.$refs.modalEl);
    (async () => {
      if (document.querySelector("#" + this.modalId)) {
        if (this.sticky)
          this.modal = new Modal("#" + this.modalId, {
            backdrop: 'static',
            keyboard: false
          });
        else
          this.modal = new Modal("#" + this.modalId);
        (this.$refs.modalEl as any).addEventListener('show.bs.modal', this.emitEvent('open'));
        (this.$refs.modalEl as any).addEventListener('shown.bs.modal', this.emitEvent('opened'));
        (this.$refs.modalEl as any).addEventListener('hide.bs.modal', this.emitEvent('close'));
        (this.$refs.modalEl as any).addEventListener('hidden.bs.modal', this.emitEvent('closed'));
      }
    })()
  },
  unmounted() {
    if (this.modal) {
      try {
        this.close(null);
        (this.modal as any).dispose();
      } catch (e) {
        //
      }
    }
    const modalE = document.querySelector("#" + this.modalId);
    if (modalE) modalE.remove();
  },
  props: {
    sticky: {
      default: false
    },
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
        this.state = event;
        VueInstanceService.emit(`${event}.bs.modal`, {
          modalId: this.modalId,
          event: e,
        });
        this.$emit(event, {event: e, data: this.event});
      }
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
    }
  },
  watch: {
    modalTitle: function (e) {
      this.innerModalTitle = e;
    }
  },
});
</script>
