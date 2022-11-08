<template>
  <div class="d-flex align-content-center p-2 mb-2 file-indicator">
    <img
      v-if="file.type.startsWith('image/')"
      src="/media/icons/duotune/file_types/image.png"
      width="50"
      height="50"
    />
    <img
      v-else-if="file.type.search('(sheet)|(ms-excel)') > -1"
      src="/media/icons/duotune/file_types/xls.png"
      width="50"
      height="50"
    />
    <img
      v-else-if="file.type == 'application/pdf'"
      src="/media/icons/duotune/file_types/pdf.png"
      width="50"
      height="50"
    />
    <img
      v-else-if="
        file.type.search(
          '(wordprocessingml.document)|(msword)|(word.document)'
        ) > -1
      "
      src="/media/icons/duotune/file_types/doc.png"
      width="50"
      height="50"
    />
    <img
      v-else-if="
        file.type.search(
          '(ms-powerpoint)|(powerpoint.presentation)|(presentationml.presentation)'
        ) > -1
      "
      src="/media/icons/duotune/file_types/ppt.png"
      width="50"
      height="50"
    />
    <img
      v-else-if="isZip"
      src="/media/icons/duotune/file_types/zip.png"
      width="50"
      height="50"
    />
    <img
      v-else
      src="/media/icons/duotune/file_types/php.png"
      width="50"
      height="50"
    />
    <span class="align-self-center">{{ file.name }}</span>
  </div>
</template>
<style lang="scss" scoped>
.file-indicator {
  box-shadow: 0 0 10px -2px #000;
  border-radius: 10px;
}
span {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
<script lang="ts">
import { computed, toRef } from "vue";

export default {
  props: {
    file: {
      type: File,
    },
  },
  setup(props) {
    const file = toRef(props, "file");
    const isZip = computed(() => {
      if (file.value) {
        switch (file.value.type) {
          case "":
            return file.value.name.endsWith(".rar");
          case "application/x-zip-compressed":
          case "application/x-gzip":
            return true;
        }
      }
      return false;
    });
    console.log(file.value);
    return {
      isZip,
    };
  },
};
</script>
