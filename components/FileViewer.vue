<template>
  <card
    class="bg-secondary align-items-center position-relative"
    body-padding-class=" overflow-hidden"
  >
    <template v-slot:card-content>
      <div class="file-label" v-if="fileData.field && fileData.field.label">
        {{ fileData.field.label }}
      </div>
      <img
        class="type-icon z-index-0"
        :src="'/media/icons/type-icons/' + type + '.png'"
      />
      <p class="m-0 position-relative z-index-2">{{ file.name }}</p>
    </template>
  </card>
</template>
<style lang="scss">
.type-icon {
  opacity: 0.4;
  top: 50%;
  transform: translateY(-50%);
  left: -10px;
  position: absolute;
  width: 50px;
  height: 50px;
}
.file-label {
  padding: 1px 5px;
  font-size: 12px;
  border-radius: 5px;
  background-color: #0bb7af;
  color: #ffffff;
  top: -4px;
  right: -4px;
  position: absolute;
}
</style>
<script>
import Card from "./Card";
import { computed, ref, toRef } from "vue";

export default {
  components: { Card },
  props: ["fileData"],
  setup(props) {
    const fileData = toRef(props, "fileData");
    const file = ref(fileData.value.file);
    const type = computed(() => {
      let text = file.value;
      if (text) {
        text = text.name;
        switch (text.toLowerCase().split(".")[text.split(".").length - 1]) {
          case "png":
          case "jpg":
          case "jpeg":
          case "svg":
          case "tiff":
            return "image";
          case "doc":
          case "docx":
            return "doc";
          case "mp3":
          case "flac":
          case "wav":
          case "wma":
          case "aac":
            return "mp3";
          case "mp4":
          case "avi":
            return "video";
          case "pdf":
            return "pdf";
          case "xls":
          case "xlsx":
            return "excel";
          case "txt":
            return "txt";
          default:
            return "php";
        }
      }

      return "php";
    });
    return {
      type,
      file,
    };
  },
};
</script>
