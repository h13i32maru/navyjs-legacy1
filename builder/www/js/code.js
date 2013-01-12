Builder.Code = nClass.instance(Builder.Core2, {
    CLASS: 'Code',
    type: 'code',
    makeEditor: null,
    editors: null,

    initialize: function($super, makeEditor) {
        $super();

        this.editors = {};
        this.makeEditor = makeEditor;
    },

    onFocusOut: function(){
        var file = this.koFile();
        var filename = file.getFilename();
        var editor = this.editors[filename];
        var text = editor.getValue();
        file.setText(text);
    },

    onDoneReadFile: function($super, data) {
        $super(data);

        var file = this.koFile();
        var filename = file.getFilename();
        var text = file.getText();
        if (!this.editors[filename]) {
            var editor = this.makeEditor(text);
            this.editors[filename] = editor;
            editor.on('blur', this.onFocusOut.bind(this));
        }

        var editor = this.editors[filename];
        this.activeEditor(editor);
    },

    activeEditor: function(editor) {
        for (var name in this.editors) {
            this.editors[name].getWrapperElement().style.zIndex = -1;
        }

        editor.getWrapperElement().style.zIndex = 1;
    }
});
