var appModel = new (Backbone.Model.extend({
    init: function(){
        var contentTabsView = new ContentTabsView();

        // project
        var projects = new FileCollection('/data');
        new ProjectsView({collection: projects, appModel: this});

        // conf
        var confs = new FileCollection('/data/{project}/conf');
        new FilesView({collection: confs, el: '#bs-conf-file-list'});
        new FileEditView({collection: confs, el: '#bs-conf-file-edit'});

        // code
        var codes = new FileCollection('/data/{project}/code');
        new FilesView({collection: codes, el: '#bs-code-file-list'});
        new FileEditView({collection: codes, el: '#bs-code-file-edit'});
    }
}))();

$(appModel.init.bind(appModel));
