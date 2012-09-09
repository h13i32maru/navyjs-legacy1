var ConfFileListView = Backbone.View.extend({
    el: '#bs-conf-file-list',
    events: {
        'click li a': 'selectFile' 
    },
    initialize: function(options) {
        this.appModel = options.appModel;

        this.collection.on('reset', this.render.bind(this)); 
        this.appModel.on('change:project', this.changeProject.bind(this));
    },
    changeProject: function(appModel) {
        this.collection.bsFetch();
    },
    render: function() {
        this.$el.children().remove();
        var collection = this.collection;
        var model;
        var template = $('#file-list').html();
        for (var i = 0; i < collection.length; i++) {
            model = collection.at(i);
            this.$el.append(_.template(template, {name: model.get('file')}));
        }
    },
    selectFile: function(e) {
        this.$('.active').removeClass('active');
        var $target = $(e.target);
        $target.parent().addClass('active');
        var file = $target.text();
        this.collection.selectFile(file);
    }
});
