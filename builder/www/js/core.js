Builder.Core2 = nClass({
    CLASS: 'Core',
    type: '',
    project: null,

    koFile: null,
    koFiles: null,
    koVisible: null,

    initialize: function() {
        this.initObservable();
    },

    initObservable: function() {
        this.koFile = ko.observable(new Builder.File('', null));
        this.koFiles = ko.observableArray([]);
        this.koVisible = ko.observable(false);
        ko.computed(this.onChangeProject.bind(this));
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = Builder.Util.format('/%s/%s', [project, this.type]);
        Builder.Util.read(path, this.onDoneReadFilenames.bind(this));
    },

    onDoneReadFilenames: function(filenames) {
        var files = [];
        var file;
        for (var i = 0; i < filenames.length; i++) {
            file = new Builder.File(filenames[i], null);
            files.push(file);
        }
        this.koFiles(files);
    },

    onClickFile: function(file) {
        this._readFile(file);
    },

    onDoneReadFile: function(data) {
        var text = data.content;
        this.koFile().setText(text);
    },

    onClickSave: function(key, ev) {
        var filename = ev.$trigger.text();
        var file = this._findFile(filename);
        this._saveFile(file);
    },

    onDoneSave: function(file) {
        file.changed(false);
    },

    _select: function(file) {
        var files = this.koFiles();
        for (var i = 0; i < files.length; i++) {
            files[i].selected(false);
        }

        file.selected(true);
        this.koFile(file);
    },

    _findFile: function(filename) {
        var files = this.koFiles();
        for (var i = 0; i < files.length; i++) {
            if (files[i].getFilename() === filename) {
                return files[i];
            }
        }
        return null;
    },

    _readFile: function(file){
        this._select(file);
        
        if (file.changed()) {
            var text = file.getText();
            this.onDoneReadFile({content: text});
        } else {
            var path = Builder.Util.format('/%s/%s/%s', [this.project, this.type, file.getFilename()]);
            Builder.Util.read(path, this.onDoneReadFile.bind(this));
        }
    },

    _saveFile: function(file) {
        if (file.getText() === null) {
            return;
        }

        var filename = file.getFilename();
        var text = file.getText();
        var path = Builder.Util.format('/%s/%s/%s', [this.project, this.type, filename]);
        Builder.Util.write(path, text, this.onDoneSave.bind(this, file));
    }
});
Builder.Core = nClass({
    CLASS: 'Core',
    target: '',
    type: '',
    $el: null,
    project: null,
    filename: '',
    editor: null,

    initialize: function() {
        this.$el = $(this.target);
        this.filenames = ko.observableArray([]);
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));

        this.editor = this.setUpCodeMirror();
    },

    setUpCodeMirror: function() {
        $textarea = this.$el.find('textarea');
        if ($textarea.size() < 1) { return null; }

        var top = $textarea.css('top');
        var left = $textarea.css('left');
        var width = $textarea.css('width');
        var height = $textarea.css('height');
        $textarea.hide();

        var editor = CodeMirror.fromTextArea($textarea[0], {lineNumbers: true, mode: 'javascript', keyMap: 'vim'});
        var editorElm = editor.getWrapperElement();
        editorElm.style.top = top;
        editorElm.style.left = left;
        editorElm.style.width = width;
        editorElm.style.height = height;

        return editor;
    },

    show: function() {
        this.$el.show();
    },

    hide: function() {
        this.$el.hide();
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = Builder.Util.format('/%s/%s', [project, this.type]);
        Builder.Util.read(path, this.onReadFilenames.bind(this));
    },

    onReadFilenames: function(data) {
        this.filenames(data);
    },

    onClickFile: function(vm, ev) {
        var el = ev.srcElement;
        this.readFile(el);
    },

    readFile: function(target){
        var $target = $(target);
        $target.siblings().removeClass('active');
        $target.addClass('active');

        this.filename = $target.text();
        var path = Builder.Util.format('/%s/%s/%s', [this.project, this.type, this.filename]);
        Builder.Util.read(path, function(data){
            this.setText(data.content);
        }.bind(this));
    },

    save: function() {
        var text = this.getText();
        var path = Builder.Util.format('/%s/%s/%s', [this.project, this.type, this.filename]);
        Builder.Util.write(path, text, function(data){
            this.textChanged = false;
        }.bind(this));
    },

    getText: function() {
        return this.editor.getValue();
    },

    setText: function(text) {
        this.editor.setValue(text);
    }
});
