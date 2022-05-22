<template>
  <!--begin::Chat drawer-->
  <div
      id="kt_drawer_chat"
      class="bg-white"
      data-kt-drawer="true"
      data-kt-drawer-name="chat"
      data-kt-drawer-activate="true"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'300px', 'md': '500px'}"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_drawer_toggle"
      data-kt-drawer-close="#kt_drawer_close"
  >
    <!--begin::Messenger-->
    <div class="card w-100" id="kt_drawer_chat_messenger">
      <!--begin::Card header-->
      <div class="card-header pe-5" id="kt_drawer_chat_messenger_header">
        <!--begin::Title-->
        <div class="card-title">
          <!--begin::User-->
          <div class="d-flex justify-content-center flex-column me-3">
            <a
                @click.prevent
                href="#"
                class="
                fs-4
                fw-bolder
                text-gray-900 text-hover-primary
                me-1
                mb-2
                lh-1
              "
            >پیام های سیستمی</a
            >

            <!--begin::Info-->
            <!--            <div class="mb-0 lh-1">-->
            <!--              <span-->
            <!--                class="badge badge-success badge-circle w-10px h-10px me-1"-->
            <!--              ></span>-->
            <!--              <span class="fs-7 fw-bold text-gray-400">Active</span>-->
            <!--            </div>-->
            <!--end::Info-->
          </div>
          <!--end::User-->
        </div>
        <!--end::Title-->

        <!--begin::Card toolbar-->
        <div class="card-toolbar">
          <!--begin::Menu-->
          <div class="me-2">
            <button
                class="btn btn-sm btn-icon btn-active-icon-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
            >
              <i class="bi bi-three-dots fs-3"></i>
            </button>
          </div>
          <!--end::Menu-->

          <!--begin::Close-->
          <div
              class="btn btn-sm btn-icon btn-active-icon-primary"
              id="kt_drawer_close"
          >
            <span class="svg-icon svg-icon-2x">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg"/>
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Card toolbar-->
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div class="card-body p-0" id="kt_drawer_chat_messenger_body">
        <!--begin::Messages-->
        <scroll-handler
            padding-class="p-5"
            ref="messagesRef"
            dependencies="#kt_drawer_chat_messenger_header"
            wrappers="#kt_drawer_chat_messenger_body">

          <template v-for="notification in notifications" :key="notification.id">
            <notification-v1 v-bind="notification" />
          </template>
        </scroll-handler>
        <!--end::Messages-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Messenger-->
  </div>
  <!--end::Chat drawer-->
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, ref} from "vue";
import ScrollHandler from "@/custom/components/ScrollHandler.vue";
import NotificationV1, {NotificationV1Interface} from "@/custom/components/notification/NotificationV1.vue";

export default defineComponent({
  components: {
    NotificationV1,
    ScrollHandler,
  },
  setup() {
    const messagesRef = ref(null);
    const notifications = ref<NotificationV1Interface[]>([]);
    for (let i = 0; i < 10; i++) {
      notifications.value.push({
        id: i.toString(),
        title: "موضوع",
        background: "media/svg/shapes/abstract-4.svg",
        widgetClasses: "card-xl-stretch mb-xl-8",
        time: "3:30PM - 4:20PM",
        description: "Create a headline that is informative<br/>and will capture readers",
      })
    }

    onMounted(() => {
      if (messagesRef.value != null) {
        nextTick(() => {
          (messagesRef.value as any).update();
        });
      }
    });

    return {
      messagesRef,
      notifications,
    };
  },
});
</script>
