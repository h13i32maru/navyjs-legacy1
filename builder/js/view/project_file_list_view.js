var ProjectFileListView = Backbone.View.extend({
    el: '#bs-project',
    events: {
        'click #bs-project-menu li a': 'selectProject'
    },
    initialize: function(options) {
        this.appModel = options.appModel;
        this.collection.on('reset', this.render.bind(this));
        this.collection.bsFetch();
    },
    changeProject: function(appModel){
    },
    render: function(){
        var template = $('#file-list').html();
        var $target = this.$('#bs-project-menu');
        this.collection.each(function(fileModel){
            $target.append(_.template(template, {name: fileModel.get('file')}));
        }.bind(this));
    },
    selectProject: function(e){
        var project = $(e.target).text();
        this.$('#bs-current-project').text(project);
        this.$('#bs-project-menu li.active').removeClass('active');
        this.$('#bs-project-menu li a').filter(function(index){ return $(this).text() === project; }).parent().addClass('active');
        this.appModel.set('project', project);
    }
});
