<template>
  <div class="row">
    <div class="col-12">
      <CkEditor :editor="editorClass" @ready="onReady" :config="editorConfig"/>
    </div>
  </div>
</template>
<style lang="scss">
.ck-editor {
  .ck-toolbar, .ck-content {
    border-radius: 0 !important;
  }
}
</style>
<script>

import CKEditor from '@ckeditor/ckeditor5-vue';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

export default {
  components: {
    CkEditor: CKEditor.component,
  },
  data() {
    return {
      editorClass: ClassicEditor,
      editorConfig: {
        language: 'fa',
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          ParagraphPlugin
        ],
        toolbar: {
          items: [
            'bold',
            'italic',
            'undo',
            'redo'
          ]
        }
      }
    }
  },
  methods: {
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui.getEditableElement().parentElement.parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
    }
  }
}
</script>