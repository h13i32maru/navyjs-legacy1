Navy._builder_ = true;

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

        $.get('/data', this.onLoadedProjects.bind(this), 'json');
    },
    onLoadedProjects: function(data){
        this.setProjects(data.content);
    },
    setProjects: function(projects){
        var $ul = this.$el.find('#bs-project-menu');
        var template = $('#file-list').html();
        for(var i = 0; i < projects.length; i++){
            var project = projects[i];
            $ul.append(_.template(template, {name: project.name, id: project.id}));
        }
    },
    onSelectProject: function(ev){
        var project = $(ev.target).text();
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

NL.App.push('LayoutCanvasView', NL.View.subclass({
    initialize: function($super) {
        $super();
        this.$el = $('#bs-layout-canvas');
        //iPhone4Sのサイズを基本としている
        var width = 640 * this.$el.height() / 960;
        this.$el.width(width);
        $.fitsize();

        NL.Event.on('selectProject', this.onSelectProject.bind(this));
    },
    onSelectProject: function(data){
        var project = data.project;
        Navy._builder_ = {
            parentElm: this.$el[0],
            urlPrefix: 'raw/' + project + '/'
        };
        Navy._builder_.parentElm.innerHTML = '';
        Navy.App.initForBuilder();
    }
}));
