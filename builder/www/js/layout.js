Builder.Layout = {
    $el: null,
    files: ko.observableArray([]),
    project: null,
    view: null,
    
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

    show: function() {
        this.$el.show();
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
        this.view = null;
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

    layoutToInput: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            var value = recursiveRead(layout, prefix + prop.name);
            var valueText = JSON.stringify(value);
            prop.value(valueText);
        }
    },

    inputToLayout: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            var key = prop.name;
            var valueText = prop.value();
            if (valueText === undefined) { continue; }
            var value = JSON.parse(valueText);
            recursiveWrite(layout, prefix + key, value);
        }
    },

    onSelectedNavyView: function(view){
        this.view = view;
        var layout = view.getLayout();
        console.log(layout);

        this.propClass(JSON.stringify(layout['class']));
        this.layoutToInput('', layout, this.propBasic());
        this.layoutToInput('background-', layout, this.propBackground());
        this.layoutToInput('border-', layout, this.propBorder());
    },

    onMoveNavyView: function(view) {
    },

    onKeyUp: function(vm, ev) {
        if (ev.keyCode === 13) {
            this.setNewLayoutToView();
        }
    },

    setNewLayoutToView: function() {
        if (!this.view) {
            return;
        }

        var view = this.view;
        var layout = this.buildLayout();
        console.log(layout);
        Navy.Builder.setLayout(view, layout);
    },

    buildLayout: function() {
        var layout = {};

        layout['class'] = JSON.parse(this.propClass());
        this.inputToLayout('', layout, this.propBasic());
        this.inputToLayout('background-', layout, this.propBackground());
        this.inputToLayout('border-', layout, this.propBorder());

        return layout;
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

