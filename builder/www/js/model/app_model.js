var appModel = new (Backbone.Model.extend({
    init: function(){
        var projects = new FileCollection('/data');
        new ProjectsView({collection: projects, appModel: this});

        var confs = new FileCollection('/data/{project}/conf');
        new ConfsView({collection: confs, appModel: this});
        new ConfEditView({collection: confs, appModel: this});
    }
}))();

$(appModel.init.bind(appModel));
