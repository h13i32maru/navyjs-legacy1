Builder.Code = {
    $el: null,
    filenames: ko.observableArray([]),
    project: null,
    filename: null,
    text: ko.observable(),
    textChanged: false,

    init: function(){
        this.$el = $('.n-code');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    show: function() {
        this.$el.show();
    },

    save: function() {
        var path = format('/%s/code/%s', [this.project, this.filename]);
        write(path, this.text(), function(data){
            this.textChanged = false;
        }.bind(this));
    },

    onChangeText: function(vm, ev) {
        this.textChanged = true;
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = format('/%s/code', [project]);
        read(path, function(data){
            this.filenames(data);
        }.bind(this));
    },

    readFile: function(data, ev){
        if (this.textChanged) {
            if (!confirm('Do you want to discard the changes?')) {
                return;
            }
        }

        this.textChanged = false;

        var $target = $(ev.srcElement);
        $target.siblings().removeClass('active');
        $target.addClass('active');

        this.filename = $target.text();
        var path = format('/%s/code/%s', [this.project, this.filename]);
        read(path, function(data){
            this.text(data.content);
        }.bind(this));
    }
};
