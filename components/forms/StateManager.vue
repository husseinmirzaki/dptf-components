<script lang="ts">
import { ref } from "vue";

export default {
  props: ["states"],
  setup(props, context) {
    const activeState = ref(props.states[0]);
    const setState = (state) => {
      activeState.value = state;
    };
    context.expose({
      activeState,
      setState,
    });
    return () => {
      return context.slots[activeState.value]();
    };
  },
};
</script>
