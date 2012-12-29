var read = function(path, callback) {
    var params = {path: path};
    $.getJSON('/data', params, callback);
}

var format = function(str, arg) {
    console.log(arg);
    for (var i = 0; i < arg.length; i++) {
        str = str.replace('%s', arg[i]);
    }
    return str;
}

var Header = {
    $el: null,
    projects: ko.observableArray(),
    selectedProject: ko.observable(),

    init: function(){
        this.$el = $('.n-header');
        ko.applyBindings(this, this.$el[0]);

        read('/', function(data){
            this.projects(data);
        });
    }
};

var Config = {
    $el: null,
    files: ko.observableArray([]),
    project: null,
    
    init: function(){
        this.$el = $('.n-config');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    onChangeProject: function(){
        var project = Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = format('/%s/config', [project]);
        read(path, function(data){
            this.files(data);
        }.bind(this));
    },

    readFile: function(data, ev){
        var path = format('/%s/config/%s', [this.project, data]);
        read(path, function(data){
            this.$el.find('textarea').val(data.content);
        }.bind(this));
    }
};


$(function(){
    Header.init();
    Config.init();
});
