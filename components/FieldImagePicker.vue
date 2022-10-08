<script lang="ts">

import {defineComponent, h, onUnmounted, ref, resolveComponent} from "vue";
import Cropper from "cropperjs"
import {DEFAULT_COLS} from "@/custom/helpers/RenderFunctionHelpers";

export default defineComponent({
  setup(props, context) {
    let lastRequest: any;
    const selectedFile = ref(false)
    const build = (fileRef) => {
      if (fileRef) {
        const cropper = new Cropper(fileRef, {
          aspectRatio: 1,
          initialAspectRatio: 1,
          crop: (e) => {
            clearTimeout(lastRequest);
            lastRequest = setTimeout(() => {
              const canvas = cropper.getCroppedCanvas();
              canvas.toBlob(function (blob: any) {
                context.emit('update:modelValue', [new File([blob], "fileName.jpg", { type: "image/png" })]);
              }, "image/png", 1);
            }, 500)
          }
        });
        onUnmounted(() => cropper.destroy());
      }
    }
    let lastFileInputInstance: any;

    function readURL() {
      if (lastFileInputInstance.files && lastFileInputInstance.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e: any) {
          lastFileInputInstance.setAttribute('src', e.target.result);
          selectedFile.value = true;
        };

        reader.readAsDataURL(lastFileInputInstance.files[0]);
      }
    }

    return () => {

      const layers: any = [
        h(
            'input',
            {
              ref: (e) => lastFileInputInstance = e,
              class: 'd-none',
              type: "file",
              accept: "image/*",
              onChange: () => {
                readURL();
              },
            }
        )
      ];

      if (!selectedFile.value) {
        layers.push(h(
            'div',
            {
              class: 'd-flex align-items-center justify-content-center',
              style: {
                height: '100px !important'
              },
              onClick: () => {
                lastFileInputInstance.click();
              }
            },
            "یک تصویر انتخاب کنید"
        ));
      } else {
        layers.push(
            DEFAULT_COLS.col12(
                h(
                    'img',
                    {
                      style: {
                        maxHeight: '250px',
                      },
                      ref: build,
                      src: lastFileInputInstance.getAttribute('src'),
                    }
                )
            )
        );

        layers.push(
            h(
                'div',
                {
                  class: 'btn btn-sm btn-icon btn-danger close-button',
                  onClick: () => {
                    selectedFile.value = false;
                    context.emit('update:modelValue', undefined);
                  },
                },
                h(
                    'span',
                    {
                      class: 'svg-icon svg-icon-1',
                    },
                    h(
                        resolveComponent('inline-svg'),
                        {
                          src: 'media/icons/duotune/arrows/arr061.svg',
                        }
                    ),
                ),
            ),
        );
      }

      return h('div', {class: "field-image-cropper"}, layers);
    }
  }
});
</script>
<style>
@import "~cropperjs/dist/cropper.min.css";
</style>
<style lang="scss">
.field-image-cropper {
  position: relative;

  .close-button {
    position: absolute;
    top: 15px;
    right: 10px;
  }
}
</style>