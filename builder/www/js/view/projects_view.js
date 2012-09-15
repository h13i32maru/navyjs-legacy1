var ProjectsView = Backbone.View.extend({
    el: '#bs-project',
    events: {
        'click #bs-project-menu li a': 'selectProject'
    },
    initialize: function(options) {
        this.collection.on('reset', this.render.bind(this));
        this.collection.fetch();
    },
    render: function(){
        var template = $('#file-list').html();
        var $target = this.$('#bs-project-menu');
        this.collection.each(function(fileModel){
            $target.append(_.template(template, {id: fileModel.get('id'), name: fileModel.get('name')}));
        }.bind(this));
    },
    selectProject: function(e){
        var id = $(e.target).attr('data-id');
        var project = $(e.target).text();
        this.$('#bs-current-project').text(project);
        this.$('#bs-project-menu li.active').removeClass('active');
        this.$('#bs-project-menu li a').filter(function(index){ return $(this).attr('data-id') === id; }).parent().addClass('active');
        appModel.set('project', project);
    }
});
