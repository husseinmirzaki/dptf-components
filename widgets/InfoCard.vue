<template>
  <a href="#" class="card-xl-stretch mb-xl-8 bg-white card hoverable">
    <div class="card-body" :class="[$attrs['card-body-class']]">
      <slot />
      <div class="fw-bolder fs-2 mb-2 mt-5" :class="[textClass]">
        {{ cardData }}
      </div>
      <div class="fw-bold fs-7" :class="[textClass]">{{ cardTitle }}</div>
    </div>
  </a>
</template>
<script>
export default {
  props: ["cardData", "cardTitle", "textClass"],
};
</script>
