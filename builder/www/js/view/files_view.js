var FilesView = Backbone.View.extend({
    template: '#file-list',
    events: {
        'click li a': 'selectFile' 
    },
    initialize: function(options) {
        this.template = options.template || this.template;
        this.collection.on('reset', this.render.bind(this)); 
        appModel.on('change:project', this.changeProject.bind(this));
    },
    changeProject: function(appModel) {
        this.collection.setProject(appModel.get('project'));
        this.collection.fetch();
    },
    render: function() {
        var $ul = this.$el.find('ul').last();

        $ul.children().remove();
        var collection = this.collection;
        var model;
        var template = $(this.template).html();
        for (var i = 0; i < collection.length; i++) {
            model = collection.at(i);
            $ul.append(_.template(template, {name: model.get('name'), id: model.get('id')}));
        }

        $ul.listFilter(this.$el.find('.search-box input, .search-box-input'));
    },
    selectFile: function(e) {
        this.$('.active').removeClass('active');
        var $target = $(e.target);
        $target.parent().addClass('active');
        var file = $target.attr('data-id');
        this.collection.selectFile(file);
    }
});
