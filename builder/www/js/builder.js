var read = function(path, callback) {
    var params = {method: 'get', path: path};
    $.getJSON('/data', params, callback);
}

var format = function(str, arg) {
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
        }.bind(this));
    },

    switchContent: function(vm, ev){
        var $button = $(ev.srcElement);
        $button.siblings().removeClass('active');
        $button.addClass('active');

        var contentClass = $(ev.srcElement).attr('data-content-class');
        $('.n-content').hide();
        $(contentClass).show();
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
        var $target = $(ev.srcElement);
        $target.siblings().removeClass('active');
        $target.addClass('active');
        var filename = $target.text();
        var path = format('/%s/config/%s', [this.project, filename]);
        read(path, function(data){
            this.$el.find('textarea').val(data.content);
        }.bind(this));
    }
};

var Code = {
    $el: null,
    files: ko.observableArray([]),
    project: null,

    init: function(){
        this.$el = $('.n-code');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    onChangeProject: function(){
        var project = Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = format('/%s/code', [project]);
        read(path, function(data){
            this.files(data);
        }.bind(this));
    },

    readFile: function(data, ev){
        var $target = $(ev.srcElement);
        $target.siblings().removeClass('active');
        $target.addClass('active');
        var filename = $target.text();
        var path = format('/%s/code/%s', [this.project, filename]);
        read(path, function(data){
            this.$el.find('textarea').val(data.content);
        }.bind(this));
    }
};

var Image = {
    $el: null,
    files: ko.observableArray([]),
    project: null,

    init: function(){
        this.$el = $('.n-image');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    onChangeProject: function(){
        var project = Header.selectedProject();
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


$(function(){
    Header.init();
    Config.init();
    Code.init();
    Image.init();
});
