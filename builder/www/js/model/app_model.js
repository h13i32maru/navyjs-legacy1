Navy._builder_ = true;

var appModel = new (Backbone.Model.extend({
    doneTemplate: false,
    initialize: function(){
        this.on('change', this.changeProject.bind(this));
    },
    changeProject: function(){
        Navy._builder_ = {
            parentElm: document.getElementById('bs-layout-canvas'),
            urlPrefix: 'raw/' + this.get('project') + '/'
        };
        Navy._builder_.parentElm.innerHTML = '';
        Navy.App.initForBuilder();
    },
    insertTemplate: function(){
        if (this.doneTemplate){
            return;
        }

        $.ajaxSetup({async: false});
        $('[data-template-src]').each(function(index, elm){
            var src = $(this).attr('data-template-src');
            $(this).load(src);
        });
        $.ajaxSetup({async: true});

        this.doneTemplate = true;
    },
    init: function(){
        this.insertTemplate();
        new ContentTabsView();
        new LayoutCanvasView();
        $.fitsize();
        new LayoutEditView();
        new LayoutPickView();

        // project
        var projects = new FileCollection('/data', TextFileModel);
        new ProjectsView({collection: projects, appModel: this});

        // conf
        var confs = new FileCollection('/data/{project}/config', JsonFileModel);
        new FilesView({collection: confs, el: '#bs-conf-file-list'});
        new FileEditView({collection: confs, el: '#bs-conf-file-edit'});

        // layout
        var layouts = new FileCollection('/data/{project}/layout', JsonFileModel);
        new FilesView({collection: layouts, el: '#bs-layout-file-list'});
        new FileEditView({collection: layouts, el: '#bs-layout-file-edit'});

        // code
        var codes = new FileCollection('/data/{project}/code', JsFileModel);
        new FilesView({collection: codes, el: '#bs-code-file-list'});
        new FileEditView({collection: codes, el: '#bs-code-file-edit'});

        // image
        var images = new FileCollection('/data/{project}/image', ImageFileModel);
        new FilesView({collection: images, el: '#bs-image-file-list', template: '#image-list'});
    }
}))();

$(appModel.init.bind(appModel));
