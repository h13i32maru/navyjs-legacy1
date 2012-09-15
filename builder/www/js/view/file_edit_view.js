var FileEditView = Backbone.View.extend({
    currentFile: null,
    initialize: function(options) {
        appModel.on('change:project', this.changeProject.bind(this));
        this.collection.on('change:file', this.changeFile.bind(this));
    },
    setContent: function(fileModel){
    },
    changeProject: function(){
        this.$('textarea').val('');
    },
    changeFile: function(fileModel){
        this.currentFile = fileModel;
        this.$('textarea').val(fileModel.get('content'));
    }
});
