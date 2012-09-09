var FileCollection = Backbone.Collection.extend({
    urlRoot: 'list',
    model: JsonFileModel,
    currentFile: null,
    setType: function(type) {
        this.bsType = type;
    },
    url: function() {
        return this.urlRoot;
    },
    bsFetch: function() {
        this.fetch({
            data:{
                project: appModel.get('project'),
                file_type: this.bsType
            }
        });
    },
    selectFile: function(name) {
        var model = this.find(function(fileModel){ return fileModel.get('name') === name; });
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
