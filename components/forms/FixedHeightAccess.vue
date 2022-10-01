<script lang="ts">
import {defineComponent, h, resolveComponent} from "vue";

export default defineComponent({
  props: {
    content: {
      default: `
      متاسفانه فرم موردنظر پیدا نشد <br/>
      ویا شما به فرم موردنظر دسترسی ندارید
    `
    }
  },
  setup(props) {
    return () => {
      return h(
          'div', {
            class: 'd-flex flex-column justify-content-center align-items-center text-center',
          },
          [
            h(
                'span', {class: 'svg-icon svg-icon-danger'},
                h(resolveComponent('inline-svg'), {
                  src: 'media/icons/duotune/arrows/arr061.svg',
                  style: {width: '150px', height: '150px'}
                })
            ),
            h(
                'h4', {innerHTML: props.content},
            ),
          ]
      )
    }
  }
});
</script>