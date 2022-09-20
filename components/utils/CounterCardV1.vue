<script lang="ts">
import {defineComponent, h} from "vue";
import Card from "@/custom/components/Card.vue";

export default defineComponent({
  props: ['title', 'extra'],
  setup(props) {
    return () => {
      return h(
          Card,
          {
            bodyPaddingClass: 'p-1 text-center',
          },
          {
            'card-content': () => {
              return [
                h(
                    'p',
                    props.title,
                ),
                h(
                    'h2',
                    props.extra
                ),
              ]
            }
          }
      )
    };
  }
});
</script>