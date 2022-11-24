<template>
  <table-t-d>
    <div
      class="user-profile-stack"
      @click="
        $viewerApi({
          images: firstThree.map((e) =>
            e.avatar ? e.avatar : 'media/avatars/blank2.jpg'
          ),
        })
      "
    >
      <div
        v-for="(user, index) in firstThree"
        :key="index"
        class="cursor-pointer symbol symbol-40px user-profile"
        title="User profile"
      >
        <img
          :src="user.avatar ? user.avatar : 'media/avatars/blank2.jpg'"
          alt="metronic"
        />
      </div>
    </div>
  </table-t-d>
</template>
<style>
.user-profile-stack {
  position: relative;
}

.user-profile {
  top: -20px;
  left: 50%;
  box-shadow: 0 0 3px black;
  position: absolute;
}

.user-profile:nth-child(1) {
  transform: translate3d(-15%, 5px, 0);
}

.user-profile:nth-child(2) {
  transform: translate3d(-75%, 5px, 0);
}

.user-profile:last-child {
  transform: translateX(-50%);
}
</style>
<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";

export default defineComponent({
  components: { TableTD },
  props: ["data"],
  setup(props) {
    const data = toRef(props, "data");
    const firstThree = computed(() => {
      if (data.value) return data.value.slice(0, 3);

      return data.value;
    });

    return {
      firstThree,
    };
  },
});
</script>
