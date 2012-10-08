var FileCollection = Backbone.Collection.extend({
    model: null,
    project: null,
    initialize: function(id, model) {
        this.urlRoot = id;
        this.model = model;
    },
    setProject: function(project) {
        this.project = project;
    },
    url: function() {
        return this.urlRoot.replace('{project}', this.project);
    },
    parse: function(response) {
        return response.content
    },
    selectFile: function(id) {
        var model = this.find(function(fileModel){ return fileModel.get('id') === id; });
        if (!model) {
            return;
        }

        if (this.current) {
            this.currentFile.off('change');
        }

        this.currentFile = model;
        model.bind('change', this.fileOnChange.bind(this));
        model.fetch();
    },
    fileOnChange: function(fileModel){
        this.trigger('change:file', this.currentFile);
    }
});
