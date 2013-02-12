Builder.Core = nClass({
    CLASS: 'Core',
    type: '',
    project: null,

    koRawText: null,
    koFile: null,
    koFiles: null,

    initialize: function() {
        this.initObservable();
    },

    initObservable: function() {
        this.koRawText = ko.observable('');
        this.koFile = ko.observable(new Builder.File('', null));
        this.koFiles = ko.observableArray([]);
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
        var file = this.koFile();
        file.setText(text);
        this.koFile(file);

        this.koRawText(text);
    },

    onClickSave: function(key, ev) {
        var filename = ev.$trigger.text();
        var file = this._findFile(filename);
        this._saveFile(file);
    },

    onDoneSave: function(file) {
        file.changed(false);
    },

    onClickSaveRawText: function(ev) {
      var file = this.koFile();
      file.setText(this.koRawText());
      this._saveFile(file);
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
