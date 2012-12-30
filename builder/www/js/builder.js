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

    toggle: function(vm, ev){
        var $button = $(ev.srcElement);
        $button.siblings().removeClass('active');
        $button.addClass('active');

        var cssClass = $(ev.srcElement).attr('data-toggle');
        $(cssClass).siblings().not(this.$el).hide();
        $(cssClass).show();
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

var Layout = {
    $el: null,
    files: ko.observableArray([]),
    project: null,
    
    init: function(){
        this.$el = $('.n-layout');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));

        var $target = this.$el.find('.n-canvas').first();
        var appWidth = 640;
        var appHeight = 960;

        var appWidth = 960;
        var appHeight = 640;

        var cssMaxWidth = parseInt($target.css('max-width'), 10);
        var cssWidth = parseInt($target.css('width'), 10);
        var maxWidth = Math.min(cssMaxWidth, cssWidth);
        var maxHeight = parseInt($target.css('height'), 10);
        var scaleWidth = maxWidth / appWidth;
        var scaleHeight = maxHeight / appHeight;
        var scale = Math.min(scaleWidth, scaleHeight);
        var width = Math.floor(scale * appWidth);
        var height = Math.floor(scale * appHeight);

        this.$el.find('.n-pane, .btn-group').css('margin-left', (width + 10) + 'px');
        $.fitsize();

        $target.css({width: width + 'px', height: height + 'px'});

        //iPhone4Sのサイズを基本としている
        //var width = 640 * this.$el.height() / 960;
        //this.$el.find('.n-canvas').width(width);
    },

    toggle: function(vm, ev) {
        var $button = $(ev.srcElement);
        $button.siblings().removeClass('active');
        $button.addClass('active');

        var cssClass = $(ev.srcElement).attr('data-toggle');
        this.$el.find(cssClass).siblings().hide();
        this.$el.find(cssClass).show();
    },

    onChangeProject: function(){
        var project = Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = format('/%s/layout', [project]);
        read(path, function(data){
            this.files(data);
        }.bind(this));
    },

    readFile: function(data, ev){
        var $target = $(ev.srcElement);
        $target.siblings().removeClass('active');
        $target.addClass('active');
        var filename = $target.text();
        var path = format('/%s/layout/%s', [this.project, filename]);
        read(path, function(data){
            this.$el.find('textarea').val(data.content);
        }.bind(this));
    }
};

Layout.propBasic = ko.observableArray([
    {name: 'id', title: '"str"'},
    {name: 'pos', title: '[x, y]'},
    {name: 'size', title: '[width, height]'},
    {name: 'padding', title: 'num'},
    {name: 'paddings', title: '[top, right, bottom, left]'}
]);

Layout.propBackground = ko.observableArray([
    {name: 'src', title: '"image/foo.png"'},
    {name: 'color', title: '"#001122"'},
    {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"'},
    {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]'},
    {name: 'radius', title: 'num'},
    {name: 'radiuses', title: '[top, right, bottom, left]'}
]);

Layout.propBorder = ko.observableArray([
    {name: 'width', title: 'num'},
    {name: 'widths', title: '[top, right, bottom, left]'},
    {name: 'color', title: '"#001122"'},
    {name: 'colors', title: '[top, right, bottom, left]'},
    {name: 'radius', title: 'num'},
    {name: 'radiuses', title: '[top, right, bottom, left]'},
    {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"'},
    {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]'},
    {name: 'gradient-top-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"'},
    {name: 'gradient-top-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]'},
    {name: 'gradient-right-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"'},
    {name: 'gradient-right-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]'},
    {name: 'gradient-bottom-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"'},
    {name: 'gradient-bottom-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]'},
    {name: 'gradient-left-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"'},
    {name: 'gradient-left-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]'}
]);

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
    Layout.init();
    Code.init();
    Image.init();
});
