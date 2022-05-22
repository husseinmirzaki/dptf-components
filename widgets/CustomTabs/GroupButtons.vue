<template>
  <div class="d-flex gap-2 " :class="{
      'flex-column': !horizontal,
    }">
    <button class="btn btn-primary" :class="{
      'tabs': tabs,
      'horizontal': horizontal,
      'btn-active-dark': !button !== selectedButton,
      'btn-dark': button === selectedButton
    }" v-for="button in buttons" :key="button.id" @click="selectedButton=button;$emit('selected', button)">
      {{ button.name }}
    </button>
  </div>
</template>
<style lang="scss">
.tabs.tabs {
  button {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
<script>
export default {
  data() {
    return {
      selectedButton: {},
    }
  },
  props: {
    tabs: {
      default: false,
    },
    horizontal: {
      default: true,
    },
    buttons: {
      default: () => [],
    },
  },
}
</script>