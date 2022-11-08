<template>
  <div class="row">
    <div class="col-12">
      <CkEditor
        :editor="editorClass"
        @ready="onReady"
        :config="editorConfig"
        @update:modelValue="$emit('update:modelValue', $event)"
        :modelValue="modelValue"
      />
    </div>
  </div>
</template>
<style lang="scss">
.ck-editor {
  .ck-toolbar,
  .ck-content {
    min-height: 50px;
    border-radius: 0 !important;
  }
}
</style>
<script>
import CKEditor from "@ckeditor/ckeditor5-vue";

import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";

import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
import TableToolbar from "@ckeditor/ckeditor5-table/src/table";

import ParagraphButtonUI from "@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import List from "@ckeditor/ckeditor5-list/src/list";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import CkEditorReferencePlugin from "@/custom/components/ck-editor-plugins/CkEditorReferencePlugin.js";

export default {
  components: {
    CkEditor: CKEditor.component,
  },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      editor: null,
      editorClass: ClassicEditor,
      editorConfig: {
        emitter: this.$emit,
        alignment: {
          options: ["left", "right", "center", "justify"],
        },
        language: "fa",
        plugins: [
          EssentialsPlugin,

          TableToolbar,
          BoldPlugin,
          ItalicPlugin,
          Underline,
          Strikethrough,
          Superscript,
          Subscript,

          PasteFromOffice,
          Indent,
          Alignment,
          List,
          ParagraphPlugin,
          ParagraphButtonUI,
          Heading,
          CkEditorReferencePlugin,
        ],
        toolbar: {
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          items: [
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "insertTable",
            "indent",
            "|",
            "insertReference",
            "bold",
            "superscript",
            "subscript",
            "strikethrough",
            "underline",
            "italic",
            "|",
            "undo",
            "redo",
          ],
        },
      },
    };
  },
  methods: {
    onReady(editor) {
      this.editor = editor;
      this.$emit("ready", this.editor);
      // Insert the toolbar before the editable area.
      // editor.ui.getEditableElement().parentElement.parentElement.insertBefore(
      //     editor.ui.view.toolbar.element,
      //     editor.ui.getEditableElement()
      // );
    },
  },
};
</script>
