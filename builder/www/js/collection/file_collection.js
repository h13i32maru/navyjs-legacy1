var FileCollection = Backbone.Collection.extend({
    urlRoot: 'list',
    model: JsonFileModel,
    currentFile: null,
    setType: function(type) {
        this.bsType = type;
    },
    url: function() {
        return this.urlRoot + '/' + this.bsType;
    },
    bsFetch: function() {
        this.fetch({project: appModel.get('project')});
    },
    selectFile: function(file) {
        var model = this.find(function(fileModel){ return fileModel.get('file') === file; });
        if (!model) {
            return;
        }

        if (this.current) {
            this.currentFile.off('change');
        }

        this.currentFile = model;
        model.bind('change', this.fileContentOnChange.bind(this));
        model.bsFetch();
    },
    fileContentOnChange: function(fileModel){
        this.trigger('change:file', this.currentFile);
    }
});
