<script lang="ts">
import {ref} from "vue";

export default {
  props: ['states'],
  setup(props, context) {
    const activeState = ref(props.states[0]);
    context.expose({
      activeState
    })
    return () => {
      return context.slots[activeState.value]()
    }
  }
}
</script>