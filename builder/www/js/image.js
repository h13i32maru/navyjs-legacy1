Builder.Image = {
    $el: null,
    files: ko.observableArray([]),
    project: null,

    init: function(){
        this.$el = $('.n-image');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    show: function() {
        this.$el.show();
    },

    save: function() {
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = format('/%s/image', [project]);
        read(path, function(data){
            var sources = [];
            for (var i = 0; i < data.length; i++) {
                var src = format('/data/%s/image/%s', [this.project, data[i]]);
                sources.push(src);
            }
            this.files(sources);
        }.bind(this));
    }
};
