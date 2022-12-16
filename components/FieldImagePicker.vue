<script lang="ts">
import {defineComponent, h, onUnmounted, ref, resolveComponent} from "vue";
import Cropper from "cropperjs";
import {DEFAULT_COLS} from "@/custom/helpers/RenderFunctionHelpers";

export default defineComponent({
  props: {
    ratio: {
      type: Number,
      default: 1,
    }
  },
  setup(props, context) {
    let lastRequest: any;
    const selectedFile = ref(false);
    const alreadyUploadedFile = ref();
    const build = (fileRef) => {
      if (fileRef) {
        const cropper = new Cropper(fileRef, {
          aspectRatio: props.ratio,
          initialAspectRatio: props.ratio,
          crop: (e) => {
            clearTimeout(lastRequest);
            lastRequest = setTimeout(() => {
              const canvas = cropper.getCroppedCanvas();
              canvas.toBlob(
                  function (blob: any) {
                    context.emit("update:modelValue", [
                      new File([blob], "fileName.jpg", {type: "image/png"}),
                    ]);
                  },
                  "image/png",
                  1
              );
            }, 500);
          },
        });
        onUnmounted(() => cropper.destroy());
      }
    };
    let lastFileInputInstance: any;

    function readURL() {
      if (lastFileInputInstance.files && lastFileInputInstance.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e: any) {
          lastFileInputInstance.setAttribute("src", e.target.result);
          selectedFile.value = true;
        };

        reader.readAsDataURL(lastFileInputInstance.files[0]);
      }
    }

    function getBase64(file) {
      return new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
    }

    context.expose({
      /**
       * address of already selected file
       * @param e
       */
      setData: (e) => {
        if (Array.isArray(e) && e[0] instanceof File)
          getBase64(e[0]).then((result) => {
            alreadyUploadedFile.value = result;
            lastFileInputInstance.setAttribute("src", result);
            selectedFile.value = true;
          });
        else
          alreadyUploadedFile.value = e;
      }
    })

    return () => {
      const layers: any = [
        h("input", {
          ref: (e) => (lastFileInputInstance = e),
          class: "d-none",
          type: "file",
          accept: "image/*",
          onChange: () => {
            readURL();
          },
        }),
      ];

      const deleteButton = () => layers.push(
          h(
              "div",
              {
                class: "btn btn-sm btn-icon btn-danger close-button",
                onClick: () => {
                  if (selectedFile.value) {
                    selectedFile.value = false;
                    if (alreadyUploadedFile.value)
                      context.emit("update:modelValue", undefined);
                    else
                      context.emit("update:modelValue", "r");
                  } else {
                    selectedFile.value = false;
                    alreadyUploadedFile.value = false;
                    context.emit("update:modelValue", "r");
                  }
                },
              },
              h(
                  "span",
                  {
                    class: "svg-icon svg-icon-1",
                  },
                  h(resolveComponent("inline-svg"), {
                    src: "media/icons/duotune/arrows/arr061.svg",
                  })
              )
          )
      )

      if (!selectedFile.value) {
        layers.push(
            h(
                "div",
                {
                  class: "d-flex align-items-center justify-content-center",
                  style: {
                    height: "100px !important",
                    background: alreadyUploadedFile.value ? `url(${alreadyUploadedFile.value})` : undefined,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  },
                  onClick: () => {
                    lastFileInputInstance.click();
                  },
                },
                alreadyUploadedFile.value ? "" : "یک تصویر انتخاب کنید"
            )
        );
        if (alreadyUploadedFile.value)
          deleteButton();
      } else {
        layers.push(
            DEFAULT_COLS.col12(
                h("img", {
                  style: {
                    maxHeight: "250px",
                  },
                  ref: build,
                  src: lastFileInputInstance.getAttribute("src"),
                })
            )
        );
        deleteButton();
      }

      return h("div", {class: "field-image-cropper"}, layers);
    };
  },
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
