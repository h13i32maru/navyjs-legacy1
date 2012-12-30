Builder = {};

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

var recursive = function(obj, key) {
    var keys = key.split('-');
    var value = obj;
    for (var i = 0; i < keys.length; i++) {
        value = value[keys[i]];
        if (value === undefined) {
            break;
        }
    }
    return value;
}

Builder.Header = {
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

Builder.Config = {
    $el: null,
    files: ko.observableArray([]),
    project: null,
    
    init: function(){
        this.$el = $('.n-config');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
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

Builder.Layout = {
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
        var project = Builder.Header.selectedProject();
        this.project = project;
        if (!project) {
            return;
        }

        var path = format('/%s/layout', [project]);
        read(path, function(data){
            this.files(data);
        }.bind(this));

        Navy.Builder.setCanvasParentElement(this.$el.find('.n-canvas')[0]);
        Navy.Builder.setUrlPrefix('data/' + project + '/');
        Navy.Builder.setSelectedViewListener(this.onSelectedNavyView.bind(this));
        Navy.Builder.setMoveViewListener(this.onMoveNavyView.bind(this));
        Navy.Builder.init();
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

        var url = 'layout/' + filename;
        Navy.Screen.showLayout(url);
    },

    setProp: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            var value = recursive(layout, prefix + prop.name);
            var valueText = JSON.stringify(value);
            prop.value(valueText);
        }
    },

    onSelectedNavyView: function(view){
        var layout = view.getLayout();
        console.log(layout);

        this.propClass(layout['class']);
        this.setProp('', layout, this.propBasic());
        this.setProp('background-', layout, this.propBackground());
        this.setProp('border-', layout, this.propBorder());
    },

    onMoveNavyView: function(view) {
    }
};

Builder.Layout.propClass = ko.observable();
Builder.Layout.propBasic = ko.observableArray([
    {name: 'id', title: '"str"', value: ko.observable()},
    {name: 'pos', title: '[x, y]', value: ko.observable()},
    {name: 'size', title: '[width, height]', value: ko.observable()},
    {name: 'padding', title: 'num', value: ko.observable()},
    {name: 'paddings', title: '[top, right, bottom, left]', value: ko.observable()}
]);

Builder.Layout.propBackground = ko.observableArray([
    {name: 'src', title: '"image/foo.png"', value: ko.observable()},
    {name: 'color', title: '"#001122"', value: ko.observable()},
    {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
    {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
    {name: 'radius', title: 'num', value: ko.observable()},
    {name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()}
]);

Builder.Layout.propBorder = ko.observableArray([
    {name: 'width', title: 'num', value: ko.observable()},
    {name: 'widths', title: '[top, right, bottom, left]', value: ko.observable()},
    {name: 'color', title: '"#001122"', value: ko.observable()},
    {name: 'colors', title: '[top, right, bottom, left]', value: ko.observable()},
    {name: 'radius', title: 'num', value: ko.observable()},
    {name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()},
    {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
    {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
    {name: 'gradients-0-direction', title: 'top', value: ko.observable()},
    {name: 'gradients-0-colorstop', title: 'top', value: ko.observable()},
    {name: 'gradients-1-direction', title: 'right', value: ko.observable()},
    {name: 'gradients-1-colorstop', title: 'right', value: ko.observable()},
    {name: 'gradients-2-direction', title: 'bottom', value: ko.observable()},
    {name: 'gradients-2-colorstop', title: 'bottom', value: ko.observable()},
    {name: 'gradients-3-direction', title: 'left', value: ko.observable()},
    {name: 'gradients-3-colorstop', title: 'left', value: ko.observable()}
]);

Builder.Code = {
    $el: null,
    files: ko.observableArray([]),
    project: null,

    init: function(){
        this.$el = $('.n-code');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
    },

    onChangeProject: function(){
        var project = Builder.Header.selectedProject();
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

Builder.Image = {
    $el: null,
    files: ko.observableArray([]),
    project: null,

    init: function(){
        this.$el = $('.n-image');
        ko.applyBindings(this, this.$el[0]);
        ko.computed(this.onChangeProject.bind(this));
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

$(function(){
    $.fitsize();
    Navy.App.wakeup();

    Builder.Header.init();
    Builder.Config.init();
    Builder.Layout.init();
    Builder.Code.init();
    Builder.Image.init();
});
