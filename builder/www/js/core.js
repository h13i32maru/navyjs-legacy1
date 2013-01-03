Builder.Core = nClass({
    CLASS: 'Core',
    target: '',
    type: '',
    $el: null,
    project: null,
    textChanged: false,
    filename: '',

    initialize: function() {
        this.$el = $(this.target);
        this.filenames = ko.observableArray([]);
        this.text = ko.observable();
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    show: function() {
        this.$el.show();
    },

    hide: function() {
        this.$el.hide();
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = Builder.Util.format('/%s/%s', [project, this.type]);
        Builder.Util.read(path, this.onReadFilenames.bind(this));
    },

    onReadFilenames: function(data) {
        this.filenames(data);
    },

    onChangeText: function(vm, ev) {
        this.textChanged = true;
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
        var path = Builder.Util.format('/%s/%s/%s', [this.project, this.type, this.filename]);
        Builder.Util.read(path, function(data){
            this.text(data.content);
        }.bind(this));
    },

    save: function() {
        var path = Builder.Util.format('/%s/%s/%s', [this.project, this.type, this.filename]);
        Builder.Util.write(path, this.text(), function(data){
            this.textChanged = false;
        }.bind(this));
    }
});
