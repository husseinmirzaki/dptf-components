<template>
  <modal ref="modal" extra-modal-dialog-classes="mw-650px">
    <template v-slot:modal-body>
      <!--begin::Users-->
      <div class="mb-15">
        <!--begin::List-->
        <div class="mh-375px scroll-y me-n7 pe-7">
          <template v-for="(user, index) in users" :key="index">
            <!--begin::User-->
            <div
                class="
                    d-flex
                    flex-stack
                    py-5
                    border-bottom border-gray-300 border-bottom-dashed
                  "
            >
              <!--begin::Details-->
              <div class="d-flex align-items-center">
                <!--begin::Avatar-->
                <div class="symbol symbol-35px symbol-circle">
                  <img v-if="user.avatar" alt="Pic" :src="user.avatar"/>
                  <span
                      v-else
                      :class="`bg-light-${user.state} text-${user.state}`"
                      class="symbol-label fw-bold"
                  >
                        {{ user.name.charAt(0) }}
                      </span>
                </div>
                <!--end::Avatar-->

                <!--begin::Details-->
                <div class="ms-6">
                  <!--begin::Name-->
                  <a
                      href="#"
                      class="
                          d-flex
                          align-items-center
                          fs-5
                          fw-bolder
                          text-dark text-hover-primary
                        "
                  >
                    {{ user.name }}

                    <span class="badge badge-light fs-8 fw-bold ms-2">
                          {{ user.position }}
                        </span>
                  </a>
                  <!--end::Name-->

                  <!--begin::Email-->
                  <div class="fw-bold text-gray-400">{{ user.email }}</div>
                  <!--end::Email-->
                </div>
                <!--end::Details-->
              </div>
              <!--end::Details-->

              <!--begin::Stats-->
              <div class="d-flex">
                <!--begin::Sales-->
                <div class="text-end">
                  <div class="fs-5 fw-bolder text-dark">
                    ${{ user.sales }}
                  </div>

                  <div class="fs-7 text-muted">Sales</div>
                </div>
                <!--end::Sales-->
              </div>
              <!--end::Stats-->
            </div>
            <!--end::User-->
          </template>
        </div>
        <!--end::List-->
      </div>
      <!--end::Users-->

      <!--begin::Notice-->
      <div class="d-flex justify-content-between">
        <!--begin::Label-->
        <div class="fw-bold">
          <label class="fs-6">Adding Users by Team Members</label>

          <div class="fs-7 text-gray-400">
            If you need more info, please check budget planning
          </div>
        </div>
        <!--end::Label-->

        <!--begin::Switch-->
        <label
            class="form-check form-switch form-check-custom form-check-solid"
        >
          <input
              class="form-check-input"
              type="checkbox"
              value=""
              checked="checked"
          />

          <span class="form-check-label fw-bold text-gray-400">
                Allowed
              </span>
        </label>
        <!--end::Switch-->
      </div>
      <!--end::Notice-->
    </template>
  </modal>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import Modal from "@/custom/components/model/Modal.vue";

export class UserViewModalService {
  static userId = ref(0);
}

export default defineComponent({
  components: {Modal},
  setup() {
    const modal = ref();
    watch(UserViewModalService.userId, () => {
      //
    });
    return {
      modal
    }
  }
});
</script>