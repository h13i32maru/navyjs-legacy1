var appModel = new (Backbone.Model.extend({
    init: function(){
        var projectFileCollection = new ProjectFileCollection();
        new ProjectFileListView({collection: projectFileCollection, appModel: this});

        var confFileCollection = new FileCollection();
        confFileCollection.setType('conf');
        new ConfFileListView({collection: confFileCollection, appModel: this});
        new ConfFileEditView({collection: confFileCollection, appModel: this});
    }
}))();

$(appModel.init.bind(appModel));
