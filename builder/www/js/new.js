Navy.Builder.setEnable(true);

$(NL.App.init.bind(NL.App));

NL.App.push('Dummy', NL.View.subclass({
    initialize: function($super){
        $super();
        this.insertTemplate();
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
}));

NL.App.push('ProjectView', NL.View.subclass({
    initialize: function($super){
        $super();
        this.$el = $('#bs-project');
        this.$el.on('click', '#bs-project-menu li a', this.onSelectProject.bind(this));
        this.$el.on('change', '#bs-project-menu', this.onSelectProject.bind(this));

        $.get('/data', this.onLoadedProjects.bind(this), 'json');
    },
    onLoadedProjects: function(data){
        this.setProjects(data.content);
    },
    setProjects: function(projects){
        var $projects = this.$el.find('#bs-project-menu');
        var template = $('#project-list').html();
        for(var i = 0; i < projects.length; i++){
            var project = projects[i];
            $projects.append(_.template(template, {name: project.name, id: project.id}));
        }
    },
    onSelectProject: function(ev){
        var project = $(ev.target).val();
        NL.Event.trigger('selectProject', {project: project}, this);
    }
}));

NL.App.push('ContentTabView', NL.View.subclass({
    initialize: function($super){
        $super();
        this.$el = $('#bs-content-tabs');
        this.selectTab(this.$el.find('#bs-content-tab-layout'));
        this.$el.on('click', '#bs-content-tabs-buttons li a', this.onSelectTab.bind(this));
    },
    onSelectTab: function(ev){
        this.selectTab(ev.target);
    },
    selectTab: function(elm) {
        var $target = $(elm);
        this.$el.find('#bs-content-tabs-buttons li.active').removeClass('active');
        $target.parent().addClass('active');

        var $tab_content = $($target.attr('href'));
        this.$el.find('>.tab-content > .tab-pane').removeClass('visible');
        $tab_content.addClass('visible');

        $.fitsize();
    }
}));

var SimpleFileView = NL.View.subclass({
    initialize: function($super, elmId, type, fileListSel, template){
        $super();
        this.$el = $(elmId);
        this.type = type;
        this.template = template;
        this.$fileList = this.$el.find(fileListSel);

        NL.Event.on('selectProject', this.onSelectProject.bind(this));

        this.$fileList.on('click', 'li a', this.onSelectFile.bind(this));
    },
    onSelectProject: function(data){
        this.$fileList.empty();

        this.project = data.project;
        var url = this.format('/data/{project}/{type}', {project: this.project, type: this.type});
        $.get(url, this.onLoadedFiles.bind(this), 'json');
    },
    onLoadedFiles: function(data){
        this.setFiles(data.content);
    },
    setFiles: function(files){
        var $ul = this.$fileList;
        var template = $(this.template).html();
        for(var i = 0; i < files.length; i++){
            var file = files[i];
            $ul.append(_.template(template, {name: file.name, id: file.id}));
        }
    },
    onSelectFile: function(ev){
        this.$fileList.find('li.active').removeClass('active');

        var $target = $(ev.target);
        $target.parent().addClass('active');
        var file = $target.text();

        var url = this.format('/data/{project}/{type}/{file}', {project: this.project, type: this.type, file: file});
        $.get(url, this.onLoadedFile.bind(this), 'json');
    },
    onLoadedFile: function(data){
        this.setFile(data.content);
    },
    setFile: function(str){
        this.$el.find('textarea').val(str);
    }
});

NL.App.push('ConfigView', SimpleFileView.subclass({
    initialize: function($super){
        $super('#bs-conf-file-edit', 'config', '.bs-file-list ul', '#file-list');
    }
}));

NL.App.push('CodeView', SimpleFileView.subclass({
    initialize: function($super){
        $super('#bs-code-file-edit', 'code', '.bs-file-list ul', '#file-list');
    }
}));

NL.App.push('ImageView', SimpleFileView.subclass({
    initialize: function($super){
        $super('#bs-image-file-list', 'image', '.bs-image-list', '#image-list');
    }
}));

NL.App.push('LayoutView', SimpleFileView.subclass({
    initialize: function($super){
        $super('#bs-layout-file-edit', 'layout', '.bs-file-list ul', '#file-list');
    },
    onSelectFile: function($super, ev){
        $super(ev);
        var file = $(ev.target).text();
        var url = 'layout/' + file;
        Navy.Screen.showLayout(url);
    }
}));

NL.App.push('LayoutPropView', NL.View.subclass({
    initialize: function($super){
        $super();
        this.$el = $('#bs-layout-edit-prop');

        this.$el.on('focusout', 'input[type="text"]', this.onRequestNewLayout.bind(this));
        this.$el.on('keyup', 'input[type="text"]', this.onRequestNewLayout.bind(this));

        NL.Event.on('selectedNavyView', this.onSelectedNavyView.bind(this));
        NL.Event.on('moveNavyView', this.onMoveNavyView.bind(this));
    },
    onMoveNavyView: function(data) {
        this.setValue('pos', data);
    },
    onSelectedNavyView: function(data) {
        var layout = data.layout;
        var view = data.view;

        console.log(layout);

        this.$el.find('#prop-class').val(JSON.stringify(view.getClass()));
        this.$el.find('#prop-pos').val(JSON.stringify(view.getPosition()));

        this.setValue('id', layout);
        //this.setValue('pos', layout);
        this.setValue('size', layout);
        this.setValue('padding', layout);
        this.setValue('paddings', layout);
        this.setValue('z', layout);

        this.setValue('background-src', layout);
        this.setValue('background-color', layout);
        this.setValue('background-gradient-direction', layout);
        this.setValue('background-gradient-colorstop', layout);
        this.setValue('background-radius', layout);
        this.setValue('background-radiuses', layout);

        this.setValue('border-width', layout);
        this.setValue('border-widths', layout);
        this.setValue('border-color', layout);
        this.setValue('border-colors', layout);
        this.setValue('border-radius', layout);
        this.setValue('border-radiuses', layout);
        this.setValue('border-gradient-direction', layout);
        this.setValue('border-gradient-colorstop', layout);
        this.setValue('border-gradients-0-direction', layout);
        this.setValue('border-gradients-0-colorstop', layout);
        this.setValue('border-gradients-1-direction', layout);
        this.setValue('border-gradients-1-colorstop', layout);
        this.setValue('border-gradients-2-direction', layout);
        this.setValue('border-gradients-2-colorstop', layout);
        this.setValue('border-gradients-3-direction', layout);
        this.setValue('border-gradients-3-colorstop', layout);
    },
    setValue: function(elmId, layout) {
        var props = elmId.split('-');
        var value = layout;
        for (var i = 0; i < props.length; i++) {
            if (!value) { break; }
            value = value[props[i]];
        }
        value = JSON.stringify(value);
        var $el = this.$el.find('#prop-' + elmId);
        $el.val(value);
    },
    getValue: function(elmId, layout) {
        var $el = this.$el.find('#prop-' + elmId);
        var value = $el.val();
        if (value === '') {
            return;
        }

        var props = elmId.split('-');
        for (var i = 0; i < props.length - 1; i++) {
            if (!(props[i] in layout)) {
                layout[props[i]] = {};
            }

            layout = layout[props[i]];
        }

        var prop = props[props.length - 1];
        layout[prop] = JSON.parse(value);
    },
    onRequestNewLayout: function(ev) {
        if (ev.type === 'keyup') {
            if (ev.keyCode !== 13) {
                return;
            }
        }

        var id = this.$el.find('#prop-id').val();
        if (id === '') {
            id = null;
        } else {
            id = JSON.parse(id);
        }

        var layout = {};
        this.getValue('pos', layout);
        this.getValue('size', layout);
        this.getValue('padding', layout);
        this.getValue('paddings', layout);
        this.getValue('z', layout);

        this.getValue('background-src', layout);
        this.getValue('background-color', layout);
        this.getValue('background-gradient-direction', layout);
        this.getValue('background-gradient-colorstop', layout);
        this.getValue('background-radius', layout);
        this.getValue('background-radiuses', layout);

        this.getValue('border-width', layout);
        this.getValue('border-widths', layout);
        this.getValue('border-color', layout);
        this.getValue('border-colors', layout);
        this.getValue('border-radius', layout);
        this.getValue('border-radiuses', layout);
        this.getValue('border-gradient-direction', layout);
        this.getValue('border-gradient-colorstop', layout);
        this.getValue('border-gradients-0-direction', layout);
        this.getValue('border-gradients-0-colorstop', layout);
        this.getValue('border-gradients-1-direction', layout);
        this.getValue('border-gradients-1-colorstop', layout);
        this.getValue('border-gradients-2-direction', layout);
        this.getValue('border-gradients-2-colorstop', layout);
        this.getValue('border-gradients-3-direction', layout);
        this.getValue('border-gradients-3-colorstop', layout);

        NL.Event.trigger('requestNewLayout', {layout:layout, id:id}, this);
    }
}));

NL.App.push('LayoutCanvasView', NL.View.subclass({
    view: null,
    initialize: function($super) {
        $super();
        this.$el = $('#bs-layout-canvas');
        //iPhone4Sのサイズを基本としている
        var width = 640 * this.$el.height() / 960;
        this.$el.width(width);
        $.fitsize();

        NL.Event.on('selectProject', this.onSelectProject.bind(this));
        NL.Event.on('requestNewLayout', this.onRequestNewLayout.bind(this));

    },
    onSelectProject: function(data){
        var project = data.project;

        Navy.Builder.setCanvasParentElement(this.$el[0]);
        Navy.Builder.setUrlPrefix('raw/' + project + '/');
        Navy.Builder.setSelectedViewListener(this.onSelectedNavyView.bind(this));
        Navy.Builder.setMoveViewListener(this.onMoveNavyView.bind(this));
        Navy.Builder.init();
    },
    onSelectedNavyView: function(view){
        this.view = view;
        var layout = view.getLayout();
        NL.Event.trigger('selectedNavyView', {layout:layout, view: view}, this);
    },
    onMoveNavyView: function(view) {
        NL.Event.trigger('moveNavyView', {pos: view.getPosition()}, this);
    },
    onRequestNewLayout: function(data) {
        var layout = data.layout;
        console.log(data);
        this.view._initLayout();
        this.view._setLayout(layout);
        //TODO:setId()する
    }
}));
