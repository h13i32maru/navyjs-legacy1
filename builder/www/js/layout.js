Builder.Layout = nClass.instance(Builder.Core, {
    CLASS: 'Layout',
    target: '.n-layout',
    type: 'layout',
    view: null,
    
    initialize: function($super){
        this.initObservable();
        $super();

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

    onChangeProject: function($super){
        $super();
        if (!this.project) {
            return;
        }
        Navy.Builder.setCanvasParentElement(this.$el.find('.n-canvas')[0]);
        Navy.Builder.setUrlPrefix('data/' + this.project + '/');
        Navy.Builder.setSelectedViewListener(this.onSelectedNavyView.bind(this));
        Navy.Builder.setMoveViewListener(this.onMoveNavyView.bind(this));
        Navy.Builder.init();
    },

    readFile: function($super, data, ev){
        $super(data, ev);
        this.view = null;
        var url = 'layout/' + this.filename;
        Navy.Screen.showLayout(url);
        Navy.Builder.selectView(null);
    },

    layoutToInput: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (prop.separator) {
                continue;
            }

            var name = '';
            if (prefix) {
                name += prefix;
            }
            if (prop.prefix) {
                name += prop.prefix;
            }
            name += prop.name;

            var value = Builder.Util.recursiveRead(layout, name);
            var valueText = JSON.stringify(value);
            prop.value(valueText);
        }
    },

    inputToLayout: function(prefix, layout, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];

            if (prop.separator) {
                continue;
            }

            var name = '';
            if (prefix) {
                name += prefix;
            }
            if (prop.prefix) {
                name += prop.prefix;
            }

            name += prop.name;
            var valueText = prop.value();
            if (valueText === undefined) { continue; }
            var value = JSON.parse(valueText);
            Builder.Util.recursiveWrite(layout, name, value);
        }
    },

    onSelectedNavyView: function(view){
        this.view = view;
        var layout = view.getLayout();

        this.propClass(JSON.stringify(layout['class']));
        this.layoutToInput('', layout, this.propBasic());
        this.layoutToInput('background-', layout, this.propBackground());
        this.layoutToInput('border-', layout, this.propBorder());

        if (this.propExtra[layout['class']]) {
            this.layoutToInput('extra-', layout, this.propExtra[layout['class']]());
        }
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
        var currentLayout = view.getLayout();
        var newLayout = this.buildLayout();
        var layout = $.extend(true, {}, currentLayout, newLayout);

        Navy.Builder.setLayout(view, layout, function(view){
            var pageLayouts = Navy.Builder.getPageLayoutFromView(view);
            this.text(JSON.stringify(pageLayouts, null, 4));
        }.bind(this));
    },

    buildLayout: function() {
        var layout = {};

        layout['class'] = JSON.parse(this.propClass());
        this.inputToLayout('', layout, this.propBasic());
        this.inputToLayout('background-', layout, this.propBackground());
        this.inputToLayout('border-', layout, this.propBorder());

        if (this.propExtra[layout['class']]) {
            this.inputToLayout('extra-', layout, this.propExtra[layout['class']]());
        }

        return layout;
    },

    togglePropInput: function(vm, ev) {
        var $propInput = $(ev.srcElement).next();
        $propInput.toggle();
    },

    initObservable: function(){
        this.propClass = ko.observable();

        this.propBasic = ko.observableArray([
            {name: 'id', title: '"str"', value: ko.observable()},
            {name: 'pos', title: '[x, y]', value: ko.observable()},
            {name: 'size', title: '[width, height]', value: ko.observable()},
            {name: 'padding', title: 'num', value: ko.observable()},
            {name: 'paddings', title: '[top, right, bottom, left]', value: ko.observable()},
            {name: 'shadow-offset', title: '[x, y]', value: ko.observable()},
            {name: 'shadow-color', title: '#001122', value: ko.observable()},
            {name: 'shadow-blur', title: 'num', value: ko.observable()}
        ]);

        this.propBackground = ko.observableArray([
            {name: 'src', title: '"image/foo.png"', value: ko.observable()},
            {name: 'alpha', title: 'num', value: ko.observable()},
            {name: 'color', title: '"#001122"', value: ko.observable()},
            {name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {name: 'radius', title: 'num', value: ko.observable()},
            {name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()}
        ]);

        this.propBorder = ko.observableArray([
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

        this.propExtra = {};

        this.propExtra.ViewGroup = ko.observableArray([
            {name: 'ref', title: '"layout/foo.json"', value: ko.observable()}
        ]);

        this.propExtra.Text = ko.observableArray([
            {name: 'style', title: '"normal | italic | oblique"', value: ko.observable()},
            {name: 'weight', title: '"normal | bold | bolder | lighter"', value: ko.observable()},
            {name: 'text', title: '"str"', value: ko.observable()},
            {name: 'color', title: '"#001122"', value: ko.observable()},
            {name: 'size', title: 'num', value: ko.observable()},
            {name: 'valign', title: '"top | middle | bottom"', value: ko.observable()},
            {name: 'halign', title: '"left | center | right"', value: ko.observable()},
            {name: 'cutend', title: '"str"', value: ko.observable()}
        ]);

        this.propExtra.Image = ko.observableArray([
            {name: 'src', title: '"image/foo.png"', value: ko.observable()}
        ]);

        this.propExtra.Button = ko.observableArray([
            {name: 'link', title: '"page name"', value: ko.observable()},
            {separator: true, name: 'normal > background', title: ''},
            {prefix: 'normal-background-', name: 'src', title: '"image/foo.png"', value: ko.observable()},
            {prefix: 'normal-background-', name: 'alpha', title: 'num', value: ko.observable()},
            {prefix: 'normal-background-', name: 'color', title: '"#001122"', value: ko.observable()},
            {prefix: 'normal-background-', name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {prefix: 'normal-background-', name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {prefix: 'normal-background-', name: 'radius', title: 'num', value: ko.observable()},
            {prefix: 'normal-background-', name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()},
            {separator: true, name: 'tapped > background', title: ''},
            {prefix: 'tapped-background-', name: 'src', title: '"image/foo.png"', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'alpha', title: 'num', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'color', title: '"#001122"', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'gradient-direction', title: '"top | right | bottom | left | top-right | top-left| bottom-right | bottom-left"', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'gradient-colorstop', title: '[[0, "#000030"], [0.5, "#000030"], [1, "#000010"], ...]', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'radius', title: 'num', value: ko.observable()},
            {prefix: 'tapped-background-', name: 'radiuses', title: '[top, right, bottom, left]', value: ko.observable()}
        ]);
    }
});

