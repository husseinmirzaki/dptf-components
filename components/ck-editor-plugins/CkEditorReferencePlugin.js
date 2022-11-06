import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {
  toWidget,
  toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class CkEditorReferencePlugin extends Plugin {
  init() {
    this._emitter = this.editor.config.emitter;
    this._addButton();
    this._defineSchema();
    this._defineConverters();
  }

  _addButton() {
    this.editor.ui.componentFactory.add('insertReference', (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'اضافه کردن عطف',
        tooltip: true,
        withText: true,
      });

      view.on('execute', () => {
        this.editor.config._config.emitter('addReference', this);
      });

      return view;
    });
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.register('reference', {
      // avoid easy delets
      isInline: true,
      isObject: true,
      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$inlineObject',
      allowContentOf: '$block',
      allowAttributesOf: '$block',
      allowAttributes: 'letterId',
    });

    schema.register('letter-number', {
      // Cannot be split or left by the caret.
      isLimit: true,
      isInline: true,

      allowIn: 'reference',

      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowWhere: '$inlineObject',
      allowContentOf: '$block',
      allowAttributesOf: '$block',
    });
  }

  _defineConverters() {
    // ADDED
    const conversion = this.editor.conversion;

    // this will convert sth called reference to a span
    conversion.for('upcast').elementToElement({
      model: 'reference',
      view: {
        name: 'span',
        classes: 'letter-reference',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'reference',
      view: {
        name: 'span',
        classes: 'letter-reference',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'reference',
      view: (modelElement, { writer: viewWriter }) => {
        const span = viewWriter.createContainerElement('span', {
          class: 'letter-reference',
        });

        return toWidget(span, viewWriter, { label: 'عطف به یک نامه' });
      },
    });

    // this will convert sth called reference to a span
    conversion.for('upcast').elementToElement({
      model: 'letter-number',
      view: {
        name: 'u',
        classes: 'letter-reference-underline',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'letter-number',
      view: {
        name: 'u',
        classes: 'letter-reference-underline',
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'letter-number',
      view: (modelElement, { writer: viewWriter }) => {
        const span = viewWriter.createContainerElement('u', {
          class: 'letter-reference-underline',
        });

        return toWidget(span, viewWriter, { label: 'شماره نامه' });
      },
    });

    conversion.for('upcast').attributeToAttribute({
      model: 'letterId',
      view: 'letter-id',
    });

    conversion.for('dataDowncast').attributeToAttribute({
      model: 'letterId',
      view: 'letter-id',
    });
  }
}
